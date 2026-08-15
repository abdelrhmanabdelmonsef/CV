import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume — Abdel-Rahman Abdel-Monsef',
  robots: { index: false, follow: false }
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <div className="resume-shell">{children}</div>;
}
