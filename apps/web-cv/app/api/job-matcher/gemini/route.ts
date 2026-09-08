import { NextRequest, NextResponse } from 'next/server';
import { formatCandidatePromptContext } from '../../../../lib/candidate-profile';
import { buildFallbackSearchUrl, getPlatformMeta, sanitizeJobUrl } from '../../../../lib/job-links';
import { isAuthorized } from '../../../../lib/messages-auth';
import { checkRateLimit, getClientIp } from '../../../../lib/rate-limit';
import type {
  CandidateProfileContext,
  GeminiGroundingResponse,
  JobOpportunity,
  SearchFilterState
} from '../../../../lib/types/job-matcher';

interface GeminiJobMatcherRequestBody {
  candidateContext: CandidateProfileContext;
  filters: SearchFilterState;
  model?: string;
}

const PRIMARY_MODEL = 'gemini-3.7-flash';
const FALLBACK_MODELS = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];

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

  const platformScopeInstructions: Record<string, string> = {
    all: 'Search across all 18+ indexed platforms: Glassdoor, Indeed, LinkedIn, Wellfound (AngelList), Wuzzuf, Forasna (فرصنا), Bayt (بيت), Baeed (بعيد), Nafezly (نفذلي), Khamsat (خمسات), Ureed (أريد), Freelancer, Workana, Kafiil (كفيل), Bahr (بحر), PartTime (بارتايم), RemoteOK, and WeWorkRemotely.',
    mena: 'Focus specifically on Egypt and Arab regional hiring boards: Wuzzuf, Forasna (فرصنا), Bayt (بيت.كوم), Baeed (بعيد), Bahr (بحر), and Nafezly (نفذلي).',
    remote: 'Focus specifically on remote tech portals: Baeed (بعيد - premier Arabic remote site), RemoteOK, WeWorkRemotely, and Wellfound (AngelList).',
    freelance: 'Focus on project-based freelance platforms: Nafezly (نفذلي), Khamsat (خمسات), Ureed (أريد), Freelancer.com, Workana, Kafiil (كفيل), and Bahr (بحر).',
    corporate: 'Focus on large tech employment boards: LinkedIn, Indeed, Glassdoor, Bayt, Wuzzuf, and PartTime (بارتايم).'
  };

  return `
You are an expert technical career matcher and executive talent scout.
Your goal is to use your live Google Search tool to search for real-world, active job openings published recently that match the candidate's verified profile across verified job boards and freelance ecosystems.

${profileBlock}

[SEARCH CONSTRAINTS & TARGETING]
Location Target: ${locationInstructions[filters.locationFilter] || locationInstructions.all}
Role Specialization Target: ${roleInstructions[filters.roleFocus] || roleInstructions.all}
Platform Scope Focus: ${platformScopeInstructions[filters.platformScope || 'all']}
Minimum Desired Match Score: ${filters.minScore}%

[SUPPORTED PLATFORMS & SITES DIRECTORY]
Sourced roles should be attributed to one of these 18+ platforms:
1. Glassdoor (Global tech companies & active hiring)
2. Nafezly / نفذلي (Arab freelance projects & tech micro-contracts)
3. Forasna / فرصنا (Egypt & MENA diverse tech positions)
4. Ureed / أريد (High-tier professional freelance platform)
5. Baeed / بعيد (Premier Arabic remote-first jobs platform)
6. Bahr / بحر (Saudi Arabia & Gulf freelance projects)
7. Wellfound / AngelList (Startups & venture-backed tech engineering)
8. Indeed (Global multi-industry vacancies & enterprise tech)
9. Khamsat / خمسات (Microservices, programming gigs & freelance requests)
10. Bayt / بيت.كوم (Top Middle East & North Africa career portal)
11. Part-Time / بارتايم (Part-time, flexible & hybrid tech opportunities)
12. Workana (Latin America & international freelance engineering)
13. Freelancer (Global contracts & technical project bidding)
14. Kafiil / كفيل (Freelance competitions & project awards)
15. LinkedIn (Professional network & direct applications)
16. Wuzzuf (Egypt & MENA enterprise hiring)
17. RemoteOK (Worldwide remote software roles)
18. WeWorkRemotely (Premier remote community)

[LIVE SEARCH INSTRUCTIONS]
1. Use the googleSearch tool to perform live searches for current open positions or projects on the above boards.
2. Find between 4 and 8 distinct, active job openings or projects that align with the candidate's skills.
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.error?.message || response.statusText;

    const err = new Error(message);
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      (err as any).type = 'AUTH_ERROR';
    } else if (response.status === 429) {
      (err as any).type = 'RATE_LIMIT';
    } else {
      (err as any).type = 'NETWORK_ERROR';
    }
    (err as any).status = response.status;
    (err as any).rawDetails = message;
    throw err;
  }

  return response.json();
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

  // 2. Rate-limiting
  const ip = getClientIp(request);
  const { allowed, retryAfterMs } = checkRateLimit(`gemini-matcher:${ip}`);
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

  // 3. API Key from Server Environment (with client header fallback)
  const envKey = process.env.GEMINI_API_KEY?.trim();
  const headerKey = request.headers.get('x-gemini-key')?.trim();
  const apiKey = envKey || headerKey;

  if (!apiKey) {
    return NextResponse.json(
      {
        status: 'error',
        error: {
          type: 'AUTH_ERROR',
          message: 'GEMINI_API_KEY is not configured in .env.local on the server. Please set GEMINI_API_KEY.'
        }
      },
      { status: 400 }
    );
  }

  try {
    const body: GeminiJobMatcherRequestBody = await request.json();
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
    const initialModel = model?.trim() || PRIMARY_MODEL;
    const modelsToTry = [
      initialModel,
      ...FALLBACK_MODELS.filter((m) => m !== initialModel)
    ];

    let responseData: GeminiGroundingResponse | null = null;
    let lastError: any = null;

    for (const targetModel of modelsToTry) {
      try {
        responseData = await callGeminiApi(targetModel, apiKey, prompt);
        if (responseData) break;
      } catch (err: any) {
        lastError = err;
        if (err?.type === 'AUTH_ERROR' || err?.type === 'RATE_LIMIT') {
          throw err;
        }
      }
    }

    if (!responseData) {
      throw lastError || new Error(`Gemini API connection failed for models: ${modelsToTry.join(', ')}`);
    }

    const candidatePart = responseData.candidates?.[0];
    const responseText = candidatePart?.content?.parts?.map((p) => p.text).join('\n') || '';
    const rawJobs = parseJobsFromResponse(responseText);

    const webQueries = candidatePart?.groundingMetadata?.webSearchQueries || [];
    const groundingChunks = candidatePart?.groundingMetadata?.groundingChunks || [];

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
      const platformMeta = getPlatformMeta(item.sourcePlatform);
      const directUrl = sanitizeJobUrl(item.url);
      const resolvedUrl =
        directUrl || groundingChunks[index]?.web?.uri || platformMeta.buildSearchUrl(title, company);
      const fallbackSearchUrl = buildFallbackSearchUrl(title, company, location, platformMeta.name);

      const rawScore = typeof item.matchScore === 'number' ? item.matchScore : 75;
      const matchScore = Math.max(0, Math.min(100, Math.round(rawScore)));

      const slug = `${title}-${company}-${index}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      return {
        id: slug || `gemini-job-${Date.now()}-${index}`,
        title,
        company,
        location,
        isRemote: Boolean(item.isRemote || location.toLowerCase().includes('remote')),
        sourcePlatform: platformMeta.name || item.sourcePlatform || 'LinkedIn',
        url: resolvedUrl || undefined,
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

    return NextResponse.json({
      status: 'success',
      result: {
        jobs: normalizedJobs,
        searchQueriesUsed: webQueries,
        totalDiscovered: normalizedJobs.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    const errorType = err?.type || 'NETWORK_ERROR';
    const message = err?.message || 'An error occurred while communicating with Gemini.';
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
