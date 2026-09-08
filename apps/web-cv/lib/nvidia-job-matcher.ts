import type {
  CandidateProfileContext,
  JobMatchBatchResult,
  JobMatcherError,
  SearchFilterState
} from './types/job-matcher';

/**
 * Dispatches an NVIDIA NIM job search & matching request through the Next.js server route.
 * Credentials: Uses server-configured NVIDIA_API_KEY from .env.local by default,
 * with credentials: 'include' for the admin session cookie.
 */
export async function executeNvidiaJobMatch(
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
    headers['x-nvidia-key'] = cleanKey;
  }

  try {
    const response = await fetch('/api/job-matcher/nvidia', {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({
        candidateContext: candidate,
        filters,
        model: preferredModel || 'moonshotai/kimi-k3'
      })
    });

    const data = await response.json();

    if (!response.ok || data.status === 'error') {
      const err: JobMatcherError = {
        type: data?.error?.type || 'NETWORK_ERROR',
        message: data?.error?.message || 'NVIDIA NIM search request failed.',
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
      message: 'Failed to connect to the NVIDIA job matcher service.',
      rawDetails: err?.message || String(err)
    };
    throw error;
  }
}
