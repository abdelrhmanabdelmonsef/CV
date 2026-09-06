import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '../../../../lib/messages-auth';

export async function GET(request: NextRequest) {
  const authorized = isAuthorized(request);

  if (!authorized) {
    return NextResponse.json({
      authenticated: false,
      hasOpenAI: false,
      hasGemini: false,
      defaultProvider: 'gemini'
    });
  }

  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());
  const hasGemini = Boolean(process.env.GEMINI_API_KEY?.trim());

  return NextResponse.json({
    authenticated: true,
    hasOpenAI,
    hasGemini,
    defaultProvider: hasOpenAI ? 'openai' : 'gemini'
  });
}
