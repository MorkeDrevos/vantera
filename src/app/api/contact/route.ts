// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;

    const name = String(body?.name ?? '').trim();
    const email = String(body?.email ?? '').trim();
    const message = String(body?.message ?? '').trim();

    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ ok: false, error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL; // set this in Vercel
    const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'Missing RESEND_API_KEY' }, { status: 500 });
    }
    if (!to) {
      return NextResponse.json({ ok: false, error: 'Missing CONTACT_TO_EMAIL' }, { status: 500 });
    }

    const subject = `Vantera contact: ${name || 'Anonymous'} (${email})`;
    const text = `Name: ${name || '-'}\nEmail: ${email}\n\nMessage:\n${message}\n`;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        text,
      }),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => '');
      return NextResponse.json(
        { ok: false, error: 'Resend API error', details: errText.slice(0, 500) },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
}
