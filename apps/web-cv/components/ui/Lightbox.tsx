'use client';

import { useEffect, useState } from 'react';

type LightboxProps = {
  active: boolean;
  url: string;
  title: string;
  onClose: () => void;
};

export default function Lightbox({ active, url, title, onClose }: LightboxProps) {
  const [loading, setLoading] = useState(true);
  const isImage = /\.(png|jpg|jpeg|webp)$/i.test(url);

  useEffect(() => {
    if (active) setLoading(true);
  }, [active, url]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && active) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [active, onClose]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 opacity-100 pointer-events-auto"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border border-border-green/30 bg-bg-secondary/95
        backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,255,136,0.1)]
        animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-primary/60">
          <span className="font-mono text-xs text-accent-green/80 truncate mr-4">
            SECURE VIEW: {title.toUpperCase()}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono
              text-text-muted hover:text-accent-red hover:bg-accent-red/10
              transition-colors duration-200 cursor-pointer shrink-0"
          >
            <span>[x]</span> CLOSE
          </button>
        </div>

        {/* Body */}
        <div className="relative overflow-auto" style={{ maxHeight: 'calc(90vh - 52px)' }}>
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <div className="w-6 h-6 border-2 border-accent-green/30 border-t-accent-green rounded-full animate-spin-slow" />
              <span className="font-mono text-xs text-text-muted">LOADING SECURE DECRYPTED CACHE...</span>
            </div>
          )}
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={`w-full h-auto ${loading ? 'hidden' : 'block'}`}
              src={url}
              alt={title}
              onLoad={() => setLoading(false)}
            />
          ) : (
            <iframe
              className={`w-full ${loading ? 'hidden' : 'block'}`}
              style={{ height: 'calc(90vh - 52px)' }}
              src={active ? url : undefined}
              title={title}
              onLoad={() => setLoading(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
