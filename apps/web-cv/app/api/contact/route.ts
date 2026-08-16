import { NextRequest, NextResponse } from 'next/server';
import { appendMessage } from '../../../lib/messages-store';
import { checkRateLimit, getClientIp } from '../../../lib/rate-limit';

function validateBody(body: unknown): { name: string; email: string; message: string } | string {
  if (!body || typeof body !== 'object') return 'Invalid request body';

  const { name, email, message } = body as Record<string, unknown>;

  if (typeof name !== 'string' || !name.trim()) return 'Name is required';
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Valid email is required';
  if (typeof message !== 'string' || message.trim().length < 10) return 'Message must be at least 10 characters';

  return { name: name.trim(), email: email.trim(), message: message.trim() };
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, retryAfterMs } = checkRateLimit(`contact:${ip}`);

  if (!allowed) {
    return NextResponse.json(
      { status: 'error', message: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) }
      }
    );
  }

  try {
    const body = await request.json();
    const validated = validateBody(body);

    if (typeof validated === 'string') {
      return NextResponse.json({ status: 'error', message: validated }, { status: 400 });
    }

    const saved = await appendMessage(validated);

    return NextResponse.json({
      status: 'success',
      received: saved
    });
  } catch {
    return NextResponse.json({ status: 'error', message: 'Unable to save message' }, { status: 500 });
  }
}
