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
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
      </label>
      <label>
        <span>Email</span>
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
      </label>
      <label>
        <span>Message</span>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about your project or opportunity (min 10 characters)"
          required
          minLength={10}
          rows={5}
        />
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send message'}
      </button>
      {status && <p className={`contact-status${statusType ? ` ${statusType}` : ''}`}>{status}</p>}
    </form>
  );
}
