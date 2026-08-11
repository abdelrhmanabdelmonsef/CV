import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthConfigured, isAuthorized } from '../../../../lib/messages-auth';

const messagesFilePath = join(process.cwd(), '..', 'api-cv', 'data', 'messages.json');

type ContactMessage = {
  name: string;
  email: string;
  message: string;
  receivedAt: string;
};

async function readMessages(): Promise<ContactMessage[]> {
  try {
    const fileContents = await readFile(messagesFilePath, 'utf8');
    const parsed = JSON.parse(fileContents || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    await mkdir(dirname(messagesFilePath), { recursive: true });
    await writeFile(messagesFilePath, '[]', 'utf8');
    return [];
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { status: 'error', message: 'Admin access is not configured. Set MESSAGE_SECRET in .env.local' },
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
