'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AdminAuthCard from '../../components/auth/AdminAuthCard';

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
  const [authConfigured, setAuthConfigured] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch(`${getApiBase()}/contact/auth`, { credentials: 'include' });
      if (!response.ok) return { authenticated: false, configured: true };
      const data = await response.json();
      setAuthConfigured(data.configured !== false);
      return { authenticated: Boolean(data.authenticated), configured: data.configured !== false };
    } catch {
      return { authenticated: false, configured: false };
    }
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
        throw new Error(`Unable to load messages (Status ${response.status})`);
      }

      const data = await response.json();
      setMessages(data.messages || []);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error loading messages.');
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

  const handleLogout = async () => {
    await fetch(`${getApiBase()}/contact/auth`, { method: 'DELETE', credentials: 'include' });
    setAuthenticated(false);
    setMessages([]);
    setError('');
  };

  // Locked Gate State
  if (!authenticated) {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-[#06090e]">
        <AdminAuthCard
          title="Admin Messages Inbox"
          subtitle={
            authConfigured
              ? 'Enter your admin password to view received messages from the portfolio contact form.'
              : 'Admin access is not configured. Set the MESSAGE_SECRET environment variable in .env.local on your server.'
          }
          authConfigured={authConfigured}
          onAuthenticated={async () => {
            setAuthenticated(true);
            await loadMessages();
          }}
          backHref="/"
        />
      </main>
    );
  }

  // Authenticated State: Cyber HUD Messages Inbox
  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#06090e]">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 font-mono animate-fade-in">
        {/* Top Cyber HUD Header */}
        <div className="mb-8 p-6 rounded-2xl bg-[#0a0f19] border border-[#162438] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#00ff88]/5 rounded-full blur-3xl -z-10" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00e5ff] via-[#00ff88] to-[#00e5ff]" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                <span className="text-[11px] uppercase tracking-widest text-[#00ff88] font-bold">
                  ADMIN --ACCESS SECURE
                </span>
              </div>
              <h1 className="text-xl md:text-3xl font-black text-[#f1f5f9] tracking-tight">
                RECEIVED MESSAGES
              </h1>
              <p className="text-xs md:text-sm text-[#94a3b8] mt-1">
                Private contact submissions sent via the portfolio contact terminal.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={loadMessages}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase bg-[#162438] hover:bg-[#24354d] text-[#00e5ff] border border-[#24354d] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <svg
                  className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>REFRESH</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase bg-[#ff3b30]/10 hover:bg-[#ff3b30]/20 text-[#ff3b30] border border-[#ff3b30]/30 transition-all cursor-pointer"
              >
                LOGOUT
              </button>

              <Link
                href="/"
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase bg-[#06090e] hover:bg-[#162438] text-[#cbd5e1] border border-[#162438] transition-all"
              >
                ← BACK TO CV
              </Link>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#162438]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#64748b]">INBOX STATUS:</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30">
              {messages.length} Message{messages.length === 1 ? '' : 's'} Logged
            </span>
          </div>
          <span className="text-xs text-[#64748b]">Encrypted Session</span>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="p-12 text-center bg-[#0a0f19] border border-[#162438] rounded-xl my-4">
            <div className="w-8 h-8 rounded-full border-2 border-[#00e5ff] border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-xs text-[#94a3b8]">Fetching inbox messages from encrypted store...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-4 rounded-xl bg-[#ff3b30]/10 border border-[#ff3b30]/30 text-[#ff3b30] text-xs mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={loadMessages}
              className="underline font-bold hover:text-[#ff3b30]/80 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && messages.length === 0 && (
          <div className="text-center py-16 px-6 bg-[#0a0f19] border border-[#162438] rounded-2xl shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#162438]/60 border border-[#24354d] flex items-center justify-center mx-auto mb-4 text-[#64748b]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#f1f5f9] tracking-wider uppercase mb-1">
              INBOX ZERO • NO MESSAGES YET
            </h3>
            <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
              Messages submitted through the portfolio contact terminal will appear here in chronological order.
            </p>
          </div>
        )}

        {/* Messages Feed */}
        {!loading && messages.length > 0 && (
          <div className="grid gap-4">
            {messages.map((msg, index) => {
              const dateFormatted = msg.receivedAt
                ? new Date(msg.receivedAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })
                : 'Recent';

              return (
                <article
                  key={`${msg.email}-${msg.receivedAt}-${index}`}
                  className="p-5 rounded-xl bg-[#0a0f19] border border-[#162438] hover:border-[#24354d] transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.05)] relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#162438]/70">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#00e5ff]" />
                      <strong className="text-sm font-bold text-[#f1f5f9]">{msg.name}</strong>
                      <span className="text-xs text-[#00e5ff] bg-[#00e5ff]/10 px-2 py-0.5 rounded border border-[#00e5ff]/20">
                        {msg.email}
                      </span>
                    </div>

                    <span className="text-[11px] text-[#64748b] font-mono">
                      {dateFormatted}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-wrap bg-[#06090e]/60 p-4 rounded-lg border border-[#162438]/50">
                    {msg.message}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
