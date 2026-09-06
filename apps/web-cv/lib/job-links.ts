/**
 * Link utilities for external job application and resilient search fallbacks.
 */

/**
 * Validates and normalizes direct job application URLs.
 * Ensures the URL begins with http:// or https:// and is structurally valid.
 */
export function sanitizeJobUrl(rawUrl?: string): string | undefined {
  if (!rawUrl || typeof rawUrl !== 'string') return undefined;
  const trimmed = rawUrl.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Generates a pre-composed Google search fallback query URL.
 * Guarantees that users have an immediate pathway to find the active listing
 * even if the direct URL returned by web search has expired or is blocked.
 */
export function buildFallbackSearchUrl(title: string, company: string, location?: string): string {
  const cleanTitle = (title || '').trim();
  const cleanCompany = (company || '').trim();
  const cleanLocation = (location || '').trim();

  const queryParts = [cleanTitle, cleanCompany, cleanLocation, 'careers', 'apply', 'job'].filter(Boolean);
  const query = queryParts.join(' ');

  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/**
 * Standard safe external anchor attributes preventing tab-nabbing vulnerabilities.
 */
export const EXTERNAL_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer'
} as const;
