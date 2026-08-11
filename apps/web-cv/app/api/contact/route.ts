import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

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

async function appendMessage(message: { name: string; email: string; message: string }) {
  await mkdir(dirname(messagesFilePath), { recursive: true });
  const messages = await readMessages();
  messages.push({ ...message, receivedAt: new Date().toISOString() });
  await writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8');
}

function validateBody(body: unknown): { name: string; email: string; message: string } | string {
  if (!body || typeof body !== 'object') return 'Invalid request body';

  const { name, email, message } = body as Record<string, unknown>;

  if (typeof name !== 'string' || !name.trim()) return 'Name is required';
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Valid email is required';
  if (typeof message !== 'string' || message.trim().length < 10) return 'Message must be at least 10 characters';

  return { name: name.trim(), email: email.trim(), message: message.trim() };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validateBody(body);

    if (typeof validated === 'string') {
      return NextResponse.json({ status: 'error', message: validated }, { status: 400 });
    }

    await appendMessage(validated);

    return NextResponse.json({
      status: 'success',
      received: validated
    });
  } catch {
    return NextResponse.json({ status: 'error', message: 'Unable to save message' }, { status: 500 });
  }
}
