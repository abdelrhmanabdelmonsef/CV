'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';

type FormState = {
  name: string;
  email: string;
  message: string;
};

function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL ?? '/api';
}

async function parseError(response: Response) {
  try {
    const result = await response.json();
    if (Array.isArray(result.message)) return result.message.join(', ');
    if (typeof result.message === 'string') return result.message;
    return 'Unable to send message';
  } catch {
    return `Request failed (${response.status})`;
  }
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('Sending...');
    setStatusType('');

    try {
      const response = await fetch(`${getApiBase()}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const msg = await parseError(response);
        throw new Error(msg);
      }

      setStatus('Message sent successfully!');
      setStatusType('success');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setStatus('Could not reach the server. Please try again.');
      } else {
        setStatus(error instanceof Error ? error.message : 'Submission failed');
      }
      setStatusType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">Name</span>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          required
          className="w-full px-4 py-2.5 rounded-lg bg-bg-input border border-border-subtle
            text-sm text-text-primary placeholder:text-text-muted/50
            focus:outline-none focus:border-accent-cyan/40 focus:shadow-[0_0_12px_rgba(0,229,255,0.1)]
            transition-all duration-200"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">Email</span>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          className="w-full px-4 py-2.5 rounded-lg bg-bg-input border border-border-subtle
            text-sm text-text-primary placeholder:text-text-muted/50
            focus:outline-none focus:border-accent-cyan/40 focus:shadow-[0_0_12px_rgba(0,229,255,0.1)]
            transition-all duration-200"
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">Message</span>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about your project or opportunity (min 10 characters)"
          required
          minLength={10}
          rows={5}
          className="w-full px-4 py-2.5 rounded-lg bg-bg-input border border-border-subtle
            text-sm text-text-primary placeholder:text-text-muted/50 resize-y
            focus:outline-none focus:border-accent-cyan/40 focus:shadow-[0_0_12px_rgba(0,229,255,0.1)]
            transition-all duration-200"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold
          bg-gradient-to-r from-accent-green/90 to-accent-cyan/90 text-bg-primary
          hover:shadow-[0_0_20px_rgba(0,255,136,0.25)] hover:scale-[1.02]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          transition-all duration-200 cursor-pointer"
      >
        {isSubmitting ? 'Sending...' : 'Send message'}
      </button>
      {status && (
        <p
          role="status"
          aria-live="polite"
          className={`text-xs font-medium mt-2 ${
            statusType === 'success' ? 'text-accent-green' :
            statusType === 'error' ? 'text-accent-red' :
            'text-text-muted'
          }`}
        >
          {status}
        </p>
      )}
    </form>
  );
}
