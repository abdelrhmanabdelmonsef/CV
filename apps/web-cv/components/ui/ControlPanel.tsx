'use client';

import { useMatrix } from '../../contexts/MatrixContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function ControlPanel() {
  const { matrixActive, toggleMatrix } = useMatrix();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      <button
        type="button"
        onClick={toggleMatrix}
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-mono font-semibold
          border backdrop-blur-md cursor-pointer transition-all duration-200
          ${matrixActive
            ? 'bg-accent-green/15 text-accent-green border-accent-green/30 shadow-[0_0_15px_rgba(0,255,136,0.15)]'
            : 'bg-bg-card/80 text-text-secondary border-border-subtle hover:text-text-primary hover:border-border-green/30'
          }`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
        </svg>
        Matrix
      </button>

      <button
        type="button"
        onClick={() => window.open('/resume?print=1', '_blank', 'noopener,noreferrer')}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-mono font-semibold
          bg-bg-card/80 text-text-secondary border border-border-subtle backdrop-blur-md
          hover:text-text-primary hover:border-border-cyan/30 cursor-pointer transition-all duration-200"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        PDF
      </button>

      <button
        type="button"
        onClick={() => window.open('/resume', '_blank', 'noopener,noreferrer')}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-mono font-semibold
          bg-bg-card/80 text-text-secondary border border-border-subtle backdrop-blur-md
          hover:text-text-primary hover:border-border-cyan/30 cursor-pointer transition-all duration-200"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        ATS
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-mono font-semibold
          bg-bg-card/80 text-text-secondary border border-border-subtle backdrop-blur-md
          hover:text-accent-cyan hover:border-accent-cyan/30 cursor-pointer transition-all duration-200 md:hidden"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
