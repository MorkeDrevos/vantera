// src/app/api/attom/ingest/cities/route.ts
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { CITIES, WATCHLIST_CITIES } from '@/components/home/cities';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function uniqBySlug<T extends { slug: string }>(items: T[]) {
  const map = new Map<string, T>();
  for (const it of items) map.set(it.slug, it);
  return Array.from(map.values());
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const dryRun = url.searchParams.get('dryRun') === '1';

  // Canonical city source of truth is cities.ts
  // IMPORTANT: collapse Costa del Sol into Marbella
  const all = uniqBySlug([...CITIES, ...WATCHLIST_CITIES]);

  const cities = all.filter((c) => {
    // Collapse Costa del Sol cities under Marbella
    if (c.slug === 'benahavis') return false;
    if (c.slug === 'estepona') return false;
    // If you ever add more CDS slugs, exclude them here too.
    return true;
  });

  const run = await prisma.importRun.create({
    data: {
      source: 'vantera',
      scope: 'cities',
      region: 'GLOBAL',
      market: 'Cities',
      params: { dryRun, count: cities.length, source: 'cities.ts', collapseCostaDelSolTo: 'marbella' },
      status: 'RUNNING',
      message: 'Starting city ingest',
    },
    select: { id: true },
  });

  let scanned = cities.length;
  let created = 0;
  let skipped = 0;
  let errors = 0;
  const errorSamples: Array<{ step: string; message: string }> = [];

  try {
    if (!dryRun) {
      for (const c of cities) {
        try {
          await prisma.city.upsert({
            where: { slug: c.slug },
            update: {
              name: c.name,
              country: c.country,
              region: c.region ?? null,
              tz: c.tz,
              tier: (c.tier as any) ?? undefined,
              status: (c.status as any) ?? undefined,
              priority: c.priority ?? undefined,
              blurb: c.blurb ?? null,
              heroImageSrc: c.image?.src ?? null,
              heroImageAlt: c.image?.alt ?? null,
            },
            create: {
              name: c.name,
              slug: c.slug,
              country: c.country,
              region: c.region ?? null,
              tz: c.tz,
              tier: (c.tier as any) ?? undefined,
              status: (c.status as any) ?? undefined,
              priority: c.priority ?? undefined,
              blurb: c.blurb ?? null,
              heroImageSrc: c.image?.src ?? null,
              heroImageAlt: c.image?.alt ?? null,
            },
          });
          created += 1;
        } catch (e: any) {
          errors += 1;
          if (errorSamples.length < 8) errorSamples.push({ step: 'upsert:city', message: e?.message || String(e) });
        }
      }
    } else {
      created = cities.length;
    }

    await prisma.importRun.update({
      where: { id: run.id },
      data: {
        status: errors > 0 ? 'FAILED' : 'SUCCEEDED',
        finishedAt: new Date(),
        scanned,
        created,
        skipped,
        errors,
        errorSamples,
        message: errors > 0 ? 'City ingest finished with errors' : 'City ingest complete',
      },
    });

    return NextResponse.json({
      ok: errors === 0,
      runId: run.id,
      scanned,
      created,
      skipped,
      errors,
      errorSamples,
      preview: cities.map((c) => ({ slug: c.slug, name: c.name, country: c.country })),
    });
  } catch (e: any) {
    errorSamples.push({ step: 'route', message: e?.message || String(e) });

    await prisma.importRun.update({
      where: { id: run.id },
      data: {
        status: 'FAILED',
        finishedAt: new Date(),
        scanned,
        created,
        skipped,
        errors: errors + 1,
        errorSamples,
        message: 'Route failed',
      },
    });

    return NextResponse.json(
      { ok: false, runId: run.id, message: e?.message || String(e), errorSamples },
      { status: 500 },
    );
  }
}
