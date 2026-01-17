// src/app/listings/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Listings · Vantera',
  description: '€2M+ catalogue. Clean grid. Editorial presentation. Database-backed inventory.',
  alternates: { canonical: '/listings' },
  openGraph: {
    type: 'website',
    title: 'Listings · Vantera',
    description: '€2M+ catalogue. Clean grid. Editorial presentation. Database-backed inventory.',
    url: '/listings',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Listings · Vantera',
    description: '€2M+ catalogue. Clean grid. Editorial presentation. Database-backed inventory.',
  },
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

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

function Hairline({ className }: { className?: string }) {
  return <div className={cx('h-px w-full bg-[color:var(--hairline)]', className)} />;
}

function Stat({
  k,
  v,
  tone = 'neutral',
}: {
  k: string;
  v: string;
  tone?: 'neutral' | 'gold' | 'emerald';
}) {
  const pill =
    tone === 'gold'
      ? 'bg-[rgba(231,201,130,0.14)] text-[color:var(--ink)]'
      : tone === 'emerald'
        ? 'bg-[rgba(16,185,129,0.10)] text-[color:var(--ink)]'
        : 'bg-[rgba(0,0,0,0.03)] text-[color:var(--ink)]';

  return (
    <div className="border border-[color:var(--hairline)] bg-white p-4">
      <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">{k}</div>
      <div className="mt-2 flex items-center gap-3">
        <div className="text-[20px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">{v}</div>
        <span className={cx('px-2.5 py-1 text-[11px] font-semibold tracking-[0.18em]', pill)}>€2M+</span>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em]',
        'border border-[color:var(--hairline)] bg-white text-[color:var(--ink-2)]',
      )}
    >
      {children}
    </span>
  );
}

type ListingRow = {
  id: string;
  title: string;
  price: number | null;
  currency: string | null;
  propertyType: string | null;
  verification: string | null;
  status: string;

  city: {
    name: string;
    slug: string;
    country: string;
    region: string | null;
  };

  coverMedia: { url: string; alt: string | null; width: number | null; height: number | null } | null;
  media: { url: string; alt: string | null; kind: string; sortOrder: number }[];
};

