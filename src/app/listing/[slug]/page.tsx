// src/app/listing/[slug]/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { SEO_INTENT } from '@/lib/seo/seo.intent';
import { jsonLd, webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo/seo.jsonld';

export const revalidate = 300;

type Props = {
  // Next 15: params is a Promise
  params: Promise<{ slug: string }>;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function shouldIndexListing(verificationLevel: string) {
  return verificationLevel === 'VERIFIED_DOCS' || verificationLevel === 'VERIFIED_ON_SITE';
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

function sqftToM2Int(sqft?: number | null) {
  if (sqft == null) return null;
  return Math.round(sqft * 0.092903);
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function estimateRange(price: number, confidence?: number | null) {
  const c = confidence == null ? 50 : clamp(confidence, 0, 100);
  const pct = clamp(0.24 - (c / 100) * 0.2, 0.06, 0.24);
  const lo = Math.round(price * (1 - pct));
  const hi = Math.round(price * (1 + pct));
  return { lo, hi, pct };
}

/**
 * IMPORTANT:
 * Your Prisma Listing model DOES include `slug` now.
 * So this route resolves by slug first, and falls back to id (for older links).
 */
async function getListing(slugOrId: string) {
  if (!slugOrId) return null;

  // 1) slug-first (new canonical)
  const bySlug = await prisma.listing.findUnique({
    where: { slug: slugOrId },
    include: {
      city: { select: { id: true, name: true, slug: true, country: true, region: true } },
      coverMedia: { select: { url: true, alt: true, width: true, height: true, kind: true } },
      media: {
        orderBy: { sortOrder: 'asc' },
        select: { id: true, url: true, alt: true, sortOrder: true, kind: true },
      },
    },
  });

  if (bySlug) return bySlug;

  // 2) id fallback (back-compat)
  return prisma.listing.findUnique({
    where: { id: slugOrId },
    include: {
      city: { select: { id: true, name: true, slug: true, country: true, region: true } },
      coverMedia: { select: { url: true, alt: true, width: true, height: true, kind: true } },
      media: {
        orderBy: { sortOrder: 'asc' },
        select: { id: true, url: true, alt: true, sortOrder: true, kind: true },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const listing = await getListing(slug);
  if (!listing) {
    return { title: 'Not Found · Vantera', robots: { index: false, follow: false } };
  }

  const priceLabel =
    typeof listing.price === 'number' ? formatMoney(listing.price, listing.currency || 'EUR') : null;

  // Canonical is now the real listing.slug
  const canonicalSlug = listing.slug;

  const doc = SEO_INTENT.listing({
    id: listing.id,
    slug: canonicalSlug,
    title: listing.title,
    cityName: listing.city.name,
    citySlug: listing.city.slug,
    priceLabel,
    propertyType: listing.propertyType ?? undefined,
  });

  const indexable = shouldIndexListing(listing.verification);

  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: doc.canonical },
    robots: { index: indexable, follow: true },
    openGraph: {
      type: 'article',
      title: doc.title,
      description: doc.description,
      url: doc.canonical,
      siteName: 'Vantera',
      images: [doc.ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: [doc.ogImage],
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const { slug } = await params;

  const listing = await getListing(slug);
  if (!listing) return notFound();

  const priceLabel =
    typeof listing.price === 'number' ? formatMoney(listing.price, listing.currency || 'EUR') : null;

  const canonicalSlug = listing.slug;

  const doc = SEO_INTENT.listing({
    id: listing.id,
    slug: canonicalSlug,
    title: listing.title,
    cityName: listing.city.name,
    citySlug: listing.city.slug,
    priceLabel,
    propertyType: listing.propertyType ?? undefined,
  });

  const indexable = shouldIndexListing(listing.verification);

  const pageJsonLd = webPageJsonLd({
    url: doc.canonical,
    name: doc.jsonld?.name ?? doc.title,
    description: doc.description,
    about: (doc.jsonld?.about ?? []).map((a) => ({
      '@type': a.type,
      name: a.name,
      ...(a.extra ?? {}),
    })),
  });

  const crumbs = breadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: listing.city.name, url: `/city/${listing.city.slug}` },
    { name: 'Luxury real estate', url: `/city/${listing.city.slug}/luxury-real-estate` },
    { name: listing.title, url: `/listing/${canonicalSlug}` },
  ]);

  const sourceLabel =
    listing.verification === 'VERIFIED_DOCS' || listing.verification === 'VERIFIED_ON_SITE'
      ? 'Verified dataset'
      : 'Seed dataset';

  const cityLabel = [listing.city.name, listing.city.region, listing.city.country].filter(Boolean).join(' · ');

  const heroUrl = listing.coverMedia?.url || listing.media?.find((m) => !!m.url)?.url || null;
  const heroAlt = listing.coverMedia?.alt || listing.title;

  const builtM2 = listing.builtM2 ?? sqftToM2Int(listing.builtSqft);
  const plotM2 = listing.plotM2 ?? sqftToM2Int(listing.plotSqft);

  const images = (listing.media || []).filter((m) => (m.kind || 'image') === 'image' && !!m.url);

  const currency = (listing.currency || 'EUR').toUpperCase();
  const price = typeof listing.price === 'number' ? listing.price : null;
  const range = price ? estimateRange(price, listing.priceConfidence) : null;

  // Marketing-friendly reference number (stable, non-guessable, short)
  // Example: VNTR-MIA-4F2A9C
  const refCity = (listing.city.slug || 'city').slice(0, 3).toUpperCase();
  const refShort = listing.id.replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase();
  const ref = `VNTR-${refCity}-${refShort}`;

  return (
    <main className="min-h-screen bg-[#06060a] text-zinc-100">
      {jsonLd(pageJsonLd)}
      {jsonLd(crumbs)}

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-8 sm:px-10">
        {/* Top nav row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/city/${listing.city.slug}`}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            ← Back to {listing.city.name}
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200">
            <span className="h-2 w-2 rounded-full bg-[rgba(232,190,92,0.9)]" />
            {indexable ? 'Verified listing' : 'Unverified listing (noindex)'}
          </div>
        </div>

        {/* Royal hero */}
        <section className="mt-6 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">
          <div className="relative h-[62vh] min-h-[520px] w-full">
            {heroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroUrl} alt={heroAlt} className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_30%_10%,rgba(255,255,255,0.08),transparent)]" />
            )}

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.78))]" />

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-end justify-between gap-10">
                <div className="min-w-0">
                  <div className="text-[12px] uppercase tracking-[0.18em] text-white/70">{cityLabel}</div>
                  <h1 className="mt-3 text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-[54px]">
                    {listing.title}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/80">
                    <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 uppercase tracking-[0.16em] backdrop-blur-xl">
                      {listing.status}
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 uppercase tracking-[0.16em] backdrop-blur-xl">
                      {listing.verification}
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 uppercase tracking-[0.16em] backdrop-blur-xl">
                      Source: {sourceLabel}
                    </span>
                  </div>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <div className="text-[12px] uppercase tracking-[0.18em] text-white/65">Indicative</div>
                  <div className="mt-2 text-[30px] font-semibold tracking-[-0.02em] text-white">
                    {priceLabel ?? 'Price on request'}
                  </div>
                  <div className="mt-2 text-xs text-white/60">
                    {listing.priceConfidence != null ? `Confidence ${listing.priceConfidence}/100` : 'Confidence pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content grid */}
        <section className="mt-10 grid grid-cols-12 gap-8">
          {/* Left */}
          <div className="col-span-12 lg:col-span-8">
            {/* Badge row */}
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="gold">Vantera Intelligence</Pill>
              <Pill>{listing.visibility}</Pill>
              <Pill>{listing.propertyType ?? 'Property'}</Pill>
              <Pill tone={listing.priceConfidence != null && listing.priceConfidence >= 70 ? 'violet' : 'neutral'}>
                Price confidence {listing.priceConfidence != null ? `${listing.priceConfidence}/100` : 'pending'}
              </Pill>
              <Pill tone={listing.dataCompleteness != null && listing.dataCompleteness >= 75 ? 'violet' : 'neutral'}>
                Data completeness {listing.dataCompleteness != null ? `${listing.dataCompleteness}/100` : 'pending'}
              </Pill>
            </div>

            {/* Core card */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <Fact k="Bedrooms" v={listing.bedrooms != null ? String(listing.bedrooms) : null} />
                <Fact k="Bathrooms" v={listing.bathrooms != null ? String(listing.bathrooms) : null} />
                <Fact k="Interior" v={builtM2 != null ? `${builtM2.toLocaleString('en-US')} m²` : null} />
                <Fact k="Plot" v={plotM2 != null ? `${plotM2.toLocaleString('en-US')} m²` : null} />
                <Fact k="City" v={listing.city.name} />
                <Fact k="Reference" v={ref} />
              </div>

              <div className="mt-8">
                <div className="text-[12px] uppercase tracking-[0.18em] text-white/55">Overview</div>
                <p className="mt-3 max-w-3xl text-[15px] leading-7 text-white/80">
                  Private intelligence for the world’s most valuable assets.
                  <br />
                  Truth-first pricing signals, liquidity reality, and risk context built to separate asking price from reality.
                </p>
              </div>

              {images.length ? (
                <div className="mt-10">
                  <div className="text-[12px] uppercase tracking-[0.18em] text-white/55">Media</div>
                  <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                    {images.slice(0, 12).map((m) => (
                      <div
                        key={m.id}
                        className="relative h-[190px] w-[320px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.url} alt={m.alt || 'Property image'} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/65">
                  Media is not available yet.
                </div>
              )}
            </div>

            {/* Truth-first signals */}
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight text-white">Truth-first signals</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                This is the listing surface. Once ingestion is live, this area shows pricing context, comparable tension, and
                risk flags derived from public record signals.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SignalCard k="Value signal" v="Coming soon" />
                <SignalCard k="Liquidity" v="Coming soon" />
                <SignalCard k="Risk flags" v="Coming soon" />
                <SignalCard k="Negotiation" v="Coming soon" />
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/city/${listing.city.slug}/luxury-real-estate`}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Luxury in {listing.city.name}
                </Link>

                <Link
                  href="/luxury-real-estate"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Global luxury hub
                </Link>

                <Link
                  href="/sell-luxury-property"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Sell privately
                </Link>
              </div>
            </div>

            <div className="mt-10 text-xs text-zinc-600">
              <div>Canonical: {doc.canonical}</div>
              <div className="mt-1">Robots: {indexable ? 'index, follow' : 'noindex, follow'} (truth-first gate)</div>
            </div>
          </div>

          {/* Right - ALWAYS visible */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="sticky top-6 space-y-8">
              {/* Intelligence panel (always visible) */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-[12px] uppercase tracking-[0.18em] text-white/55">Intelligence</div>
                    <div className="mt-2 text-[16px] font-medium text-white/85">Vantera signal brief</div>
                  </div>

                  <span className="inline-flex items-center rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/70">
                    {listing.status}
                  </span>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-white/55">Indicative range</div>

                  <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-white">
                    {range ? (
                      <>
                        {currency}{' '}
                        {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(range.lo)} -{' '}
                        {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(range.hi)}
                      </>
                    ) : (
                      <span className="text-white/80">Pending valuation</span>
                    )}
                  </div>

                  <div className="mt-3 text-sm leading-6 text-white/70">
                    Calm, private estimate derived from available signals. This tightens as verification, media, and market depth
                    improve.
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Metric
                    label="Price confidence"
                    value={listing.priceConfidence != null ? `${listing.priceConfidence}/100` : 'Pending'}
                  />
                  <Metric
                    label="Data completeness"
                    value={listing.dataCompleteness != null ? `${listing.dataCompleteness}/100` : 'Pending'}
                  />
                </div>
              </section>

              {/* Actions */}
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="text-[12px] uppercase tracking-[0.18em] text-white/55">Actions</div>

                <div className="mt-4 grid gap-3">
                  <button
                    type="button"
                    className="rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white hover:bg-white/[0.10]"
                  >
                    Save to private list
                  </button>

                  <button
                    type="button"
                    className="rounded-2xl border border-[#d7b86a]/30 bg-[#d7b86a]/10 px-5 py-3 text-sm font-medium text-[#f4e1a6] hover:bg-[#d7b86a]/15"
                  >
                    Request intelligence report
                  </button>

                  <div className="pt-2 text-xs leading-5 text-white/55">Reference: {ref}</div>
                </div>
              </section>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'gold' | 'violet' }) {
  const base =
    'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em]';

  const cls =
    tone === 'gold'
      ? 'border-[#d7b86a]/30 bg-[#d7b86a]/10 text-[#f4e1a6]'
      : tone === 'violet'
        ? 'border-violet-300/20 bg-violet-500/10 text-violet-200'
        : 'border-white/10 bg-white/[0.03] text-white/70';

  return <span className={cx(base, cls)}>{children}</span>;
}

function Fact({ k, v }: { k: string; v: string | null }) {
  if (!v) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
        <div className="text-[11px] uppercase tracking-[0.16em] text-white/55">{k}</div>
        <div className="mt-1 text-[15px] font-medium text-white/35">-</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.16em] text-white/55">{k}</div>
      <div className="mt-1 text-[15px] font-medium text-white/85">{v}</div>
    </div>
  );
}

function SignalCard({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/18 p-4">
      <div className="text-xs text-zinc-400">{k}</div>
      <div className="mt-2 text-sm font-semibold text-white">{v}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.16em] text-white/55">{label}</div>
      <div className="mt-1 text-[15px] font-medium text-white/85">{value}</div>
    </div>
  );
}
