'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = '/';
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="wrapper" style={{ paddingTop: '4rem', textAlign: 'center' }}>
      <div className="terminal-tag" style={{ margin: '0 auto 1rem' }}>error --code 404</div>
      <h1 className="name" style={{ fontSize: '2.5rem' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        The requested route does not exist in this secure zone.
      </p>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
        Redirecting to CV in {countdown}s...
      </p>
      <Link href="/" className="cert-badge-link">
        Return to CV
      </Link>
    </div>
  );
}
