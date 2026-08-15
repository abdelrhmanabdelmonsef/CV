import cvData from 'cv-data';
import { RESUME_CSS, buildResumeBodyHtml } from '../../lib/resume-template';

export default function ResumePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
      <main
        className="resume-page"
        dangerouslySetInnerHTML={{ __html: buildResumeBodyHtml(cvData) }}
      />
    </>
  );
}
