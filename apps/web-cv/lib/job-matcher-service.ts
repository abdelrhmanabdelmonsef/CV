import { executeGeminiServerJobMatch } from './gemini-server-job-matcher';
import { executeNvidiaJobMatch } from './nvidia-job-matcher';
import { executeOpenAIJobMatch } from './openai-job-matcher';
import { detectKeyProvider } from './session-storage-key';
import type {
  AIProvider,
  CandidateProfileContext,
  JobMatchBatchResult,
  SearchFilterState
} from './types/job-matcher';

/**
 * Unified job matcher coordinator.
 * Directs search requests to the protected server endpoints for NVIDIA NIM, OpenAI, or Gemini,
 * leveraging server-side .env.local credentials and admin session authentication.
 */
export async function executeJobMatch(
  provider: AIProvider,
  apiKey: string | undefined,
  candidate: CandidateProfileContext,
  filters: SearchFilterState,
  preferredModel?: string
): Promise<JobMatchBatchResult> {
  const detectedProvider = apiKey ? detectKeyProvider(apiKey) : null;
  const activeProvider = detectedProvider || provider || 'nvidia';

  if (activeProvider === 'nvidia') {
    const modelToUse = preferredModel?.includes('/') ? preferredModel : 'moonshotai/kimi-k3';
    return executeNvidiaJobMatch(apiKey, candidate, filters, modelToUse);
  }

  if (activeProvider === 'openai') {
    const modelToUse = preferredModel?.startsWith('gpt') ? preferredModel : 'gpt-4o';
    return executeOpenAIJobMatch(apiKey, candidate, filters, modelToUse);
  }

  const modelToUse = preferredModel?.startsWith('gemini') ? preferredModel : 'gemini-3.7-flash';
  return executeGeminiServerJobMatch(apiKey, candidate, filters, modelToUse);
}
