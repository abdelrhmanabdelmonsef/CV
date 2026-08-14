import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { tmpdir } from 'os';

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  receivedAt: string;
};

function getStoragePath(): string {
  if (process.env.VERCEL) {
    return join(tmpdir(), 'cv-messages.json');
  }
  return join(process.cwd(), '..', 'api-cv', 'data', 'messages.json');
}

export async function readMessages(): Promise<ContactMessage[]> {
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

export async function appendMessage(message: { name: string; email: string; message: string }): Promise<ContactMessage> {
  const newMessage: ContactMessage = { ...message, receivedAt: new Date().toISOString() };
  let filePath = getStoragePath();

  try {
    const messages = await readMessages();
    messages.push(newMessage);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(messages, null, 2), 'utf8');
  } catch {
    filePath = join(tmpdir(), 'cv-messages.json');
    const messages = await readMessages();
    messages.push(newMessage);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(messages, null, 2), 'utf8');
  }

  return newMessage;
}
