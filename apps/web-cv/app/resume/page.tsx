import cvData from 'cv-data';
import { RESUME_CSS, buildResumeBodyHtml } from '../../lib/resume-template';
import AutoPrint from '../../components/resume/AutoPrint';

type ResumePageProps = {
  searchParams?: { print?: string };
};

export default function ResumePage({ searchParams }: ResumePageProps) {
  const shouldPrint = searchParams?.print === '1';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
      <main
        style={{
          maxWidth: '210mm',
          margin: '0 auto',
          background: '#ffffff'
        }}
        dangerouslySetInnerHTML={{ __html: buildResumeBodyHtml(cvData) }}
      />
      {shouldPrint ? <AutoPrint /> : null}
    </>
  );
}
