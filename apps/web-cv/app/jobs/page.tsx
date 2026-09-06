import type { Metadata } from 'next';
import JobMatcherContainer from '../../components/jobs/JobMatcherContainer';
import MatrixCanvas from '../../components/ui/MatrixCanvas';

export const metadata: Metadata = {
  title: 'AI Job Matcher | Cyber HUD Portfolio',
  description:
    'Live web search grounded AI job matcher comparing active engineering and cybersecurity vacancies against verified CV skills.'
};

export default function JobsPage() {
  return (
    <>
      <MatrixCanvas />
      <main id="main-content" className="relative z-10 min-h-screen pt-20 pb-16">
        <JobMatcherContainer />
      </main>
    </>
  );
}
