import { formatCandidatePromptContext } from './candidate-profile';
import { buildFallbackSearchUrl, sanitizeJobUrl } from './job-links';
import type {
  CandidateProfileContext,
  GeminiGroundingResponse,
  JobMatchBatchResult,
  JobMatcherError,
  JobOpportunity,
  SearchFilterState
} from './types/job-matcher';

const PRIMARY_MODEL = 'gemini-3.6-flash';
const FALLBACK_MODELS = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];

/**
 * Constructs the targeted live search prompt for Gemini with Google Search tool.
 */
function buildSearchPrompt(candidate: CandidateProfileContext, filters: SearchFilterState): string {
  const profileBlock = formatCandidatePromptContext(candidate);

  const locationInstructions: Record<SearchFilterState['locationFilter'], string> = {
    all: 'Search across Egypt, the MENA region, and global remote opportunities.',
    egypt: 'Focus specifically on active opportunities located in Egypt (Cairo, Giza, Alexandria) on platforms like Wuzzuf and LinkedIn.',
    mena: 'Focus on opportunities across the MENA region (Egypt, UAE, Saudi Arabia, Qatar, Gulf) including regional remote roles.',
    remote: 'Focus specifically on worldwide or EMEA remote engineering roles on platforms like RemoteOK, WeWorkRemotely, and LinkedIn.'
  };

  const roleInstructions: Record<SearchFilterState['roleFocus'], string> = {
    all: 'Search for roles in Software Engineering, Full-Stack Development (Node.js/NestJS/TypeScript/Next.js), Backend Systems, and Web Application Security/Pentesting.',
    fullstack: 'Focus on Full-Stack Engineer / Full-Stack Developer roles emphasizing TypeScript, React/Next.js, and Node.js/NestJS.',
    backend: 'Focus on Backend Engineer / Backend Developer roles emphasizing Node.js, Express, NestJS, REST APIs, PostgreSQL, Redis, and queues.',
    cybersecurity: 'Focus on Cybersecurity roles, Web Application Penetration Tester, Security Engineer, or Application Security (AppSec) roles.'
  };

  return `
You are an expert technical career matcher and executive talent scout.
Your goal is to use your live Google Search tool to search for real-world, active job openings published recently that match the candidate's verified profile.

${profileBlock}

[SEARCH CONSTRAINTS & TARGETING]
Location Target: ${locationInstructions[filters.locationFilter]}
Role Specialization Target: ${roleInstructions[filters.roleFocus]}
Minimum Desired Match Score: ${filters.minScore}%

[LIVE SEARCH INSTRUCTIONS]
1. Use the googleSearch tool to perform live searches for current open positions on job boards such as LinkedIn, Wuzzuf, RemoteOK, and company career portals.
2. Find between 4 and 8 distinct, active job openings that align with the candidate's skills.
3. For each opening found, compare the actual required skills against the candidate's profile:
   - Assign an objective matchScore integer between 0 and 100.
   - Identify 2 to 4 specific matching strengths (skills candidate has that job requires).
   - Identify 1 to 3 missing or gap skills (requirements or nice-to-haves candidate could learn).
   - Provide a concise 1-2 sentence match summary explaining fit.
   - Extract the direct posting link if available.

[OUTPUT FORMAT]
You MUST respond with a valid JSON array of objects inside a fenced \`\`\`json code block. Do NOT include markdown commentary outside the JSON block.

Schema:
\`\`\`json
[
  {
    "title": "Software Engineer / Backend",
    "company": "Company Name",
    "location": "Cairo, Egypt or Remote",
    "isRemote": true,
    "sourcePlatform": "LinkedIn or Wuzzuf or RemoteOK",
    "url": "https://...",
    "matchScore": 85,
    "strengths": ["Strong TypeScript and NestJS experience", "PostgreSQL schema knowledge"],
    "missingSkills": ["AWS Lambda", "Docker Swarm"],
    "summary": "Excellent fit for backend API development using NestJS and relational databases."
  }
]
\`\`\`
`.trim();
}

/**
 * Calls Gemini API with Google Search grounding.
 */
async function callGeminiApi(
  model: string,
  apiKey: string,
  prompt: string
): Promise<GeminiGroundingResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    tools: [
      {
        googleSearch: {}
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2500
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }

    if (response.status === 400 || response.status === 401 || response.status === 403) {
      const err: JobMatcherError = {
        type: 'AUTH_ERROR',
        message: 'Invalid or unauthorized Gemini API key. Please check your credentials.',
        rawDetails: errorData?.error?.message || response.statusText
      };
      throw err;
    }

    if (response.status === 429) {
      const err: JobMatcherError = {
        type: 'RATE_LIMIT',
        message: 'Gemini API quota or rate limit exceeded. Please wait a moment before trying again.',
        rawDetails: errorData?.error?.message || response.statusText
      };
      throw err;
    }

    const err: JobMatcherError = {
      type: 'NETWORK_ERROR',
      message: `Gemini API request failed with status ${response.status}`,
      rawDetails: errorData?.error?.message || response.statusText
    };
    throw err;
  }

  return response.json();
}

