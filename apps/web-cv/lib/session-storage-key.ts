/**
 * Ephemeral client-side session storage helper for API keys.
 * Strictly adheres to Principle V: Defensive Secrets & Route Isolation.
 * Zero persistence to server databases, files, cookies, or localStorage.
 */

const STORAGE_KEY = 'cyber_hud_job_matcher_api_key';
const PROVIDER_KEY = 'cyber_hud_job_matcher_provider';
const MODEL_KEY = 'cyber_hud_job_matcher_model';

import type { AIProvider } from './types/job-matcher';

export const DEFAULT_NVIDIA_MODEL = 'moonshotai/kimi-k3';
export const DEFAULT_GEMINI_MODEL = 'gemini-3.7-flash';
export const DEFAULT_OPENAI_MODEL = 'gpt-4o';

const MODEL_KEY_NVIDIA = 'cyber_hud_job_matcher_model_nvidia';
const MODEL_KEY_GEMINI = 'cyber_hud_job_matcher_model_gemini';
const MODEL_KEY_OPENAI = 'cyber_hud_job_matcher_model_openai';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

/**
 * Retrieves the ephemeral API key from browser sessionStorage.
 */
export function getSessionApiKey(): string {
  if (!isBrowser()) return '';
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

/**
 * Stores the API key into browser sessionStorage.
 */
export function setSessionApiKey(key: string): void {
  if (!isBrowser()) return;
  try {
    const trimmed = (key || '').trim();
    if (!trimmed) {
      clearSessionApiKey();
    } else {
      window.sessionStorage.setItem(STORAGE_KEY, trimmed);
    }
  } catch {
    // SessionStorage quota or security restriction fallback
  }
}

/**
 * Completely purges the API key from browser sessionStorage.
 */
export function clearSessionApiKey(): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors on clear
  }
}

/**
 * Detects whether an API key appears to be NVIDIA, OpenAI, or Gemini based on standard prefixes.
 */
export function detectKeyProvider(key: string): AIProvider | null {
  const trimmed = (key || '').trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('nvapi-')) {
    return 'nvidia';
  }
  if (trimmed.startsWith('sk-') || trimmed.startsWith('org-')) {
    return 'openai';
  }
  if (trimmed.startsWith('AIza')) {
    return 'gemini';
  }
  return null;
}

/**
 * Retrieves the preferred AI provider. Defaults to 'nvidia'.
 */
export function getSessionProvider(): AIProvider {
  if (!isBrowser()) return 'nvidia';
  try {
    const p = window.sessionStorage.getItem(PROVIDER_KEY);
    if (p === 'nvidia' || p === 'openai' || p === 'gemini') {
      return p;
    }
    return 'nvidia';
  } catch {
    return 'nvidia';
  }
}

/**
 * Stores the preferred AI provider.
 */
export function setSessionProvider(provider: AIProvider): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(PROVIDER_KEY, provider);
  } catch {
    // Ignore
  }
}

/**
 * Retrieves the preferred model ID for the given or current provider.
 */
export function getSessionModel(provider?: AIProvider): string {
  if (!isBrowser()) return DEFAULT_NVIDIA_MODEL;
  try {
    const activeProvider = provider || getSessionProvider();
    if (activeProvider === 'nvidia') {
      return (
        window.sessionStorage.getItem(MODEL_KEY_NVIDIA) ||
        window.sessionStorage.getItem(MODEL_KEY) ||
        DEFAULT_NVIDIA_MODEL
      );
    }
    if (activeProvider === 'openai') {
      return (
        window.sessionStorage.getItem(MODEL_KEY_OPENAI) ||
        window.sessionStorage.getItem(MODEL_KEY) ||
        DEFAULT_OPENAI_MODEL
      );
    }
    return (
      window.sessionStorage.getItem(MODEL_KEY_GEMINI) ||
      window.sessionStorage.getItem(MODEL_KEY) ||
      DEFAULT_GEMINI_MODEL
    );
  } catch {
    if (provider === 'openai') return DEFAULT_OPENAI_MODEL;
    if (provider === 'gemini') return DEFAULT_GEMINI_MODEL;
    return DEFAULT_NVIDIA_MODEL;
  }
}

/**
 * Stores the preferred model ID for the given or current provider.
 */
export function setSessionModel(model: string, provider?: AIProvider): void {
  if (!isBrowser()) return;
  try {
    const activeProvider = provider || getSessionProvider();
    const cleanModel = (model || '').trim();
    if (activeProvider === 'nvidia') {
      window.sessionStorage.setItem(MODEL_KEY_NVIDIA, cleanModel || DEFAULT_NVIDIA_MODEL);
    } else if (activeProvider === 'openai') {
      window.sessionStorage.setItem(MODEL_KEY_OPENAI, cleanModel || DEFAULT_OPENAI_MODEL);
    } else {
      window.sessionStorage.setItem(MODEL_KEY_GEMINI, cleanModel || DEFAULT_GEMINI_MODEL);
    }
    // Also update legacy key for backwards compatibility
    window.sessionStorage.setItem(MODEL_KEY, cleanModel || DEFAULT_NVIDIA_MODEL);
  } catch {
    // Ignore
  }
}

/**
 * Checks if a valid key is currently armed in session storage.
 */
export function hasArmedKey(): boolean {
  const key = getSessionApiKey();
  return key.length >= 10;
}

/**
 * Formats an API key for safe UI display (e.g. AIzaS...48x9).
 */
export function maskApiKey(key: string): string {
  if (!key) return '';
  const trimmed = key.trim();
  if (trimmed.length <= 8) return '••••••••';
  const prefix = trimmed.slice(0, 5);
  const suffix = trimmed.slice(-4);
  return `${prefix}••••••••${suffix}`;
}
