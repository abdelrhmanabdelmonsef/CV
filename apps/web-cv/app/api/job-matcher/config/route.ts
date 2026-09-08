import { NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '../../../../lib/messages-auth';

export async function GET(request: NextRequest) {
  const authorized = isAuthorized(request);

  if (!authorized) {
    return NextResponse.json({
      authenticated: false,
      hasNvidia: false,
      hasOpenAI: false,
      hasGemini: false,
      defaultProvider: 'nvidia'
    });
  }

  const hasNvidia = Boolean(process.env.NVIDIA_API_KEY?.trim());
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());
  const hasGemini = Boolean(process.env.GEMINI_API_KEY?.trim());

  let defaultProvider: 'nvidia' | 'openai' | 'gemini' = 'nvidia';
  if (!hasNvidia) {
    if (hasOpenAI) defaultProvider = 'openai';
    else if (hasGemini) defaultProvider = 'gemini';
  }

  return NextResponse.json({
    authenticated: true,
    hasNvidia,
    hasOpenAI,
    hasGemini,
    defaultProvider
  });
}
