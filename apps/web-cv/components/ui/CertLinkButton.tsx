'use client';

import { useLightbox } from '../../contexts/LightboxContext';

export default function CertLinkButton({ url, title, label }: { url: string; title: string; label: string }) {
  const { openLightbox } = useLightbox();

  return (
    <button
      type="button"
      onClick={() => openLightbox(url, title)}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider
        bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20
        hover:bg-accent-cyan/20 hover:shadow-[0_0_10px_rgba(0,229,255,0.15)]
        transition-all duration-200 cursor-pointer shrink-0"
    >
      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      {label}
    </button>
  );
}
