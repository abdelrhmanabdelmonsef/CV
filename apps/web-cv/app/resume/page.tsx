'use client';

import cvData from 'cv-data';
import Link from 'next/link';
import { useEffect } from 'react';
import MatrixCanvas from '../../components/ui/MatrixCanvas';
import { RESUME_CSS, buildResumeBodyHtml } from '../../lib/resume-template';

export default function ResumePage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('print') === '1') {
      const timer = setTimeout(() => {
        window.print();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .resume-toolbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 24px;
          background: rgba(6, 9, 14, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0, 229, 255, 0.15);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        .toolbar-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          font-size: 13px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .back-btn {
          color: #94a3b8;
          background: rgba(13, 20, 36, 0.7);
          border-color: rgba(0, 229, 255, 0.12);
        }
        .back-btn:hover {
          color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
          border-color: rgba(0, 255, 136, 0.3);
          box-shadow: 0 0 12px rgba(0, 255, 136, 0.15);
        }
        .primary-btn {
          color: #06090e;
          background: linear-gradient(135deg, #00ff88, #00e5ff);
          font-weight: 700;
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.25);
        }
        .primary-btn:hover {
          box-shadow: 0 0 25px rgba(0, 255, 136, 0.45);
          transform: translateY(-1px);
        }
        @media print {
          .resume-toolbar, #matrix-canvas {
            display: none !important;
          }
        }
      `
        }}
      />
      <MatrixCanvas />
      <div className="resume-toolbar">
        <Link href="/" className="toolbar-btn back-btn">
          ← Back to Interactive CV
        </Link>
        <div className="toolbar-actions">
          <button
            type="button"
            className="toolbar-btn primary-btn"
            onClick={() => window.print()}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Save as PDF / Print
          </button>
        </div>
      </div>
      <div className="resume-shell">
        <main
          className="resume-page"
          dangerouslySetInnerHTML={{ __html: buildResumeBodyHtml(cvData) }}
        />
      </div>
    </>
  );
}
