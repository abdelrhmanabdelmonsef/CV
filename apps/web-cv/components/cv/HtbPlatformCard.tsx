'use client';

import { useEffect, useState } from 'react';
import type { CvPlatform } from 'cv-data';
import { ExternalIcon } from '../layout/Section';
import CertLinkButton from '../ui/CertLinkButton';
import type { HtbProfileData } from '../../lib/htb-profile';

type HtbPlatformCardProps = {
  fallback: CvPlatform;
};

function HtbBadgeGrid({ badges }: { badges: { name: string; imageUrl: string }[] }) {
  if (badges.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 py-4 text-xs font-mono text-text-muted">
        <span>PROFILE LINKED ✔</span>
        <span className="text-[10px]">HTB PROFILE VERIFIED (STATUS: ACTIVE)</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-3">
      {badges.map((badge) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${badge.name}-${badge.imageUrl}`}
          src={badge.imageUrl}
          alt={`${badge.name} badge`}
          title={badge.name}
          className="w-10 h-10 object-contain rounded-md
            hover:scale-110 hover:shadow-[0_0_10px_rgba(0,255,136,0.2)] transition-all duration-200"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ))}
    </div>
  );
}

function HtbCardLoading() {
  return (
    <>
      <div className="flex flex-col items-center gap-1 py-4">
        <div className="w-5 h-5 border-2 border-accent-green/30 border-t-accent-green rounded-full animate-spin-slow" />
        <span className="text-xs font-mono text-text-muted mt-1">SYNCING HTB PROFILE…</span>
      </div>
      <div className="flex items-center justify-center gap-8 mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-text-muted font-mono">—</div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider">Academy</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-text-muted font-mono">—</div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider">Labs</div>
        </div>
      </div>
    </>
  );
}

export default function HtbPlatformCard({ fallback }: HtbPlatformCardProps) {
  const [liveData, setLiveData] = useState<HtbProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch('/api/htb-profile');
        if (!response.ok) throw new Error('HTB profile fetch failed');
        const data = (await response.json()) as HtbProfileData;
        if (!cancelled) {
          setLiveData(data);
          setUseFallback(false);
        }
      } catch {
        if (!cancelled) setUseFallback(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handle = liveData?.handle ?? fallback.handle;
  const profileUrl = liveData?.profileUrl ?? fallback.url;
  const badges = useFallback || !liveData ? (fallback.badges ?? []) : liveData.badges;
  const stats =
    useFallback || !liveData
      ? (fallback.stats ?? [])
      : [
          { label: 'Academy', value: String(liveData.stats.academy) },
          { label: 'Labs', value: String(liveData.stats.labs) }
        ];

  return (
    <div
      id={fallback.id}
      className="rounded-xl border border-border-subtle bg-bg-card/60 backdrop-blur-sm p-5
        flex flex-col items-center text-center
        hover:border-accent-green/30 hover:shadow-[0_0_20px_rgba(0,255,136,0.08)] transition-all duration-300"
    >
      <div className="text-3xl mb-2">{fallback.emoji}</div>
      <h3 className="text-sm font-bold text-text-primary mb-1">{fallback.name}</h3>
      <a
        href={profileUrl}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-accent-green hover:text-accent-cyan transition-colors font-mono mb-2"
      >
        {handle}
      </a>

      {loading ? <HtbCardLoading /> : <HtbBadgeGrid badges={badges} />}

      {!loading && stats.length > 0 && (
        <div className="flex items-center justify-center gap-8 mb-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg font-bold text-accent-green font-mono">{stat.value}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center w-full">
        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold
            bg-accent-green/10 text-accent-green border border-accent-green/20
            hover:bg-accent-green/20 hover:shadow-[0_0_10px_rgba(0,255,136,0.15)] transition-all duration-200"
        >
          <ExternalIcon />
          Live {fallback.name} Profile
        </a>
        {fallback.transcriptUrl && fallback.transcriptTitle && (
          <CertLinkButton
            url={fallback.transcriptUrl}
            title={fallback.transcriptTitle}
            label="Academy Transcript"
          />
        )}
      </div>
    </div>
  );
}
