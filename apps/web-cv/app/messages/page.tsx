'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

type MessageItem = {
  name: string;
  email: string;
  message: string;
  receivedAt: string;
};

function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL ?? '/api';
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authConfigured, setAuthConfigured] = useState(true);

  const checkSession = useCallback(async () => {
    const response = await fetch(`${getApiBase()}/contact/auth`, { credentials: 'include' });
    if (!response.ok) return { authenticated: false, configured: true };
    const data = await response.json();
    setAuthConfigured(data.configured !== false);
    return { authenticated: Boolean(data.authenticated), configured: data.configured !== false };
  }, []);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${getApiBase()}/contact/messages`, { credentials: 'include' });

      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Unable to load messages (${response.status})`);
      }

      const data = await response.json();
      setMessages(data.messages || []);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const session = await checkSession();
      if (session.authenticated) {
        setAuthenticated(true);
        await loadMessages();
      } else {
        setAuthenticated(false);
        setLoading(false);
      }
    };
    init();
  }, [checkSession, loadMessages]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await fetch(`${getApiBase()}/contact/auth`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Incorrect password');
      }

      setPassword('');
      setAuthenticated(true);
      await loadMessages();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch(`${getApiBase()}/contact/auth`, { method: 'DELETE', credentials: 'include' });
    setAuthenticated(false);
    setMessages([]);
    setError('');
  };

  if (!authenticated) {
    return (
      <div className="wrapper" style={{ paddingTop: '3rem', maxWidth: 480 }}>
        <div className="terminal-tag" style={{ marginBottom: '1rem' }}>admin --auth REQUIRED</div>
        <h1 className="name" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Access</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {authConfigured
            ? 'Enter the admin password to view received messages.'
            : 'Admin access is not configured. Set the MESSAGE_SECRET environment variable in Vercel project settings (or .env.local locally).'}
        </p>

        <form className="glass-panel contact-form" onSubmit={handleLogin}>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
              disabled={!authConfigured}
            />
          </label>
          <button type="submit" disabled={isLoggingIn || !authConfigured}>
            {isLoggingIn ? 'Verifying...' : 'Unlock messages'}
          </button>
          {loginError && <p className="contact-status error">{loginError}</p>}
        </form>

        <div style={{ marginTop: '1.5rem' }}>
          <Link href="/" className="cert-badge-link">← Back to CV</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper" style={{ paddingTop: '3rem' }}>
      <div className="messages-page-header">
        <div>
          <div className="terminal-tag" style={{ marginBottom: '1rem' }}>admin --access SECURE</div>
          <h1 className="name" style={{ fontSize: '2rem' }}>Received Messages</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Private admin inbox.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="hud-btn" onClick={loadMessages} disabled={loading}>
            Refresh
          </button>
          <button type="button" className="hud-btn" onClick={handleLogout}>
            Logout
          </button>
          <Link href="/" className="cert-badge-link">
            ← Back to CV
          </Link>
        </div>
      </div>

      {loading && <p style={{ color: 'var(--text-secondary)' }}>Loading messages...</p>}
      {error && <p className="contact-status error">{error}</p>}
      {!loading && !error && messages.length === 0 && (
        <p style={{ color: 'var(--text-secondary)' }}>No messages yet.</p>
      )}
      {!loading && !error && messages.length > 0 && (
        <p style={{ color: 'var(--accent-green)', marginBottom: '1rem' }}>
          {messages.length} message{messages.length === 1 ? '' : 's'} received
        </p>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {messages.map((message, index) => (
          <article key={`${message.email}-${message.receivedAt}-${index}`} className="message-card">
            <div className="message-card-header">
              <strong style={{ color: 'var(--accent-cyan)' }}>{message.name}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {new Date(message.receivedAt).toLocaleString()}
              </span>
            </div>
            <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>{message.email}</p>
            <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.7 }}>{message.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