/**
 * Extracts and parses the JSON array from model text response.
 */
function parseJobsFromResponse(text: string): Partial<JobOpportunity>[] {
  const cleaned = text.trim();
  const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonString = jsonMatch ? jsonMatch[1] : cleaned;

  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    // Attempt fallback array extraction
    const arrayMatch = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]);
      } catch {
        return [];
      }
    }
    return [];
  }
}

/**
 * Executes a live job matching discovery session.
 */
export async function executeLiveJobMatch(
  apiKey: string,
  candidate: CandidateProfileContext,
  filters: SearchFilterState,
  preferredModel?: string
): Promise<JobMatchBatchResult> {
  const cleanKey = (apiKey || '').trim();
  if (!cleanKey) {
    const err: JobMatcherError = {
      type: 'AUTH_ERROR',
      message: 'No API key provided. Please arm your Gemini API key in the configuration drawer.'
    };
    throw err;
  }

  const prompt = buildSearchPrompt(candidate, filters);

  const initialModel = preferredModel?.trim() || PRIMARY_MODEL;
  const modelsToTry = [
    initialModel,
    ...FALLBACK_MODELS.filter((m) => m !== initialModel)
  ];

  let responseData: GeminiGroundingResponse | null = null;
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      responseData = await callGeminiApi(model, cleanKey, prompt);
      if (responseData) break;
    } catch (err: any) {
      lastError = err;
      // Immediately re-throw critical auth or quota errors
      if (err?.type === 'AUTH_ERROR' || err?.type === 'RATE_LIMIT') {
        throw err;
      }
      // On 404 / discontinued model error, continue loop to try fallback model
    }
  }

  if (!responseData) {
    throw (
      lastError || {
        type: 'NETWORK_ERROR',
        message: `Failed to connect to Gemini API. Attempted models: ${modelsToTry.join(', ')}`
      }
    );
  }

  const candidatePart = responseData.candidates?.[0];
  const responseText = candidatePart?.content?.parts?.map((p) => p.text).join('\n') || '';
  const rawJobs = parseJobsFromResponse(responseText);

  const webQueries = candidatePart?.groundingMetadata?.webSearchQueries || [];
  const groundingChunks = candidatePart?.groundingMetadata?.groundingChunks || [];

  if (rawJobs.length === 0) {
    const err: JobMatcherError = {
      type: 'EMPTY_RESULTS',
      message: 'No active job opportunities were found matching these criteria. Try broadening your location or role focus.'
    };
    throw err;
  }

  const normalizedJobs: JobOpportunity[] = rawJobs.map((item, index) => {
    const title = item.title || 'Software Engineer';
    const company = item.company || 'Tech Employer';
    const location = item.location || (item.isRemote ? 'Remote' : 'Cairo, Egypt');
    const directUrl = sanitizeJobUrl(item.url);
    const fallbackSearchUrl = buildFallbackSearchUrl(title, company, location);

    // If direct URL is missing, check if grounding chunk provided an external URL
    const resolvedUrl =
      directUrl ||
      groundingChunks[index]?.web?.uri ||
      undefined;

    const rawScore = typeof item.matchScore === 'number' ? item.matchScore : 75;
    const matchScore = Math.max(0, Math.min(100, Math.round(rawScore)));

    const slug = `${title}-${company}-${index}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return {
      id: slug || `job-${Date.now()}-${index}`,
      title,
      company,
      location,
      isRemote: Boolean(item.isRemote || location.toLowerCase().includes('remote')),
      sourcePlatform: item.sourcePlatform || 'LinkedIn',
      url: resolvedUrl,
      fallbackSearchUrl,
      matchScore,
      strengths: Array.isArray(item.strengths) && item.strengths.length > 0
        ? item.strengths
        : ['Technical engineering foundation', 'Problem-solving abilities'],
      missingSkills: Array.isArray(item.missingSkills)
        ? item.missingSkills
        : [],
      summary: item.summary || `Strong match for ${title} based on candidate qualifications.`
    };
  });

  return {
    jobs: normalizedJobs,
    searchQueriesUsed: webQueries,
    totalDiscovered: normalizedJobs.length,
    timestamp: new Date().toISOString()
  };
}
