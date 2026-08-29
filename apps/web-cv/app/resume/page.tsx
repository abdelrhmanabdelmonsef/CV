'use client';

import cvData from 'cv-data';
import Link from 'next/link';
import { useEffect } from 'react';
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
          padding: 10px 20px;
          background: #0f172a;
          border-bottom: 1px solid #1e293b;
        }
        .toolbar-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 6px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .back-btn {
          color: #94a3b8;
          background: #1e293b;
          border-color: #334155;
        }
        .back-btn:hover {
          color: #ffffff;
          background: #334155;
        }
        .primary-btn {
          color: #ffffff;
          background: #2563eb;
        }
        .primary-btn:hover {
          background: #1d4ed8;
        }
        @media print {
          .resume-toolbar {
            display: none !important;
          }
        }
      `
        }}
      />
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
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
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
