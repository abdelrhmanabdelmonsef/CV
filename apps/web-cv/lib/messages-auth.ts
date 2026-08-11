import { createHash } from 'crypto';
import { NextRequest } from 'next/server';

export const AUTH_COOKIE = 'cv_messages_auth';

export function getAdminSecret(): string | null {
  const secret = process.env.MESSAGE_SECRET?.trim();
  return secret || null;
}

export function requireAdminSecret(): string {
  const secret = getAdminSecret();
  if (!secret) {
    throw new Error('MESSAGE_SECRET is not configured');
  }
  return secret;
}

export function getSessionToken() {
  return createHash('sha256').update(requireAdminSecret()).digest('hex');
}

export function isAuthorized(request: NextRequest) {
  const secret = getAdminSecret();
  if (!secret) return false;

  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  const expected = createHash('sha256').update(secret).digest('hex');
  return cookie === expected;
}

export function verifyPassword(password: string) {
  const secret = getAdminSecret();
  if (!secret) return false;
  return password === secret;
}

export function isAuthConfigured() {
  return getAdminSecret() !== null;
}
