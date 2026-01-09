// app/contact/page.tsx
'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
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
      <h1 className="text-3xl font-semibold mb-6">Contact</h1>

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
            className="bg-black text-white px-6 py-3"
          >
            {loading ? 'Sending…' : 'Send'}
          </button>
        </form>
      )}
    </main>
  );
}
