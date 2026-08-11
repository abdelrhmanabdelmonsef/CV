import { Body, Controller, Get, Post, Query, UnauthorizedException } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

class ContactDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 1000)
  message!: string;
}

function getAdminSecret(): string | null {
  const secret = process.env.MESSAGE_SECRET?.trim();
  return secret || null;
}

function ensureAdmin(secret?: string) {
  const adminSecret = getAdminSecret();
  if (!adminSecret) {
    throw new UnauthorizedException('Admin access is not configured');
  }
  if (!secret || secret !== adminSecret) {
    throw new UnauthorizedException('Invalid access token');
  }
}

// dist/contact -> apps/api-cv/data/messages.json
const messagesFilePath = join(__dirname, '..', '..', 'data', 'messages.json');

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
  messages.push({
    ...message,
    receivedAt: new Date().toISOString()
  });

  await writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8');
}

@Controller('contact')
export class ContactController {
  @Post()
  async submitContact(@Body() body: ContactDto) {
    await appendMessage(body);

    return {
      status: 'success',
      received: {
        name: body.name,
        email: body.email,
        message: body.message
      }
    };
  }

  @Get('messages')
  async getMessages(@Query('secret') secret?: string) {
    ensureAdmin(secret);
    return {
      status: 'success',
      messages: await readMessages()
    };
  }
}