export default async function ListingsPage() {
  // Keep it fast and stable. If you later add filters, wire to searchParams.
  const listings = (await prisma.listing.findMany({
    where: { status: 'LIVE' },
    orderBy: { createdAt: 'desc' },
    take: 72,
    include: {
      city: { select: { name: true, slug: true, country: true, region: true } },
      coverMedia: { select: { url: true, alt: true, width: true, height: true } },
      media: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
        select: { url: true, alt: true, kind: true, sortOrder: true },
      },
    },
  })) as unknown as ListingRow[];

  const total = listings.length;

  const WIDE = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';

  return (
    <div className="min-h-[100dvh] bg-white text-[color:var(--ink)]">
      {/* quiet paper aura */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.24)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(0,0,0,0.04),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(1100px_360px_at_50%_0%,rgba(231,201,130,0.12),transparent_62%)]" />
      </div>

      <main className="w-full">
        {/* Header */}
        <section className="border-b border-[color:var(--hairline)]">
          <div className={cx('py-10 sm:py-12', WIDE)}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>€2M+ catalogue</Badge>
                  <Badge>editorial grid</Badge>
                  <Badge>database-backed</Badge>
                </div>

                <h1 className="mt-4 text-balance text-[32px] font-semibold tracking-[-0.04em] text-[color:var(--ink)] sm:text-[40px]">
                  Listings
                </h1>

                <p className="mt-3 max-w-[80ch] text-pretty text-sm leading-relaxed text-[color:var(--ink-2)] sm:text-[15px]">
                  Clean, premium inventory surface. This is the catalogue view - built for desire, not filters.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/marketplace"
                  prefetch
                  className={cx(
                    'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
                    'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
                  )}
                >
                  Back to marketplace
                </Link>

                <Link
                  href="/coming-soon?flow=sell"
                  prefetch
                  className={cx(
                    'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
                    'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                  )}
                >
                  List privately
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Stat k="LIVE LISTINGS" v={String(total)} tone="neutral" />
              <Stat k="COVERAGE" v="Seed + curated" tone="gold" />
              <Stat k="INDEXING" v="Truth-gated" tone="emerald" />
            </div>

            {/* Filters row (UI-only for now) */}
            <div className="mt-7 border border-[color:var(--hairline)] bg-white">
              <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">
                  CATALOGUE GRID
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 text-[12px] text-[color:var(--ink-2)] border border-[color:var(--hairline)] bg-white">
                    sort: newest
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 text-[12px] text-[color:var(--ink-2)] border border-[color:var(--hairline)] bg-white">
                    price: €2M+
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 text-[12px] text-[color:var(--ink-2)] border border-[color:var(--hairline)] bg-white">
                    verification: any
                  </span>
                </div>
              </div>
              <Hairline />
              <div className="px-4 py-3 text-sm text-[color:var(--ink-2)]">
                Tip: use <span className="font-mono text-[color:var(--ink)]">/</span> to jump into Search Atelier from
                anywhere.
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-10 sm:py-12">
          <div className={WIDE}>
            {total === 0 ? (
              <div className="border border-[color:var(--hairline)] bg-white p-10 text-center">
                <div className="text-sm text-[color:var(--ink-2)]">No live listings yet.</div>
                <div className="mt-2 text-xs text-[color:var(--ink-3)]">
                  Seed or ingest your first inventory feed and this fills automatically.
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {listings.map((l) => {
                  const hero = l.coverMedia?.url || l.media?.[0]?.url || null;
                  const heroAlt = l.coverMedia?.alt || l.media?.[0]?.alt || l.title;

                  const priceLabel =
                    typeof l.price === 'number'
                      ? formatMoney(l.price, l.currency || 'EUR')
                      : 'Price on request';

                  const verified =
                    l.verification === 'VERIFIED_DOCS' || l.verification === 'VERIFIED_ON_SITE' ? 'Verified' : 'Unverified';

                  return (
                    <Link
                      key={l.id}
                      href={`/listing/${l.id}`}
                      prefetch
                      className={cx(
                        'group overflow-hidden border border-[color:var(--hairline)] bg-white transition',
                        'hover:border-[rgba(10,10,12,0.22)] hover:shadow-[0_30px_100px_rgba(10,10,12,0.10)]',
                      )}
                    >
                      {/* image */}
                      {hero ? (
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={hero} alt={heroAlt} className="aspect-[16/10] w-full object-cover" />
                          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,12,0.55),rgba(10,10,12,0.10),transparent)]" />

                          <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold text-[color:var(--ink)] bg-white/85 backdrop-blur-[10px] border border-[color:var(--hairline)]">
                              {verified}
                            </span>

                            <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold text-white bg-[rgba(10,10,12,0.88)] border border-[rgba(10,10,12,0.18)]">
                              {priceLabel}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[16/10] w-full bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.00))]" />
                      )}

                      {/* content */}
                      <div className="p-5">
                        <div className="min-w-0">
                          <div className="truncate text-[15px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
                            {l.title}
                          </div>
                          <div className="mt-1 truncate text-[12px] text-[color:var(--ink-2)]">
                            {l.city.name}, {l.city.country}
                            {l.city.region ? ` · ${l.city.region}` : ''}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {l.propertyType ? (
                            <span className="inline-flex items-center px-2.5 py-1 text-[11px] text-[color:var(--ink-2)] border border-[color:var(--hairline)] bg-white">
                              {l.propertyType}
                            </span>
                          ) : null}

                          <span className="inline-flex items-center px-2.5 py-1 text-[11px] text-[color:var(--ink-2)] border border-[color:var(--hairline)] bg-white">
                            {verified}
                          </span>

                          <span className="inline-flex items-center px-2.5 py-1 text-[11px] text-[color:var(--ink-2)] border border-[color:var(--hairline)] bg-white">
                            {l.city.slug}
                          </span>
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                          <div className="text-[11px] text-[color:var(--ink-3)]">{`/listing/${l.id}`}</div>
                          <div className="text-[11px] font-semibold text-[color:var(--ink-2)] group-hover:text-[color:var(--ink)] transition">
                            Open
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="mt-10 text-xs text-[color:var(--ink-3)]">
              SEO note: once Listing.slug exists, we’ll switch URLs and canonicals to slug-first.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
