import { NextRequest, NextResponse } from 'next/server';
import { isAuthConfigured, isAuthorized } from '../../../../lib/messages-auth';
import { readMessages } from '../../../../lib/messages-store';

export async function GET(request: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { status: 'error', message: 'Admin access is not configured. Set MESSAGE_SECRET in Vercel environment variables.' },
      { status: 503 }
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await readMessages();
    return NextResponse.json({ status: 'success', messages });
  } catch {
    return NextResponse.json({ status: 'error', message: 'Unable to read messages' }, { status: 500 });
  }
}
