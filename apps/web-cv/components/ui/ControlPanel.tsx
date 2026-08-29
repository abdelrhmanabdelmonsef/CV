'use client';

import { useMatrix } from '../../contexts/MatrixContext';

export default function ControlPanel() {
  const { matrixActive, toggleMatrix } = useMatrix();

  return (
    <div className="control-panel">
      <button
        type="button"
        className={`hud-btn${matrixActive ? ' active' : ''}`}
        onClick={toggleMatrix}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
        </svg>
        Matrix Rain
      </button>
      <button
        type="button"
        className="hud-btn"
        onClick={() => window.open('/resume?print=1', '_blank', 'noopener,noreferrer')}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        Save / Print PDF
      </button>
      <button
        type="button"
        className="hud-btn"
        onClick={() => window.open('/resume', '_blank', 'noopener,noreferrer')}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        ATS Resume
      </button>
    </div>
  );
}
