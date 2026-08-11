'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import Lightbox from '../components/ui/Lightbox';

type LightboxContextValue = {
  openLightbox: (url: string, title: string) => void;
  closeLightbox: () => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const openLightbox = useCallback((nextUrl: string, nextTitle: string) => {
    setUrl(nextUrl);
    setTitle(nextTitle);
    setActive(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setActive(false);
    document.body.style.overflow = '';
  }, []);

  return (
    <LightboxContext.Provider value={{ openLightbox, closeLightbox }}>
      {children}
      <Lightbox active={active} url={url} title={title} onClose={closeLightbox} />
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox must be used within LightboxProvider');
  return ctx;
}
