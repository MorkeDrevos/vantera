// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  // hidden honeypot field from the form
  company?: string;
};

function clean(s: unknown, max = 5000) {
  if (typeof s !== 'string') return '';
  return s.trim().slice(0, max);
}

function isEmail(s: string) {
  // simple pragmatic check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;

    const name = clean(body.name, 120) || null;
    const emailRaw = clean(body.email, 254);
    const email = emailRaw ? emailRaw.toLowerCase() : null;

    const subject = clean(body.subject, 200) || null;
    const message = clean(body.message, 5000);

    // honeypot - if filled, silently accept but don’t store
    const honeypot = clean(body.company, 200) || null;
    if (honeypot) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!message) {
      return NextResponse.json({ ok: false, error: 'Message is required.' }, { status: 400 });
    }

    if (email && !isEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email.' }, { status: 400 });
    }

    // best-effort metadata
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

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    // Don’t leak details to clients
    return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 });
  }
}