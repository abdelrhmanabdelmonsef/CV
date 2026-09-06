'use client';

import { useEffect, useState } from 'react';
import type { JobMatcherError } from '../../lib/types/job-matcher';

interface JobEmptyStateProps {
  isLoading: boolean;
  error?: JobMatcherError | null;
  isKeyArmed: boolean;
  provider?: 'gemini' | 'openai';
  onOpenKeyDrawer: () => void;
  onRetry: () => void;
  hasJobs: boolean;
}

export default function JobEmptyState({
  isLoading,
  error,
  isKeyArmed,
  provider = 'gemini',
  onOpenKeyDrawer,
  onRetry,
  hasJobs
}: JobEmptyStateProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const scanSteps = provider === 'openai' ? [
    'Establishing secure ephemeral session...',
    'Ingesting candidate profile from cv-data...',
    'Initializing OpenAI engine with live web search...',
    'Scanning active postings on LinkedIn, Wuzzuf & remote portals...',
    'Parsing job requirements & semantic qualifications...',
    'Calculating multi-dimensional match scores & skill gaps...'
  ] : [
    'Establishing secure ephemeral session...',
    'Ingesting candidate profile from cv-data...',
    'Initializing Gemini Flash with Google Search grounding...',
    'Scanning active postings on LinkedIn, Wuzzuf & remote portals...',
    'Parsing job requirements & semantic qualifications...',
    'Calculating multi-dimensional match scores & skill gaps...'
  ];

  useEffect(() => {
    if (!isLoading) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < 5 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Loading State with Cyber Radar & Terminal Scan Steps
  if (isLoading) {
    return (
      <div className="bg-[#0a0f19] border border-[#00e5ff]/30 rounded-xl p-8 md:p-12 text-center my-6 relative overflow-hidden font-mono shadow-[0_0_30px_rgba(0,229,255,0.1)]">
        {/* Animated Radar Scanning Element */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#00e5ff]/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-[#00ff88]/40 animate-pulse" />
          <div className="w-12 h-12 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
            <svg className="w-6 h-6 text-[#00e5ff] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        </div>

        <h4 className="text-base md:text-lg font-bold text-[#00e5ff] uppercase tracking-wider mb-2">
          SCANNING LIVE WEB VACANCIES
        </h4>

        <p className="text-xs text-[#94a3b8] max-w-md mx-auto mb-6">
          Querying live {provider === 'openai' ? 'OpenAI web search' : 'Google search indices'} across LinkedIn, Wuzzuf, and remote engineering platforms.
        </p>

        {/* Dynamic Scan Steps Terminal Log */}
        <div className="max-w-md mx-auto bg-[#06090e] border border-[#162438] rounded-lg p-3 text-left text-xs text-[#00ff88]">
          <div className="flex items-center gap-2 text-[10px] text-[#64748b] border-b border-[#162438] pb-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
            <span>GROUNDING PIPELINE TELEMETRY ({provider.toUpperCase()})</span>
          </div>
          <div className="space-y-1">
            {scanSteps.slice(0, stepIndex + 1).map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#00e5ff]">›</span>
                <span className={idx === stepIndex ? 'text-[#f1f5f9] animate-pulse' : 'text-[#64748b]'}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State Banner
  if (error) {
    return (
      <div className="bg-[#0a0f19] border border-[#ff3b30]/40 rounded-xl p-6 md:p-8 text-center my-6 font-mono shadow-[0_0_20px_rgba(255,59,48,0.15)]">
        <div className="w-12 h-12 rounded-full bg-[#ff3b30]/10 border border-[#ff3b30] flex items-center justify-center mx-auto mb-4 text-[#ff3b30]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h4 className="text-sm md:text-base font-bold text-[#ff3b30] uppercase tracking-wider mb-2">
          {error.type === 'AUTH_ERROR' ? 'AUTHENTICATION FAILED' : 'SEARCH DISCOVERY ERROR'}
        </h4>

        <p className="text-xs text-[#cbd5e1] max-w-md mx-auto mb-2">
          {error.message}
        </p>

        {error.rawDetails && (
          <p className="text-[11px] text-[#64748b] font-mono max-w-md mx-auto mb-6 truncate">
            {error.rawDetails}
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          {error.type === 'AUTH_ERROR' ? (
            <button
              type="button"
              onClick={onOpenKeyDrawer}
              className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#ff3b30]/20 hover:bg-[#ff3b30]/30 text-[#ff3b30] border border-[#ff3b30]/50 transition-all cursor-pointer"
            >
              CONFIGURE API KEY
            </button>
          ) : (
            <button
              type="button"
              onClick={onRetry}
              className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#162438] hover:bg-[#24354d] text-[#f1f5f9] border border-[#24354d] transition-all cursor-pointer"
            >
              RETRY SEARCH
            </button>
          )}
        </div>
      </div>
    );
  }

  // Unconfigured State (No API Key armed yet)
  if (!isKeyArmed && !hasJobs) {
    return (
      <div className="bg-[#0a0f19] border border-[#162438] rounded-xl p-8 md:p-12 text-center my-6 font-mono">
        <div className="w-14 h-14 rounded-full bg-[#162438] border border-[#24354d] flex items-center justify-center mx-auto mb-4 text-[#00e5ff]">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>

        <h4 className="text-base md:text-lg font-bold text-[#f1f5f9] uppercase tracking-wider mb-2">
          ARM YOUR GEMINI API KEY TO BEGIN
        </h4>

        <p className="text-xs text-[#94a3b8] max-w-lg mx-auto mb-6 leading-relaxed">
          The AI Job Matcher queries live web search tools to find real, active vacancies and calculate fit scores against this CV.
          Your API key is kept strictly in ephemeral browser session memory and is never persisted to any server.
        </p>

        <button
          type="button"
          onClick={onOpenKeyDrawer}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#00e5ff]/20 hover:bg-[#00e5ff]/30 text-[#00e5ff] border border-[#00e5ff]/50 hover:border-[#00e5ff] transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>ENTER API KEY</span>
        </button>
      </div>
    );
  }

  // Key armed, but no search executed yet
  if (!hasJobs) {
    return (
      <div className="bg-[#0a0f19] border border-[#162438] rounded-xl p-8 text-center my-6 font-mono">
        <p className="text-sm text-[#cbd5e1] mb-2 font-medium">
          Ready to scan active engineering and cybersecurity postings.
        </p>
        <p className="text-xs text-[#64748b]">
          Select your target filters above and click <span className="text-[#00ff88]">"DISCOVER MATCHING JOBS"</span> to initiate live grounding.
        </p>
      </div>
    );
  }

  return null;
}
