import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE, getSessionToken, isAuthConfigured, isAuthorized, verifyPassword } from '../../../../lib/messages-auth';

export async function POST(request: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { status: 'error', message: 'Admin access is not configured. Set MESSAGE_SECRET in Vercel environment variables.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!verifyPassword(password)) {
      return NextResponse.json({ status: 'error', message: 'Incorrect password' }, { status: 401 });
    }

    const response = NextResponse.json({ status: 'success' });
    response.cookies.set(AUTH_COOKIE, getSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8
    });

    return response;
  } catch {
    return NextResponse.json({ status: 'error', message: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: 'success' });
  response.cookies.set(AUTH_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });
  return response;
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAuthorized(request),
    configured: isAuthConfigured()
  });
}
