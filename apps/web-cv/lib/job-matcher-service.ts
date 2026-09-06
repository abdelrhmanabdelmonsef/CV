import { executeGeminiServerJobMatch } from './gemini-server-job-matcher';
import { executeOpenAIJobMatch } from './openai-job-matcher';
import { detectKeyProvider } from './session-storage-key';
import type {
  CandidateProfileContext,
  JobMatchBatchResult,
  SearchFilterState
} from './types/job-matcher';

/**
 * Unified job matcher coordinator.
 * Directs search requests to the protected server endpoints for Gemini or OpenAI,
 * leveraging server-side .env.local credentials and admin session authentication.
 */
export async function executeJobMatch(
  provider: 'gemini' | 'openai',
  apiKey: string | undefined,
  candidate: CandidateProfileContext,
  filters: SearchFilterState,
  preferredModel?: string
): Promise<JobMatchBatchResult> {
  const detectedProvider = apiKey ? detectKeyProvider(apiKey) : null;
  const activeProvider = detectedProvider || provider;

  if (activeProvider === 'openai') {
    const modelToUse = preferredModel?.startsWith('gemini') ? 'gpt-4o' : preferredModel;
    return executeOpenAIJobMatch(apiKey, candidate, filters, modelToUse);
  }

  const modelToUse = preferredModel?.startsWith('gpt') ? 'gemini-3.7-flash' : preferredModel;
  return executeGeminiServerJobMatch(apiKey, candidate, filters, modelToUse);
}
