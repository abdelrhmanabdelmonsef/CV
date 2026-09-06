'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AdminAuthCardProps {
  title?: string;
  subtitle?: string;
  authConfigured?: boolean;
  onAuthenticated: () => void;
  backHref?: string;
}

export default function AdminAuthCard({
  title = 'Admin Access Required',
  subtitle,
  authConfigured = true,
  onAuthenticated,
  backHref = '/'
}: AdminAuthCardProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact/auth', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Incorrect admin password');
      }

      setPassword('');
      onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 font-mono animate-fade-in">
      <div className="relative rounded-2xl bg-[#0a0f19] border border-[#162438] p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Top Scanline Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00ff88] via-[#00e5ff] to-[#00ff88]" />
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#00e5ff]/5 rounded-full blur-3xl -z-10" />

        {/* Security Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-2 h-2 rounded-full bg-[#ffb300] animate-pulse" />
          <span className="text-[11px] uppercase tracking-widest text-[#ffb300] font-bold">
            admin --auth REQUIRED
          </span>
        </div>

        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-black text-[#f1f5f9] tracking-tight mb-2">
          {title}
        </h1>

        <p className="text-xs sm:text-sm text-[#94a3b8] mb-6 leading-relaxed">
          {subtitle ||
            (authConfigured
              ? 'Enter your admin password to unlock this protected resource.'
              : 'Admin access is not configured. Set the MESSAGE_SECRET environment variable in .env.local on your server.')}
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#94a3b8] mb-2 font-bold">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoFocus
                disabled={!authConfigured || isSubmitting}
                className="w-full bg-[#06090e] border border-[#162438] focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff]/30 rounded-xl px-4 py-3 text-sm text-[#f1f5f9] outline-none transition-all pr-11 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#f1f5f9] p-1 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-[#ff3b30]/10 border border-[#ff3b30]/30 text-[#ff3b30] text-xs flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!authConfigured || isSubmitting}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold tracking-wider uppercase bg-[#00e5ff]/20 hover:bg-[#00e5ff]/30 text-[#00e5ff] border border-[#00e5ff]/50 hover:border-[#00e5ff] transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>VERIFYING CREDENTIALS...</span>
              </>
            ) : (
              <span>UNLOCK ACCESS</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 pt-4 border-t border-[#162438] flex items-center justify-between">
          <Link
            href={backHref}
            className="text-xs text-[#64748b] hover:text-[#00e5ff] transition-colors flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to Portfolio</span>
          </Link>
          <span className="text-[10px] text-[#475569]">HMAC-SHA256 SESSION</span>
        </div>
      </div>
    </div>
  );
}
