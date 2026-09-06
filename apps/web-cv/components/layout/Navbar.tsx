'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const NAV_LINKS = [
  { id: 'summary-section', label: 'Summary' },
  { id: 'experience-section', label: 'Experience' },
  { id: 'projects-section', label: 'Projects' },
  { id: 'skills-section', label: 'Skills' },
  { id: 'platforms-section', label: 'Platforms' },
  { id: 'certs-section', label: 'Certs' },
  { id: 'contact-section', label: 'Contact' },
];

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/resume' || pathname === '/jobs') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: 0.15, rootMargin: '-80px 0px -50% 0px' }
    );

    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const scrollTo = useCallback((id: string) => {
    if (pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  }, [pathname]);

  const handleLogoClick = () => {
    if (pathname !== '/') {
      window.location.href = '/';
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (pathname === '/resume') {
    return null;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/85 backdrop-blur-xl border-b border-border-subtle/60 shadow-lg shadow-black/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Logo / Brand */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 font-mono text-sm font-bold text-accent-green hover:text-accent-cyan transition-colors cursor-pointer tracking-wide"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-accent-green animate-pulse-dot" />
            <span>0xMonsef</span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                  activeSection === id && pathname === '/'
                    ? 'text-accent-green bg-accent-green/10 shadow-[0_0_10px_rgba(0,255,136,0.15)]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}

            {/* AI Jobs Page Link */}
            <Link
              href="/jobs"
              className={`ml-2 px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                pathname === '/jobs'
                  ? 'text-accent-cyan bg-accent-cyan/15 border border-accent-cyan/40 shadow-[0_0_10px_rgba(0,229,255,0.25)]'
                  : 'text-accent-cyan hover:bg-accent-cyan/10 border border-transparent hover:border-accent-cyan/30'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              <span>AI Jobs</span>
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-secondary hover:text-accent-cyan hover:bg-white/5 transition-all duration-200 cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`nav-overlay fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-14 right-0 z-45 w-64 bg-bg-secondary/95 backdrop-blur-xl border-l border-border-subtle
          transform transition-transform duration-300 ease-out md:hidden h-[calc(100vh-3.5rem)]
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col p-4 gap-1">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium font-mono text-left transition-all duration-200 cursor-pointer ${
                activeSection === id && pathname === '/'
                  ? 'text-accent-green bg-accent-green/10 shadow-[0_0_10px_rgba(0,255,136,0.15)]'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}

          <Link
            href="/jobs"
            onClick={() => setMobileOpen(false)}
            className={`mt-2 px-4 py-2.5 rounded-lg text-sm font-medium font-mono text-left transition-all duration-200 flex items-center gap-2 ${
              pathname === '/jobs'
                ? 'text-accent-cyan bg-accent-cyan/15 border border-accent-cyan/40 shadow-[0_0_10px_rgba(0,229,255,0.25)]'
                : 'text-accent-cyan hover:bg-white/5'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span>AI Job Matcher</span>
          </Link>
        </div>
      </div>
    </>
  );
}
