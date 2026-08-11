import type { CvData } from 'cv-data';

export default function Footer({ footer }: { footer: CvData['footer'] }) {
  return (
    <footer className="footer" id="cv-footer">
      <div className="footer-text">
        <span>//</span> {footer.status} <span>●</span> {footer.location} <span>●</span> {footer.updated}
      </div>
    </footer>
  );
}
