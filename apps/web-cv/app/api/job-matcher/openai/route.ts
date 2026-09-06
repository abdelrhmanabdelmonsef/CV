import { NextRequest, NextResponse } from 'next/server';
import { formatCandidatePromptContext } from '../../../../lib/candidate-profile';
import { buildFallbackSearchUrl, sanitizeJobUrl } from '../../../../lib/job-links';
import { isAuthorized } from '../../../../lib/messages-auth';
import { checkRateLimit, getClientIp } from '../../../../lib/rate-limit';
import type {
  CandidateProfileContext,
  JobOpportunity,
  SearchFilterState
} from '../../../../lib/types/job-matcher';

interface OpenAIJobMatcherRequestBody {
  candidateContext: CandidateProfileContext;
  filters: SearchFilterState;
  model?: string;
}

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
Your goal is to search for real-world, active job openings published recently that match the candidate's verified profile.

${profileBlock}

[SEARCH CONSTRAINTS & TARGETING]
Location Target: ${locationInstructions[filters.locationFilter] || locationInstructions.all}
Role Specialization Target: ${roleInstructions[filters.roleFocus] || roleInstructions.all}
Minimum Desired Match Score: ${filters.minScore}%

[LIVE SEARCH & MATCHING INSTRUCTIONS]
1. Search for active job postings on job boards such as LinkedIn, Wuzzuf, RemoteOK, and corporate career sites.
2. Identify between 4 and 8 distinct, active job openings that align with the candidate's skills.
3. For each opening, compare the actual required skills against the candidate's profile:
   - Assign an objective matchScore integer between 0 and 100.
   - Identify 2 to 4 specific matching strengths (skills candidate has that job requires).
   - Identify 1 to 3 missing or gap skills (requirements or nice-to-haves candidate could learn).
   - Provide a concise 1-2 sentence match summary explaining fit.
   - Extract the direct posting link if available.

