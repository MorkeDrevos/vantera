// src/app/listings/page.tsx

import Link from 'next/link';
import type { Metadata } from 'next';

import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Listings · Vantera',
  description: 'Browse protocol-grade listing surfaces built from normalized provider data.',
};

export const revalidate = 300;

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
  const listings = await prisma.listing.findMany({
    where: { status: 'LIVE', visibility: 'PUBLIC' },
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    take: 60,
    include: {
      city: { select: { name: true, slug: true, country: true, region: true } },
      coverMedia: { select: { url: true, alt: true, width: true, height: true } },
    },
  });

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
              Protocol-grade listing surfaces
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300">
              This page is now wired to Prisma. Next step is ingesting real provider inventory and expanding coverage.
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
              <div className="text-xs text-zinc-400">Public live listings</div>
              <div className="mt-1 text-lg font-semibold text-zinc-100">{listings.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs text-zinc-400">Render mode</div>
              <div className="mt-1 text-lg font-semibold text-amber-100">Server + cached</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs text-zinc-400">Source</div>
              <div className="mt-1 text-lg font-semibold text-emerald-200">Prisma</div>
            </div>
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-zinc-300">
            No public live listings yet.
            <div className="mt-2 text-xs text-zinc-500">
              Next: run seed (for placeholders) or ingest ATTOM (for real Miami inventory).
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => {
              const price =
                typeof l.price === 'number' ? formatMoney(l.price, l.currency || 'USD') : 'Price on request';

              return (
                <Link
                  key={l.id}
                  href={`/listing/${l.slug}`}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20"
                  prefetch
                >
                  <div className="relative aspect-[4/3] w-full bg-black/20">
                    {l.coverMedia?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={l.coverMedia.url}
                        alt={l.coverMedia.alt || l.title}
                        className="h-full w-full object-cover opacity-[0.92] transition group-hover:opacity-100"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0">
                        <div className="absolute -top-24 left-1/2 h-[380px] w-[520px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-[120px]" />
                        <div className="absolute -bottom-24 left-1/2 h-[380px] w-[560px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[130px]" />
                      </div>
                    )}

                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-zinc-100 backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(232,190,92,0.9)]" />
                      {l.verification === 'VERIFIED_DOCS' || l.verification === 'VERIFIED_ON_SITE'
                        ? 'Verified'
                        : 'Unverified'}
                    </div>

                    <div className="absolute right-4 top-4 rounded-full border border-amber-300/20 bg-gradient-to-b from-amber-300/10 to-white/5 px-2.5 py-1 text-[11px] font-semibold text-amber-100 backdrop-blur">
                      {price}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-base font-semibold text-zinc-50">{l.title}</div>
                        <div className="mt-1 truncate text-xs text-zinc-400">
                          {l.city.name}, {l.city.country}
                          {l.city.region ? ` · ${l.city.region}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-zinc-400">
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                        <div className="text-zinc-500">Beds</div>
                        <div className="mt-0.5 text-zinc-200">{l.bedrooms ?? '—'}</div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                        <div className="text-zinc-500">Baths</div>
                        <div className="mt-0.5 text-zinc-200">{l.bathrooms ?? '—'}</div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                        <div className="text-zinc-500">Built</div>
                        <div className="mt-0.5 text-zinc-200">{l.builtM2 ? `${l.builtM2} m²` : '—'}</div>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-zinc-500">{`/listing/${l.slug}`}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-xs text-zinc-500">
          SEO note: these are stable slugs backed by your DB. Provider ingestion updates records without changing URLs.
        </div>
      </div>
    </div>
  );
}
