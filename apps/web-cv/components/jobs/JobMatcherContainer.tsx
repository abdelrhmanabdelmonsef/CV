'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AdminAuthCard from '../auth/AdminAuthCard';
import { getCandidateProfileContext } from '../../lib/candidate-profile';
import { executeJobMatch } from '../../lib/job-matcher-service';
import {
  getSessionApiKey,
  getSessionModel,
  getSessionProvider,
  setSessionProvider
} from '../../lib/session-storage-key';
import type {
  JobMatcherError,
  JobOpportunity,
  SearchFilterState
} from '../../lib/types/job-matcher';
import JobCard from './JobCard';
import JobEmptyState from './JobEmptyState';
import JobFilterToolbar from './JobFilterToolbar';
import KeyConfigDrawer from './KeyConfigDrawer';

export default function JobMatcherContainer() {
  const candidateContext = useMemo(() => getCandidateProfileContext(), []);

  // Admin Authentication State
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [authConfigured, setAuthConfigured] = useState(true);
  const [serverConfig, setServerConfig] = useState<{
    hasOpenAI: boolean;
    hasGemini: boolean;
    defaultProvider?: 'openai' | 'gemini';
  } | null>(null);

  const [filters, setFilters] = useState<SearchFilterState>({
    locationFilter: 'all',
    roleFocus: 'all',
    minScore: 50
  });

  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<JobMatcherError | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');

  // Check admin session and server configuration on mount
  const checkSession = useCallback(async () => {
    try {
      const authRes = await fetch('/api/contact/auth', { credentials: 'include' });
      if (!authRes.ok) {
        setAuthenticated(false);
        setAuthConfigured(true);
        return;
      }
      const authData = await authRes.json();
      const isAuthed = Boolean(authData.authenticated);
      setAuthenticated(isAuthed);
      setAuthConfigured(authData.configured !== false);

      if (isAuthed) {
        const configRes = await fetch('/api/job-matcher/config', { credentials: 'include' });
        if (configRes.ok) {
          const configData = await configRes.json();
          setServerConfig(configData);
          if (configData.defaultProvider) {
            setProvider(configData.defaultProvider);
            setSessionProvider(configData.defaultProvider);
          }
        }
      }
    } catch {
      setAuthenticated(false);
      setAuthConfigured(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
    const storedProvider = getSessionProvider();
    if (storedProvider) {
      setProvider(storedProvider);
    }
  }, [checkSession]);

  const handleLogout = async () => {
    await fetch('/api/contact/auth', { method: 'DELETE', credentials: 'include' });
    setAuthenticated(false);
    setJobs([]);
    setError(null);
  };

  const handleProviderChange = (p: 'gemini' | 'openai') => {
    setProvider(p);
    setSessionProvider(p);
  };

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const optionalKey = getSessionApiKey() || undefined;
      const model = getSessionModel(provider);

      const result = await executeJobMatch(
        provider,
        optionalKey,
        candidateContext,
        filters,
        model
      );
      setJobs(result.jobs);
      setSearchQueries(result.searchQueriesUsed);
    } catch (err: any) {
      if (err?.type) {
        setError(err as JobMatcherError);
      } else {
        setError({
          type: 'NETWORK_ERROR',
          message: 'An unexpected error occurred while communicating with the job search engine.',
          rawDetails: String(err?.message || err)
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [candidateContext, filters, provider]);

  // Filter jobs dynamically by minimum match score
  const visibleJobs = useMemo(() => {
    return jobs
      .filter((j) => j.matchScore >= filters.minScore)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [jobs, filters.minScore]);

  // Loading Session Check
  if (authenticated === null) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-24 text-center font-mono">
        <div className="w-8 h-8 rounded-full border-2 border-[#00e5ff] border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#94a3b8]">Verifying admin session authorization...</p>
      </div>
    );
  }

  // Locked Gate: Requires Admin Authentication
  if (!authenticated) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16">
        <AdminAuthCard
          title="AI Job Matcher Access"
          subtitle={
            authConfigured
              ? 'Enter your admin password to access live AI web search job matching powered by your server credentials.'
              : 'Admin access is not configured. Set the MESSAGE_SECRET environment variable in .env.local on your server.'
          }
          authConfigured={authConfigured}
          onAuthenticated={async () => {
            setAuthenticated(true);
            await checkSession();
          }}
          backHref="/"
        />
      </div>
    );
  }

  // Authenticated: Full Cyber HUD Job Matcher UI
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Top Banner: Cyber HUD Candidate Ingestion Header */}
      <div className="mb-8 p-5 rounded-2xl bg-[#0a0f19] border border-[#162438] relative overflow-hidden font-mono shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00e5ff]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00ff88] via-[#00e5ff] to-[#00ff88]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
              <span className="text-[11px] uppercase tracking-widest text-[#00ff88] font-bold">
                CV PROFILE INGESTED • ADMIN SESSION ACTIVE
              </span>
            </div>
            <h1 className="text-xl md:text-3xl font-black text-[#f1f5f9] tracking-tight">
              AI JOB MATCHER
            </h1>
            <p className="text-xs md:text-sm text-[#94a3b8] mt-1">
              {provider === 'openai'
                ? 'Live web search & deep matching via OpenAI GPT-4o comparing active vacancies against verified competencies.'
                : 'Live web search grounding via Gemini Flash comparing active vacancies against verified competencies.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded bg-[#162438] text-[#cbd5e1] border border-[#24354d]">
              Candidate: {candidateContext.name}
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded bg-[#162438] text-[#00e5ff] border border-[#24354d]">
              {candidateContext.topSkills.length} Verified Skills
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded bg-[#162438] text-[#00ff88] border border-[#24354d]">
              {candidateContext.experienceHighlights.length} Milestones
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-[11px] px-2.5 py-1 rounded bg-[#ff3b30]/10 hover:bg-[#ff3b30]/20 text-[#ff3b30] border border-[#ff3b30]/30 transition-all cursor-pointer font-bold ml-1"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <JobFilterToolbar
        filters={filters}
        onFilterChange={setFilters}
        onSearchTrigger={handleSearch}
        isLoading={isLoading}
        provider={provider}
        onProviderChange={handleProviderChange}
        serverConfig={serverConfig || undefined}
        onOpenKeyDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Grounding Telemetry / Search Queries Used */}
      {searchQueries && searchQueries.length > 0 && !isLoading && (
        <div className="mb-6 p-3 rounded-lg bg-[#06090e] border border-[#162438] text-xs font-mono flex items-center gap-2 flex-wrap">
          <span className="text-[#64748b] text-[11px] uppercase">GROUNDED SEARCH QUERIES:</span>
          {searchQueries.map((q, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded bg-[#162438] text-[#00e5ff] border border-[#24354d] text-[11px]"
            >
              "{q}"
            </span>
          ))}
        </div>
      )}

      {/* Results Header */}
      {jobs.length > 0 && !isLoading && (
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#162438] font-mono">
          <div className="flex items-center gap-2">
            <h2 className="text-sm md:text-base font-bold text-[#f1f5f9] tracking-wider uppercase">
              DISCOVERED OPPORTUNITIES
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30">
              {visibleJobs.length} of {jobs.length} Shown
            </span>
          </div>

          <span className="text-xs text-[#64748b] hidden sm:inline">
            Ranked by Semantic Fit
          </span>
        </div>
      )}

      {/* Empty State / Loading Radar / Error Display */}
      <JobEmptyState
        isLoading={isLoading}
        error={error}
        isKeyArmed={true}
        provider={provider}
        onOpenKeyDrawer={() => setIsDrawerOpen(true)}
        onRetry={handleSearch}
        hasJobs={jobs.length > 0}
      />

      {/* Cards Grid */}
      {!isLoading && visibleJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {visibleJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Key Configuration Drawer (Optional model selector & client override) */}
      <KeyConfigDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onKeySaved={(armed) => {
          if (armed && !jobs.length) {
            handleSearch();
          }
        }}
      />
    </div>
  );
}
