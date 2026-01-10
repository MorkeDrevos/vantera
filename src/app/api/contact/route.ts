// src/app/contact/page.tsx
'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        setError(j?.error ? String(j.error) : 'Something went wrong');
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <h1 className="mb-6 text-3xl font-semibold">Contact</h1>

      {sent ? (
        <p className="text-green-600">Thank you. Your message has been sent.</p>
      ) : (
        <>
          {error ? <p className="mb-4 text-red-600">{error}</p> : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <input name="name" placeholder="Name" className="w-full border px-4 py-3" />
            <input name="email" type="email" required placeholder="Email" className="w-full border px-4 py-3" />
            <textarea name="message" required placeholder="Message" rows={5} className="w-full border px-4 py-3" />
            <button disabled={loading} className="bg-black px-6 py-3 text-white">
              {loading ? 'Sending…' : 'Send'}
            </button>
          </form>
        </>
      )}
    </main>
  );
}
