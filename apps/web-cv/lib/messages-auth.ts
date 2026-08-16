import { createHmac, randomBytes, createHash } from 'crypto';
import { NextRequest } from 'next/server';

export const AUTH_COOKIE = 'cv_messages_auth';

const TOKEN_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours

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

function signToken(tokenId: string, secret: string): string {
  return createHmac('sha256', secret).update(tokenId).digest('hex');
}

export function createSessionToken(): string {
  const secret = requireAdminSecret();
  const tokenId = randomBytes(32).toString('hex');
  const signature = signToken(tokenId, secret);
  const expires = Date.now() + TOKEN_EXPIRY_MS;
  const payload = `${tokenId}.${expires}`;
  const payloadSignature = createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}.${payloadSignature}`).toString('base64url');
}

export function isAuthorized(request: NextRequest): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;

  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (!cookie) return false;

  try {
    const decoded = Buffer.from(cookie, 'base64url').toString('utf8');
    const parts = decoded.split('.');
    if (parts.length !== 3) return false;

    const [tokenId, expiresStr, payloadSignature] = parts;
    const expires = parseInt(expiresStr, 10);
    if (isNaN(expires) || Date.now() > expires) return false;

    const payload = `${tokenId}.${expiresStr}`;
    const expectedSignature = createHmac('sha256', secret).update(payload).digest('hex');

    if (payloadSignature !== expectedSignature) return false;

    // Verify the tokenId format (should be 64 hex chars = 32 bytes)
    if (!/^[0-9a-f]{64}$/.test(tokenId)) return false;

    return true;
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;
  // Use timing-safe comparison
  if (password.length !== secret.length) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  // Node.js timingSafeEqual requires same length
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i]! ^ b[i]!;
  }
  return result === 0;
}

export function isAuthConfigured(): boolean {
  return getAdminSecret() !== null;
}
