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

interface NvidiaJobMatcherRequestBody {
  candidateContext: CandidateProfileContext;
  filters: SearchFilterState;
  model?: string;
}

const NVIDIA_INVOKE_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_MODEL = 'moonshotai/kimi-k3';

import { getPlatformMeta } from '../../../../lib/job-links';

function buildSearchPrompt(candidate: CandidateProfileContext, filters: SearchFilterState): string {
  const profileBlock = formatCandidatePromptContext(candidate);

  const locationInstructions: Record<SearchFilterState['locationFilter'], string> = {
    all: 'Search across Egypt, the MENA region, and global remote opportunities.',
    egypt: 'Focus specifically on active opportunities located in Egypt (Cairo, Giza, Alexandria) on platforms like Wuzzuf, Forasna, and LinkedIn.',
    mena: 'Focus on opportunities across the MENA region (Egypt, UAE, Saudi Arabia, Qatar, Gulf) including regional remote roles on Bayt, Bahr, and Baeed.',
    remote: 'Focus specifically on worldwide or EMEA remote engineering roles on platforms like Baeed, RemoteOK, WeWorkRemotely, Wellfound, and LinkedIn.'
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
Your goal is to search for and identify real-world, active or recently published job openings and freelance opportunities that closely match the candidate's verified profile.

${profileBlock}

[SEARCH CONSTRAINTS & TARGETING]
Location Target: ${locationInstructions[filters.locationFilter] || locationInstructions.all}
Role Specialization Target: ${roleInstructions[filters.roleFocus] || roleInstructions.all}
Platform Scope Focus: ${platformScopeInstructions[filters.platformScope || 'all']}
Minimum Desired Match Score: ${filters.minScore}%

[SUPPORTED SITES & DIRECTORY TO SOURCE FROM]
You must search and attribute opportunities to one of the following platforms:
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
15. LinkedIn (Professional network corporate & tech vacancies)
16. Wuzzuf (Leading Egyptian software & technology employment board)
17. RemoteOK (Global remote developer postings)
18. WeWorkRemotely (Worldwide remote engineering)

[MATCHING & DISCOVERY INSTRUCTIONS]
1. Identify between 4 and 8 distinct, realistic, active job or project openings across these platforms that align with the candidate's verified skills.
2. For each opening:
   - sourcePlatform: specify the exact platform from the list above (e.g. Glassdoor, Baeed, Nafezly, Bayt, Indeed, Forasna, Khamsat, etc.).
   - Assign an objective matchScore integer between 0 and 100.
   - Identify 2 to 4 specific matching strengths (skills candidate has that the job requires).
   - Identify 1 to 3 missing or gap skills (requirements or nice-to-haves candidate could learn).
   - Provide a concise 1-2 sentence match summary explaining candidate fit.
   - Extract or provide the direct posting link or search URL if available.

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
    "sourcePlatform": "Glassdoor",
    "url": "https://www.glassdoor.com/...",
    "matchScore": 88,
    "strengths": ["Strong TypeScript and NestJS experience", "PostgreSQL schema knowledge"],
    "missingSkills": ["Kafka", "Docker Swarm"],
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
  const { allowed, retryAfterMs } = checkRateLimit(`nvidia-matcher:${ip}`);
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
  const envKey = process.env.NVIDIA_API_KEY?.trim();
  const headerKey = (
    request.headers.get('x-nvidia-key') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  )?.trim();

  const cleanKey = envKey || headerKey;
  if (!cleanKey) {
    return NextResponse.json(
      {
        status: 'error',
        error: {
          type: 'AUTH_ERROR',
          message: 'NVIDIA_API_KEY is not configured in .env.local on the server. Please set NVIDIA_API_KEY or arm it in the session.'
        }
      },
      { status: 400 }
    );
  }

  try {
    const body: NvidiaJobMatcherRequestBody = await request.json();
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
    const targetModel = (model || '').trim() || DEFAULT_MODEL;

    const payload = {
      model: targetModel,
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
      max_tokens: 8192,
      temperature: 0.7,
      seed: 0
    };

    const response = await fetch(NVIDIA_INVOKE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleanKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      const errMessage = errJson?.error?.message || response.statusText;

      if (response.status === 401 || response.status === 403) {
        const err = new Error('Invalid or unauthorized NVIDIA API key. Please check your credentials at build.nvidia.com.');
        (err as any).type = 'AUTH_ERROR';
        (err as any).rawDetails = errMessage;
        throw err;
      }

      if (response.status === 429) {
        const err = new Error('NVIDIA API Rate Limit or quota reached. Please wait a moment and try again.');
        (err as any).type = 'RATE_LIMIT';
        (err as any).rawDetails = errMessage;
        throw err;
      }

      const err = new Error(`NVIDIA request failed (${response.status}): ${errMessage}`);
      (err as any).type = 'NETWORK_ERROR';
      (err as any).rawDetails = errMessage;
      throw err;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    const rawJobs = parseJobsFromResponse(text);

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
      const directUrl = sanitizeJobUrl(item.url) || platformMeta.buildSearchUrl(title, company);
      const fallbackSearchUrl = buildFallbackSearchUrl(title, company, location, platformMeta.name);

      const rawScore = typeof item.matchScore === 'number' ? item.matchScore : 80;
      const matchScore = Math.max(0, Math.min(100, Math.round(rawScore)));

      const slug = `${title}-${company}-${index}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      return {
        id: slug || `nvidia-job-${Date.now()}-${index}`,
        title,
        company,
        location,
        isRemote: Boolean(item.isRemote || location.toLowerCase().includes('remote')),
        sourcePlatform: platformMeta.name || item.sourcePlatform || 'LinkedIn',
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
      'Moonshot Kimi-K3 Technical Compatibility Match',
      'TypeScript NestJS Node.js Developer Hiring'
    ];

    return NextResponse.json({
      status: 'success',
      result: {
        jobs: normalizedJobs,
        searchQueriesUsed: defaultQueries,
        totalDiscovered: normalizedJobs.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    const errorType = err?.type || 'NETWORK_ERROR';
    const message = err?.message || 'An unexpected error occurred while communicating with NVIDIA NIM.';
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
