// src/app/listings/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';

import { prisma } from '@/lib/prisma';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Listings · Vantera',
  description: 'Browse premium listings with protocol-grade presentation.',
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

async function getListings() {
  // IMPORTANT: your Listing model has NO slug yet.
  // So we query + route by id only.
  return prisma.listing.findMany({
    where: { status: 'LIVE', visibility: 'PUBLIC' },
    orderBy: { createdAt: 'desc' },
    include: {
      city: { select: { name: true, slug: true, country: true, region: true } },
      coverMedia: { select: { url: true, alt: true, width: true, height: true } },
    },
    take: 60,
  });
}

export default async function ListingsPage() {
  const listings = await getListings();

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
              Now reading from Prisma. Next step is provider ingestion and normalization.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-white/7"
            prefetch
          >
            Back to home
          </Link>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs text-zinc-400">Total listings</div>
              <div className="mt-1 text-lg font-semibold text-zinc-100">{listings.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs text-zinc-400">Price style</div>
              <div className="mt-1 text-lg font-semibold text-amber-100">Currency-aware</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs text-zinc-400">Status</div>
              <div className="mt-1 text-lg font-semibold text-emerald-200">Live</div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => {
            const priceLabel =
              typeof l.price === 'number' ? formatMoney(l.price, l.currency || 'EUR') : null;

            return (
              <Link
                key={l.id}
                href={`/listing/${l.id}`}
                className="group rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20"
                prefetch
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-zinc-50">{l.title}</div>
                    <div className="mt-1 truncate text-xs text-zinc-400">
                      {l.city.name}, {l.city.country}
                      {l.city.region ? ` · ${l.city.region}` : ''}
                    </div>
                  </div>

                  <span className="rounded-full border border-amber-300/20 bg-gradient-to-b from-amber-300/10 to-white/5 px-2.5 py-1 text-[11px] font-semibold text-amber-100">
                    {priceLabel ?? 'Price on request'}
                  </span>
                </div>

                <div className="mt-4 h-px w-full bg-white/10" />

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-xs text-zinc-400">{`/listing/${l.id}`}</div>
                  <div className="text-xs text-zinc-500">
                    {l.verification === 'VERIFIED_DOCS' || l.verification === 'VERIFIED_ON_SITE'
                      ? 'Verified'
                      : 'Seed'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-xs text-zinc-500">
          SEO note: once we add a real Listing.slug column we can switch canonical URLs to slug-first.
        </div>
      </div>
    </div>
  );
}
