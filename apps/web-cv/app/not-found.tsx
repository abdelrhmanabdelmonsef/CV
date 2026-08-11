import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="wrapper" style={{ paddingTop: '4rem', textAlign: 'center' }}>
      <div className="terminal-tag" style={{ margin: '0 auto 1rem' }}>error --code 404</div>
      <h1 className="name" style={{ fontSize: '2.5rem' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        The requested route does not exist in this secure zone.
      </p>
      <Link href="/" className="cert-badge-link">
        Return to CV
      </Link>
    </div>
  );
}
