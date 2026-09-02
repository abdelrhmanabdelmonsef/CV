import type { CvData } from 'cv-data';

export default function Footer({ footer }: { footer: CvData['footer'] }) {
  return (
    <footer className="mt-12 pt-6 border-t border-border-subtle" id="cv-footer">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-text-muted font-mono">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-glow-pulse" />
          {footer.status}
        </span>
        <span className="text-border-subtle">●</span>
        <span>{footer.location}</span>
        <span className="text-border-subtle">●</span>
        <span>{footer.updated}</span>
      </div>
    </footer>
  );
}
