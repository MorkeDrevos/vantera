// src/app/api/ops/imports/route.ts
import { NextResponse } from 'next/server';

import { createImportRun, listImportRuns, updateImportRun } from '@/lib/ops/importRunsStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET: list recent runs for the Operations UI
export async function GET() {
  const runs = listImportRuns(75);
  return NextResponse.json({ ok: true, runs });
}

// POST: create a test run (to validate the UI + plumbing)
// Later we can change this into "trigger import job" if you want.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        source?: 'attom' | 'other';
        scope?: 'cities' | 'properties';
        region?: string;
        market?: string;
      }
    | null;

  const now = new Date().toISOString();

  const run = createImportRun({
    source: body?.source ?? 'attom',
    scope: body?.scope ?? 'cities',
    region: body?.region ?? 'US-FL',
    market: body?.market ?? 'Miami',
    status: 'running',
    startedAt: now,
    message: 'Test run started',
  });

  // Simulate completion (fast, non-blocking)
  // Note: Not a background job - just a tiny delayed update for demo.
  setTimeout(() => {
    updateImportRun(run.id, {
      status: 'success',
      finishedAt: new Date().toISOString(),
      recordsIn: 120,
      recordsUpserted: 118,
      warnings: 2,
      message: 'Test run completed',
    });
  }, 900);

  return NextResponse.json({ ok: true, run });
}
