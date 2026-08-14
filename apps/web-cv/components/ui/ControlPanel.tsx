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
      <button type="button" className="hud-btn" onClick={() => window.print()}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        Print Resume
      </button>
      <a
        href="/Abdel_Rahman_Abdelmonsef_resume.pdf"
        className="hud-btn"
        download="Abdel_Rahman_Abdelmonsef_Resume.pdf"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download Resume
      </a>
    </div>
  );
}
