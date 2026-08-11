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

  return (
    <div
      className={`lightbox-modal${active ? ' active' : ''}`}
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="lightbox-content">
        <div className="lightbox-header">
          <span className="lightbox-title">SECURE VIEW: {title.toUpperCase()}</span>
          <button type="button" className="lightbox-close" onClick={onClose}>
            <span style={{ fontSize: 14 }}>[x]</span> CLOSE_PANEL
          </button>
        </div>
        <div className="lightbox-body">
          {loading && (
            <div className="lightbox-loader" style={{ opacity: 1 }}>
              <div className="spinner" />
              <div>LOADING SECURE DECRYPTED CACHE...</div>
            </div>
          )}
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="lightbox-img-viewer"
              src={url}
              alt={title}
              style={{ display: loading ? 'none' : 'block' }}
              onLoad={() => setLoading(false)}
            />
          ) : (
            <iframe
              className="lightbox-viewer"
              src={active ? url : ''}
              title={title}
              style={{ display: loading ? 'none' : 'block' }}
              onLoad={() => setLoading(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
