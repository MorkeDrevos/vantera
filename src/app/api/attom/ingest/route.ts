// src/app/api/attom/ingest/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * ATTOM ingest endpoint
 * Currently disabled to unblock production builds.
 * Proper ingest wiring should live in /src/lib and be imported here later.
 */

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: 'ATTOM ingest endpoint disabled (route wiring pending).',
    },
    { status: 410 },
  );
}

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: 'ATTOM ingest endpoint disabled (route wiring pending).',
    },
    { status: 410 },
  );
}
