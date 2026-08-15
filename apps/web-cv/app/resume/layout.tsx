import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume — Abdel-Rahman Abdel-Monsef',
  robots: { index: false, follow: false }
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#ffffff',
        minHeight: '100vh',
        padding: '24px 16px'
      }}
    >
      {children}
    </div>
  );
}
