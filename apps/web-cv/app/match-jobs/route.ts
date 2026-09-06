import { NextResponse } from 'next/server';

/**
 * Route alias redirecting /match-jobs to the primary /jobs page.
 */
export async function GET(request: Request) {
  const targetUrl = new URL('/jobs', request.url);
  return NextResponse.redirect(targetUrl, 307);
}
