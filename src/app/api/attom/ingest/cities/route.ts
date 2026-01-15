// src/app/api/attom/ingest/cities/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CITY_PRESETS = {
  miami: {
    name: 'Miami',
    slug: 'miami',
    country: 'United States',
    region: 'Florida',
    tz: 'America/New_York',
    lat: 25.7617,
    lng: -80.1918,
  },
} as const;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const dryRun = url.searchParams.get('dryRun') === '1';

  const params = {
    dryRun,
    presets: Object.keys(CITY_PRESETS),
  };

  const run = await prisma.importRun.create({
    data: {
      source: 'attom',
      scope: 'cities',
      region: 'US-FL',
      market: 'Miami',
      params,
      status: 'RUNNING',
      startedAt: new Date(),
      message: 'Starting city upsert',
    },
    select: { id: true },
  });

  let created = 0;
  let errors = 0;
  const errorSamples: Array<{ step: string; message: string }> = [];

  try {
    for (const key of Object.keys(CITY_PRESETS) as Array<keyof typeof CITY_PRESETS>) {
      const preset = CITY_PRESETS[key];

      if (dryRun) {
        created += 1;
        continue;
      }

      await prisma.city.upsert({
        where: { slug: preset.slug },
        update: {
          name: preset.name,
          country: preset.country,
          region: preset.region,
          tz: preset.tz,
          lat: preset.lat,
          lng: preset.lng,
        },
        create: {
          name: preset.name,
          slug: preset.slug,
          country: preset.country,
          region: preset.region,
          tz: preset.tz,
          lat: preset.lat,
          lng: preset.lng,
        },
      });

      created += 1;
    }

    await prisma.importRun.update({
      where: { id: run.id },
      data: {
        status: 'SUCCEEDED',
        finishedAt: new Date(),
        scanned: created,
        created,
        skipped: 0,
        errors,
        errorSamples,
        message: 'City ingest complete',
      },
    });

    return NextResponse.json({ ok: true, runId: run.id, created, dryRun });
  } catch (e: any) {
    errors += 1;
    errorSamples.push({ step: 'route', message: e?.message || String(e) });

    await prisma.importRun.update({
      where: { id: run.id },
      data: {
        status: 'FAILED',
        finishedAt: new Date(),
        scanned: created,
        created,
        skipped: 0,
        errors,
        errorSamples,
        message: 'City ingest failed',
      },
    });

    return NextResponse.json(
      { ok: false, runId: run.id, errors, errorSamples },
      { status: 500 },
    );
  }
}
