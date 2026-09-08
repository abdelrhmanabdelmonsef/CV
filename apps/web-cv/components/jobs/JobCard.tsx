'use client';

import { EXTERNAL_LINK_PROPS, getPlatformMeta } from '../../lib/job-links';
import type { JobOpportunity } from '../../lib/types/job-matcher';

interface JobCardProps {
  job: JobOpportunity;
}

export default function JobCard({ job }: JobCardProps) {
  const platformMeta = getPlatformMeta(job.sourcePlatform);

  const getScoreColor = (score: number) => {
    if (score >= 80) {
      return {
        badge: 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/40 shadow-[0_0_12px_rgba(0,255,136,0.2)]',
        bar: 'bg-[#00ff88]',
        label: 'HIGH FIT'
      };
    }
    if (score >= 60) {
      return {
        badge: 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/40 shadow-[0_0_12px_rgba(0,229,255,0.2)]',
        bar: 'bg-[#00e5ff]',
        label: 'GOOD FIT'
      };
    }
    return {
      badge: 'bg-[#ffb300]/10 text-[#ffb300] border-[#ffb300]/40 shadow-[0_0_12px_rgba(255,179,0,0.2)]',
      bar: 'bg-[#ffb300]',
      label: 'MODERATE'
    };
  };

  const scoreTheme = getScoreColor(job.matchScore);

  return (
    <div className="relative group bg-[#0a0f19] hover:bg-[#0d1424] border border-[#162438] hover:border-[#00e5ff]/50 rounded-xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg">
      {/* Top Cyber Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header: Title, Platform & Match Score Badge */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[11px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border ${platformMeta.badgeBg} ${platformMeta.badgeText} ${platformMeta.badgeBorder}`}>
                {platformMeta.name} {platformMeta.arabicName ? `• ${platformMeta.arabicName}` : ''}
              </span>
              {job.isRemote && (
                <span className="text-[11px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30">
                  REMOTE
                </span>
              )}
            </div>

            <h3 className="text-lg md:text-xl font-bold text-[#f1f5f9] group-hover:text-[#00e5ff] transition-colors leading-tight truncate">
              {job.title}
            </h3>

            <div className="flex items-center gap-3 text-xs md:text-sm text-[#94a3b8] mt-1">
              <span className="font-medium text-[#cbd5e1]">{job.company}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border font-mono ${scoreTheme.badge} shrink-0`}>
            <span className="text-xl md:text-2xl font-black leading-none">{job.matchScore}%</span>
            <span className="text-[9px] tracking-wider mt-0.5">{scoreTheme.label}</span>
          </div>
        </div>

        {/* Match Progress Bar */}
        <div className="w-full bg-[#162438] h-1.5 rounded-full overflow-hidden my-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${scoreTheme.bar}`}
            style={{ width: `${Math.max(5, job.matchScore)}%` }}
          />
        </div>

        {/* Fit Summary */}
        <p className="text-xs md:text-sm text-[#94a3b8] line-clamp-2 mb-4 leading-relaxed">
          {job.summary}
        </p>

        {/* Strengths & Gap Skills Grid */}
        <div className="space-y-2.5 mb-5 text-xs font-mono">
          {job.strengths && job.strengths.length > 0 && (
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#00ff88] block mb-1">
                Matching Strengths:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {job.strengths.map((str, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30"
                  >
                    <span className="text-[10px]">✓</span> {str}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.missingSkills && job.missingSkills.length > 0 && (
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#ffb300] block mb-1">
                Skills to Learn / Gaps:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {job.missingSkills.map((gap, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ffb300]/10 text-[#ffb300] border border-[#ffb300]/30"
                  >
                    <span className="text-[10px]">+</span> {gap}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: Direct Application + Fallback Google Search */}
      <div className="pt-3 border-t border-[#162438] flex items-center gap-2">
        {job.url ? (
          <a
            href={job.url}
            {...EXTERNAL_LINK_PROPS}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-[#00e5ff]/15 hover:bg-[#00e5ff]/25 text-[#00e5ff] border border-[#00e5ff]/40 hover:border-[#00e5ff] transition-all shadow-[0_0_10px_rgba(0,229,255,0.15)] truncate"
          >
            <span className="truncate">Apply on {platformMeta.name}</span>
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ) : (
          <a
            href={platformMeta.buildSearchUrl(job.title, job.company)}
            {...EXTERNAL_LINK_PROPS}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-[#162438] hover:bg-[#24354d] text-[#cbd5e1] border border-[#24354d] transition-all truncate"
          >
            <span className="truncate">Search on {platformMeta.name}</span>
          </a>
        )}

        <a
          href={job.fallbackSearchUrl}
          {...EXTERNAL_LINK_PROPS}
          title="Search on Google if direct application URL is broken or dynamic"
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-mono tracking-wider uppercase bg-[#162438] hover:bg-[#24354d] text-[#cbd5e1] hover:text-[#f1f5f9] border border-[#24354d] hover:border-[#64748b] transition-all shrink-0"
        >
          <svg className="w-3.5 h-3.5 text-[#00e5ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline">Google</span>
          <span className="sm:hidden">Web</span>
        </a>
      </div>
    </div>
  );
}
