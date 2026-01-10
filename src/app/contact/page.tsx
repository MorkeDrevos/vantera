'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    setLoading(false);
    if (res.ok) setSent(true);
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <h1 className="mb-6 text-3xl font-semibold">Contact</h1>

      {sent ? (
        <p className="text-green-600">
          Thank you. Your message has been sent.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            className="w-full border px-4 py-3"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full border px-4 py-3"
          />
          <textarea
            name="message"
            required
            placeholder="Message"
            rows={5}
            className="w-full border px-4 py-3"
          />
          <button
            disabled={loading}
            className="bg-black px-6 py-3 text-white"
          >
            {loading ? 'Sending…' : 'Send'}
          </button>
        </form>
      )}
    </main>
  );
}
