import { Redis } from '@upstash/redis';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { tmpdir } from 'os';

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  receivedAt: string;
};

const MESSAGES_KEY = 'cv:messages';

function isVercel(): boolean {
  return !!process.env.VERCEL;
}

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!
    });
  }
  return redis;
}

// --- Upstash Redis (Vercel production) ---

async function readFromRedis(): Promise<ContactMessage[]> {
  const messages = await getRedis().get<ContactMessage[]>(MESSAGES_KEY);
  return messages ?? [];
}

async function appendToRedis(newMessage: ContactMessage): Promise<void> {
  const messages = await readFromRedis();
  messages.push(newMessage);
  await getRedis().set(MESSAGES_KEY, messages);
}

// --- File-based (local development) ---

function getStoragePath(): string {
  return join(process.cwd(), '..', 'api-cv', 'data', 'messages.json');
}

async function readFromFile(): Promise<ContactMessage[]> {
  const filePath = getStoragePath();
  try {
    const fileContents = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(fileContents || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    try {
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, '[]', 'utf8');
    } catch {
      const fallbackPath = join(tmpdir(), 'cv-messages.json');
      try {
        const fileContents = await readFile(fallbackPath, 'utf8');
        const parsed = JSON.parse(fileContents || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
}

async function appendToFile(newMessage: ContactMessage): Promise<void> {
  let filePath = getStoragePath();
  try {
    const messages = await readFromFile();
    messages.push(newMessage);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(messages, null, 2), 'utf8');
  } catch {
    filePath = join(tmpdir(), 'cv-messages.json');
    const messages = await readFromFile();
    messages.push(newMessage);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(messages, null, 2), 'utf8');
  }
}

// --- Public API ---

export async function readMessages(): Promise<ContactMessage[]> {
  if (isVercel()) return readFromRedis();
  return readFromFile();
}

export async function appendMessage(
  message: { name: string; email: string; message: string }
): Promise<ContactMessage> {
  const newMessage: ContactMessage = { ...message, receivedAt: new Date().toISOString() };

  if (isVercel()) {
    await appendToRedis(newMessage);
  } else {
    await appendToFile(newMessage);
  }

  return newMessage;
}
