// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;

  // hidden honeypot field from the form
  honeypot?: string;
};

function clean(s: unknown, max = 5000) {
  if (typeof s !== 'string') return '';
  return s.trim().slice(0, max);
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function wantsJson(req: Request) {
  const accept = req.headers.get('accept') || '';
  return accept.includes('application/json');
}

async function readPayload(req: Request): Promise<ContactPayload> {
  const ct = req.headers.get('content-type') || '';

  // HTML form posts
  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
    const fd = await req.formData();
    return {
      name: clean(fd.get('name')),
      email: clean(fd.get('email')),
      subject: clean(fd.get('subject')),
      message: clean(fd.get('message')),
      honeypot: clean(fd.get('honeypot')),
    };
  }

  // JSON posts
  const body = (await req.json()) as ContactPayload;
  return {
    name: clean(body?.name),
    email: clean(body?.email),
    subject: clean(body?.subject),
    message: clean(body?.message),
    honeypot: clean(body?.honeypot),
  };
}

export async function POST(req: Request) {
  try {
    const body = await readPayload(req);

    const name = clean(body.name, 120) || null;
    const emailRaw = clean(body.email, 254);
    const email = emailRaw ? emailRaw.toLowerCase() : null;

    const subject = clean(body.subject, 200) || null;
    const message = clean(body.message, 5000);

    // honeypot - if filled, silently accept but don’t store
    const honeypot = clean(body.honeypot, 200) || null;
    if (honeypot) {
      if (wantsJson(req)) return NextResponse.json({ ok: true }, { status: 200 });
      return NextResponse.redirect(new URL('/contact?ok=1', req.url), 303);
    }

    if (!message) {
      if (wantsJson(req)) {
        return NextResponse.json({ ok: false, error: 'Message is required.' }, { status: 400 });
      }
      return NextResponse.redirect(new URL('/contact?ok=0', req.url), 303);
    }

    if (email && !isEmail(email)) {
      if (wantsJson(req)) {
        return NextResponse.json({ ok: false, error: 'Invalid email.' }, { status: 400 });
      }
      return NextResponse.redirect(new URL('/contact?ok=0', req.url), 303);
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      null;

    const userAgent = req.headers.get('user-agent') || null;

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        honeypot,
        ip,
        userAgent,
      },
    });

    // ✅ Best UX for native form submit
    if (wantsJson(req)) return NextResponse.json({ ok: true }, { status: 200 });
    return NextResponse.redirect(new URL('/contact?ok=1', req.url), 303);
  } catch {
    if (wantsJson(req)) {
      return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 });
    }
    return NextResponse.redirect(new URL('/contact?ok=0', req.url), 303);
  }
}
