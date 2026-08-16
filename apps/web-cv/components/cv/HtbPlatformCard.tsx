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
      <div className="htb-badge-placeholder">
        <span>PROFILE LINKED ✔</span>
        <span>HTB PROFILE VERIFIED (STATUS: ACTIVE)</span>
      </div>
    );
  }

  return (
    <div className="htb-badge-grid">
      {badges.map((badge) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${badge.name}-${badge.imageUrl}`}
          src={badge.imageUrl}
          alt={`${badge.name} badge`}
          title={badge.name}
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
      <div className="htb-badge-placeholder htb-card-loading">
        <span>SYNCING HTB PROFILE…</span>
        <span>FETCHING BADGES &amp; STATS</span>
      </div>
      <div className="telemetry-row htb-card-loading" style={{ marginBottom: 12 }}>
        <div className="telemetry-item">
          <div className="telemetry-val">—</div>
          <div className="telemetry-label">Academy</div>
        </div>
        <div className="telemetry-item">
          <div className="telemetry-val">—</div>
          <div className="telemetry-label">Labs</div>
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
    <div className="glass-panel platform-card" id={fallback.id}>
      <div className="platform-logo-large">{fallback.emoji}</div>
      <h3 className="timeline-title" style={{ fontSize: 15 }}>
        {fallback.name}
      </h3>
      <a href={profileUrl} target="_blank" rel="noreferrer" className="platform-username-link">
        {handle}
      </a>
      {loading ? <HtbCardLoading /> : <HtbBadgeGrid badges={badges} />}
      {!loading && stats.length > 0 && (
        <div className="telemetry-row" style={{ marginBottom: 12 }}>
          {stats.map((stat) => (
            <div key={stat.label} className="telemetry-item">
              <div className="telemetry-val">{stat.value}</div>
              <div className="telemetry-label">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
        <a href={profileUrl} target="_blank" rel="noreferrer" className="cert-badge-link">
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
