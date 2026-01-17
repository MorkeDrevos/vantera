// src/app/api/realtor/ingest/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Simple health-check for Realtor ingest namespace.
 * Confirms env + returns basic info without running any scrape.
 */
export async function GET() {
  const hasToken = !!process.env.APIFY_TOKEN;
  const actorId = process.env.APIFY_REALTOR_ACTOR_ID || 'logical_vivacity~realtor-property-scraper';

  return NextResponse.json({
    ok: true,
    provider: 'realtor(apify)',
    hasToken,
    actorId,
  });
}
