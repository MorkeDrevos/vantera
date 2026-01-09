import Link from 'next/link';
import type { Metadata } from 'next';

import { LISTINGS } from '../../../components/home/listings';

function formatEur(n: number) {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  } catch {
    return `€${Math.round(n).toLocaleString()}`;
  }
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const listing = LISTINGS.find((l) => l.id === params.id);

  if (!listing) {
    return {
      title: 'Listing not found - Locus',
      description: 'This listing does not exist (yet).',
    };
  }

  return {
    title: `${listing.title} in ${listing.city} - Locus`,
    description: `View ${listing.title} in ${listing.city}, ${listing.country}. Protocol-grade presentation with SEO-first structure.`,
  };
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = LISTINGS.find((l) => l.id === params.id);

  if (!listing) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-7">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Listing</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-50">Not found</div>
            <p className="mt-3 text-sm text-zinc-300">
              This listing ID is not in the mock dataset.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/listings"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-white/7"
                prefetch
              >
                Back to listings
              </Link>
              <Link
                href="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-white/7"
                prefetch
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const idx = LISTINGS.findIndex((l) => l.id === listing.id);
  const prev = idx > 0 ? LISTINGS[idx - 1] : null;
  const next = idx < LISTINGS.length - 1 ? LISTINGS[idx + 1] : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-56 left-1/2 h-[780px] w-[1200px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-[160px]" />
        <div className="absolute -bottom-64 left-1/2 h-[820px] w-[1280px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[170px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Listing</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              {listing.title}
            </h1>
            <div className="mt-2 text-sm text-zinc-300">
              {listing.city}, {listing.country}
              {listing.region ? ` · ${listing.region}` : ''}
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/listings"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-white/7"
              prefetch
            >
              Back to listings
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-white/7"
              prefetch
            >
              Home
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Main */}
          <div className="lg:col-span-8">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-amber-300/20 bg-gradient-to-b from-amber-300/10 to-white/5 px-3 py-1 text-xs font-semibold text-amber-100">
                  {formatEur(listing.priceEur)}
                </span>
                {listing.beds ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
                    {listing.beds} beds
                  </span>
                ) : null}
                {listing.baths ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
                    {listing.baths} baths
                  </span>
                ) : null}
                {listing.areaM2 ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
                    {listing.areaM2} m²
                  </span>
                ) : null}
              </div>

              <div className="mt-5 text-sm leading-relaxed text-zinc-300">
                Placeholder detail section. Next step: provider data normalization + rich description + media gallery +
                map + verification signals.
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-xs text-zinc-400">Protocol status</div>
                  <div className="mt-1 text-sm font-semibold text-emerald-200">Active</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-xs text-zinc-400">Verification</div>
                  <div className="mt-1 text-sm font-semibold text-amber-100">Pending</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-xs text-zinc-400">Listing ID</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-100">{listing.id}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Next / previous</div>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                {prev ? (
                  <Link
                    href={`/listing/${prev.id}`}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-white/20"
                    prefetch
                  >
                    ← {prev.title}
                  </Link>
                ) : (
                  <div className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-500">
                    No previous
                  </div>
                )}

                {next ? (
                  <Link
                    href={`/listing/${next.id}`}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-white/20"
                    prefetch
                  >
                    {next.title} →
                  </Link>
                ) : (
                  <div className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-500">
                    No next
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side */}
          <div className="lg:col-span-4">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">Protocol actions</div>

              <div className="mt-4 grid gap-3">
                <Link
                  href="/listings?intent=buy"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:border-white/20"
                  prefetch
                >
                  Request access
                </Link>
                <Link
                  href="/listings?intent=sell"
                  className="rounded-2xl border border-amber-300/25 bg-gradient-to-b from-amber-300/15 to-white/5 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:border-amber-300/35 hover:from-amber-300/20"
                  prefetch
                >
                  List a similar home
                </Link>
              </div>

              <div className="mt-5 text-xs leading-relaxed text-zinc-400">
                Important: user interactions should feel like they are dealing with the protocol, not people. Next step:
                protocol messaging layer + automated responses.
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">SEO block</div>
              <div className="mt-3 text-xs text-zinc-400">
                Next step adds JSON-LD schema, canonical URL, and city-level internal linking.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