[OUTPUT FORMAT]
You MUST respond with a valid JSON array of objects inside a fenced \`\`\`json code block. Do NOT include commentary outside the JSON block.

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
 * Robustly parses jobs array from model text response.
 */
function parseJobsFromResponse(text: string): Partial<JobOpportunity>[] {
  const cleaned = (text || '').trim();
  const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonString = jsonMatch ? jsonMatch[1] : cleaned;

  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.jobs)) {
      return parsed.jobs;
    }
    return [];
  } catch {
    const arrayMatch = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      try {
        const parsed = JSON.parse(arrayMatch[0]);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [];
      }
    }
    return [];
  }
}

/**
 * Attempts to call OpenAI Responses API with web_search tool.
 */
async function callOpenAIResponses(
  apiKey: string,
  model: string,
  prompt: string
): Promise<{ text: string; queries: string[] } | null> {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4o',
      input: prompt,
      tools: [{ type: 'web_search' }]
    })
  });

  if (!response.ok) {
    // If not supported (404/400), return null to trigger fallback
    if (response.status === 404 || response.status === 400 || response.status === 422) {
      return null;
    }

    const errJson = await response.json().catch(() => null);
    const errMessage = errJson?.error?.message || response.statusText;

    if (response.status === 401 || response.status === 403) {
      const err = new Error(errMessage);
      (err as any).type = 'AUTH_ERROR';
      throw err;
    }
    if (response.status === 429) {
      const err = new Error(errMessage);
      (err as any).type = 'RATE_LIMIT';
      throw err;
    }

    return null;
  }

  const data = await response.json();
  const queries: string[] = [];

  // Extract text from responses output array
  let textOutput = '';
  if (Array.isArray(data.output)) {
    for (const item of data.output) {
      if (item.type === 'message' && Array.isArray(item.content)) {
        for (const part of item.content) {
          if (part.type === 'output_text' && part.text) {
            textOutput += part.text + '\n';
          }
        }
      }
      if (item.type === 'tool_call' && item.name === 'web_search') {
        const q = item.arguments?.query || item.arguments?.queries;
        if (typeof q === 'string') queries.push(q);
        if (Array.isArray(q)) queries.push(...q);
      }
    }
  }

  return { text: textOutput || data.output_text || '', queries };
}

/**
 * Standard Chat Completions API fallback.
 */
async function callOpenAIChatCompletions(
  apiKey: string,
  model: string,
  prompt: string
): Promise<{ text: string; queries: string[] }> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert technical career matcher and executive talent scout. You discover active vacancies and calculate precise fit against verified developer credentials.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => null);
    const errMessage = errJson?.error?.message || response.statusText;

    if (response.status === 401 || response.status === 403) {
      const err = new Error('Invalid or unauthorized OpenAI API key. Please verify your credentials at platform.openai.com.');
      (err as any).type = 'AUTH_ERROR';
      (err as any).rawDetails = errMessage;
      throw err;
    }

    if (response.status === 429) {
      const isQuota =
        errMessage.toLowerCase().includes('quota') ||
        errMessage.toLowerCase().includes('billing') ||
        errMessage.toLowerCase().includes('insufficient_quota');
      const friendlyMessage = isQuota
        ? 'OpenAI Quota Exceeded: Your OpenAI account has exhausted its usage credits or has no active balance. Please check your billing at platform.openai.com or switch to Gemini.'
        : 'OpenAI Rate Limit: Too many requests were sent in a short period. Please wait 15-30 seconds and retry.';
      const err = new Error(friendlyMessage);
      (err as any).type = 'RATE_LIMIT';
      (err as any).rawDetails = errMessage;
      throw err;
    }

    const err = new Error(`OpenAI request failed: ${errMessage}`);
    (err as any).type = 'NETWORK_ERROR';
    (err as any).rawDetails = errMessage;
    throw err;
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  return { text, queries: [] };
}

export async function POST(request: NextRequest) {
  // 1. Admin Authentication Check
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        status: 'error',
        error: {
          type: 'AUTH_ERROR',
          message: 'Admin authorization required. Please authenticate at /jobs with your admin password.'
        }
      },
      { status: 401 }
    );
  }

  // 2. Rate-limit check based on client IP
  const ip = getClientIp(request);
  const { allowed, retryAfterMs } = checkRateLimit(`openai-matcher:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      {
        status: 'error',
        error: {
          type: 'RATE_LIMIT',
          message: 'Too many search requests. Please wait a moment before trying again.'
        }
      },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) }
      }
    );
  }

  // 3. API key from Server Environment (with client header fallback)
  const envKey = process.env.OPENAI_API_KEY?.trim();
  const headerKey = (
    request.headers.get('x-openai-key') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  )?.trim();

  const cleanKey = envKey || headerKey;
  if (!cleanKey) {
    return NextResponse.json(
      {
        status: 'error',
        error: {
          type: 'AUTH_ERROR',
          message: 'OPENAI_API_KEY is not configured in .env.local on the server. Please set OPENAI_API_KEY or switch to Gemini.'
        }
      },
      { status: 400 }
    );
  }

  try {
    const body: OpenAIJobMatcherRequestBody = await request.json();
    const { candidateContext, filters, model } = body;

    if (!candidateContext || !filters) {
      return NextResponse.json(
        {
          status: 'error',
          error: {
            type: 'PARSE_ERROR',
            message: 'Missing candidate profile context or search filter parameters.'
          }
        },
        { status: 400 }
      );
    }

    const prompt = buildSearchPrompt(candidateContext, filters);
    const targetModel = (model || '').trim() || 'gpt-4o';

    let result: { text: string; queries: string[] } | null = null;

    // 1. Try Responses API with web_search first
    try {
      result = await callOpenAIResponses(cleanKey, targetModel, prompt);
    } catch (err: any) {
      if (err?.type === 'AUTH_ERROR' || err?.type === 'RATE_LIMIT') {
        throw err;
      }
      result = null;
    }

    // 2. Fall back to Chat Completions API if Responses API is unavailable
    if (!result || !result.text) {
      result = await callOpenAIChatCompletions(cleanKey, targetModel, prompt);
    }

    const rawJobs = parseJobsFromResponse(result.text);

    if (rawJobs.length === 0) {
      return NextResponse.json(
        {
          status: 'error',
          error: {
            type: 'EMPTY_RESULTS',
            message: 'No active job opportunities were found matching these criteria. Try broadening your location or role focus.'
          }
        },
        { status: 200 }
      );
    }

    const normalizedJobs: JobOpportunity[] = rawJobs.map((item, index) => {
      const title = item.title || 'Software Engineer';
      const company = item.company || 'Tech Employer';
      const location = item.location || (item.isRemote ? 'Remote' : 'Cairo, Egypt');
      const directUrl = sanitizeJobUrl(item.url);
      const fallbackSearchUrl = buildFallbackSearchUrl(title, company, location);

      const rawScore = typeof item.matchScore === 'number' ? item.matchScore : 75;
      const matchScore = Math.max(0, Math.min(100, Math.round(rawScore)));

      const slug = `${title}-${company}-${index}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      return {
        id: slug || `openai-job-${Date.now()}-${index}`,
        title,
        company,
        location,
        isRemote: Boolean(item.isRemote || location.toLowerCase().includes('remote')),
        sourcePlatform: item.sourcePlatform || 'LinkedIn',
        url: directUrl || undefined,
        fallbackSearchUrl,
        matchScore,
        strengths:
          Array.isArray(item.strengths) && item.strengths.length > 0
            ? item.strengths
            : ['Demonstrated technical proficiency', 'Core system architecture experience'],
        missingSkills: Array.isArray(item.missingSkills) ? item.missingSkills : [],
        summary: item.summary || `Strong match for ${title} based on candidate qualifications.`
      };
    });

    const defaultQueries = [
      `${filters.roleFocus !== 'all' ? filters.roleFocus : 'Software Engineer'} ${filters.locationFilter !== 'all' ? filters.locationFilter : 'Egypt Remote'}`,
      'TypeScript NestJS Node.js Developer hiring'
    ];

    return NextResponse.json({
      status: 'success',
      result: {
        jobs: normalizedJobs,
        searchQueriesUsed: result.queries.length > 0 ? result.queries : defaultQueries,
        totalDiscovered: normalizedJobs.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    const errorType = err?.type || 'NETWORK_ERROR';
    const message = err?.message || 'An unexpected error occurred while communicating with OpenAI.';
    const rawDetails = err?.rawDetails || String(err);

    const statusCode = errorType === 'AUTH_ERROR' ? 401 : errorType === 'RATE_LIMIT' ? 429 : 500;

    return NextResponse.json(
      {
        status: 'error',
        error: {
          type: errorType,
          message,
          rawDetails
        }
      },
      { status: statusCode }
    );
  }
}
