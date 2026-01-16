// src/app/listings/page.tsx
import Link from 'next/link';

import type { Metadata } from 'next';

import { prisma } from '@/lib/prisma';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Listings · Vantera',
  description:
    'Browse premium listings with protocol-grade presentation. Live data ingestion comes next.',
};

function formatMoney(n: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    const sym = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '';
    return `${sym}${Math.round(n).toLocaleString()}`;
  }
}

export default async function ListingsPage() {
  // IMPORTANT:
  // Your current Prisma Listing model does NOT have `slug`.
  // So this page links using `/listing/${id}` only.
  const listings = await prisma.listing.findMany({
    where: { status: 'LIVE' },
    orderBy: { createdAt: 'desc' },
    take: 60,
    include: {
      city: { select: { name: true, slug: true, country: true, region: true } },
      coverMedia: { select: { url: true, alt: true, width: true, height: true } },
      media: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
        select: { url: true, alt: true, kind: true, sortOrder: true },
      },
    },
  });

  const total = listings.length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-56 left-1/2 h-[780px] w-[1200px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-[160px]" />
        <div className="absolute -bottom-64 left-1/2 h-[820px] w-[1280px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[170px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Listings</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              Protocol-grade listings surface
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300">
              These are database-backed listings (Prisma). Provider ingestion comes next.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-white/10"
            prefetch
          >
            Back to home
          </Link>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs text-zinc-400">Live listings</div>
              <div className="mt-1 text-lg font-semibold text-zinc-100">{total}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs text-zinc-400">Coverage</div>
              <div className="mt-1 text-lg font-semibold text-amber-100">Seed + curated</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs text-zinc-400">Indexing</div>
              <div className="mt-1 text-lg font-semibold text-emerald-200">Truth-gated</div>
            </div>
          </div>
        </div>

        {total === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <div className="text-sm text-zinc-300">No live listings yet.</div>
            <div className="mt-2 text-xs text-zinc-500">
              Run seed or ingest a first city feed, then this page fills automatically.
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => {
              const hero = l.coverMedia?.url || l.media?.[0]?.url || null;
              const heroAlt = l.coverMedia?.alt || l.media?.[0]?.alt || l.title;

              const priceLabel =
                typeof l.price === 'number' ? formatMoney(l.price, l.currency || 'EUR') : 'Price on request';

              return (
                <Link
                  key={l.id}
                  href={`/listing/${l.id}`}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20"
                  prefetch
                >
                  {hero ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={hero} alt={heroAlt} className="aspect-[16/10] w-full object-cover" />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-white">{l.title}</div>
                          <div className="mt-1 truncate text-[11px] text-zinc-200/90">
                            {l.city.name}, {l.city.country}
                            {l.city.region ? ` · ${l.city.region}` : ''}
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full border border-amber-300/20 bg-gradient-to-b from-amber-300/10 to-white/5 px-2.5 py-1 text-[11px] font-semibold text-amber-100">
                          {priceLabel}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-base font-semibold text-zinc-50">{l.title}</div>
                          <div className="mt-1 truncate text-xs text-zinc-400">
                            {l.city.name}, {l.city.country}
                            {l.city.region ? ` · ${l.city.region}` : ''}
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full border border-amber-300/20 bg-gradient-to-b from-amber-300/10 to-white/5 px-2.5 py-1 text-[11px] font-semibold text-amber-100">
                          {priceLabel}
                        </span>
                      </div>

                      <div className="mt-4 h-px w-full bg-white/10" />
                      <div className="mt-4 text-xs text-zinc-400">{`/listing/${l.id}`}</div>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                      {l.propertyType ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          {l.propertyType}
                        </span>
                      ) : null}

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        {l.verification === 'VERIFIED_DOCS' || l.verification === 'VERIFIED_ON_SITE'
                          ? 'Verified'
                          : 'Unverified'}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        {l.city.slug.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-4 h-px w-full bg-white/10" />

                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                      <span>{`/listing/${l.id}`}</span>
                      <span className="text-zinc-400 transition group-hover:text-zinc-200">Open</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-xs text-zinc-500">
          SEO note: once you add a real Listing.slug column, we can switch links and canonicals to slug-first.
        </div>
      </div>
    </div>
  );
}
