/**
 * Type definitions and contracts for AI Job Matcher feature
 */

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  sourcePlatform: 'LinkedIn' | 'Wuzzuf' | 'RemoteOK' | 'WeWorkRemotely' | 'Other' | string;
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

export interface SessionCredentials {
  provider: 'gemini' | 'openai';
  apiKey: string;
  status: 'unconfigured' | 'ready' | 'invalid';
  lastUsedAt?: number;
}

export type LocationFilter = 'all' | 'egypt' | 'mena' | 'remote';
export type RoleFocusFilter = 'all' | 'fullstack' | 'backend' | 'cybersecurity';

export interface SearchFilterState {
  locationFilter: LocationFilter;
  roleFocus: RoleFocusFilter;
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
