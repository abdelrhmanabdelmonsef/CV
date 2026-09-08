/**
 * Type definitions and contracts for AI Job Matcher feature
 */

export type JobPlatformType =
  | 'LinkedIn'
  | 'Wuzzuf'
  | 'Glassdoor'
  | 'Indeed'
  | 'Bayt'
  | 'Baeed'
  | 'Forasna'
  | 'Nafezly'
  | 'Khamsat'
  | 'Wellfound'
  | 'Freelancer'
  | 'Workana'
  | 'Ureed'
  | 'Kafiil'
  | 'Bahr'
  | 'PartTime'
  | 'RemoteOK'
  | 'WeWorkRemotely'
  | 'Other'
  | string;

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  sourcePlatform: JobPlatformType;
  url?: string;
  fallbackSearchUrl: string;
  matchScore: number; // 0 to 100
  strengths: string[];
  missingSkills: string[];
  summary: string;
  postedDate?: string;
}

export interface CandidateProfileContext {
  name: string;
  title: string;
  location: string;
  summary: string;
  topSkills: string[];
  experienceHighlights: string[];
  featuredProjects: string[];
  certifications: string[];
}

export type AIProvider = 'nvidia' | 'gemini' | 'openai';

export interface SessionCredentials {
  provider: AIProvider;
  apiKey: string;
  status: 'unconfigured' | 'ready' | 'invalid';
  lastUsedAt?: number;
}

export type LocationFilter = 'all' | 'egypt' | 'mena' | 'remote';
export type RoleFocusFilter = 'all' | 'fullstack' | 'backend' | 'cybersecurity';
export type PlatformScopeFilter = 'all' | 'mena' | 'remote' | 'freelance' | 'corporate';

export interface SearchFilterState {
  locationFilter: LocationFilter;
  roleFocus: RoleFocusFilter;
  platformScope?: PlatformScopeFilter;
  minScore: number;
}

export interface JobMatchBatchResult {
  jobs: JobOpportunity[];
  searchQueriesUsed: string[];
  totalDiscovered: number;
  timestamp: string;
}

export interface JobMatcherError {
  type: 'AUTH_ERROR' | 'RATE_LIMIT' | 'NETWORK_ERROR' | 'PARSE_ERROR' | 'EMPTY_RESULTS';
  message: string;
  rawDetails?: string;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface GroundingMetadata {
  webSearchQueries?: string[];
  groundingChunks?: GroundingChunk[];
  groundingSupports?: Array<{
    groundingChunkIndices?: number[];
    confidenceScores?: number[];
    segment?: {
      startIndex?: number;
      endIndex?: number;
      text?: string;
    };
  }>;
  searchEntryPoint?: {
    renderedContent?: string;
  };
}

export interface GeminiCandidate {
  content: {
    parts: Array<{
      text: string;
    }>;
    role: string;
  };
  finishReason?: string;
  groundingMetadata?: GroundingMetadata;
}

export interface GeminiGroundingResponse {
  candidates?: GeminiCandidate[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}
