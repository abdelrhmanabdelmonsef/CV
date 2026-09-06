import type {
  CandidateProfileContext,
  JobMatchBatchResult,
  JobMatcherError,
  SearchFilterState
} from './types/job-matcher';

/**
 * Dispatches a Google Gemini job search & matching request through the Next.js server route.
 * Credentials: Uses server-configured GEMINI_API_KEY from .env.local by default,
 * with credentials: 'include' for the admin session cookie.
 */
export async function executeGeminiServerJobMatch(
  apiKey: string | undefined,
  candidate: CandidateProfileContext,
  filters: SearchFilterState,
  preferredModel?: string
): Promise<JobMatchBatchResult> {
  const cleanKey = (apiKey || '').trim();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (cleanKey) {
    headers['x-gemini-key'] = cleanKey;
  }

  try {
    const response = await fetch('/api/job-matcher/gemini', {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({
        candidateContext: candidate,
        filters,
        model: preferredModel || 'gemini-3.7-flash'
      })
    });

    const data = await response.json();

    if (!response.ok || data.status === 'error') {
      const err: JobMatcherError = {
        type: data?.error?.type || 'NETWORK_ERROR',
        message: data?.error?.message || 'Gemini search request failed.',
        rawDetails: data?.error?.rawDetails || response.statusText
      };
      throw err;
    }

    return data.result as JobMatchBatchResult;
  } catch (err: any) {
    if (err?.type) {
      throw err;
    }
    const error: JobMatcherError = {
      type: 'NETWORK_ERROR',
      message: 'Failed to connect to the Gemini job matcher service.',
      rawDetails: err?.message || String(err)
    };
    throw error;
  }
}
