// src/app/listing/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

import { prisma } from '@/lib/prisma';
import { SEO_INTENT } from '@/lib/seo/seo.intent';
import { jsonLd, webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo/seo.jsonld';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 300;

type Props = {
  // Next 15: params is a Promise
  params: Promise<{ slug: string }>;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function Hairline({ className }: { className?: string }) {
  return <div className={cx('h-px w-full bg-[color:var(--hairline)]', className)} />;
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
 * Resolve by slug first (canonical), fall back to id (back-compat).
 */
async function getListing(slugOrId: string) {
  if (!slugOrId) return null;

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
  if (!listing) return { title: 'Not Found · Vantera', robots: { index: false, follow: false } };

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

function StatPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em] border border-[color:var(--hairline)] bg-white text-[color:var(--ink-2)]">
      {children}
    </span>
  );
}

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-[11px] font-semibold tracking-[0.26em] text-[color:var(--ink-3)]">{k}</div>
      <div className="text-sm text-right text-[color:var(--ink)]">{v}</div>
    </div>
  );
}

function ButtonPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      prefetch
      className={cx(
        'inline-flex w-full items-center justify-center px-5 py-3 text-sm font-semibold transition',
        'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
      )}
    >
      {children}
    </Link>
  );
}

function ButtonSecondary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      prefetch
      className={cx(
        'inline-flex w-full items-center justify-center px-5 py-3 text-sm font-semibold transition',
        'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
      )}
    >
      {children}
    </Link>
  );
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
    { name: 'Listings', url: '/listings' },
    { name: listing.city.name, url: `/city/${listing.city.slug}` },
    { name: listing.title, url: `/listing/${canonicalSlug}` },
  ]);

  const cityLabel = [listing.city.name, listing.city.region, listing.city.country].filter(Boolean).join(' · ');

  const heroUrl = listing.coverMedia?.url || listing.media?.find((m) => !!m.url)?.url || null;
  const heroAlt = listing.coverMedia?.alt || listing.title;

  const builtM2 = listing.builtM2 ?? sqftToM2Int(listing.builtSqft);
  const plotM2 = listing.plotM2 ?? sqftToM2Int(listing.plotSqft);

  const images = (listing.media || []).filter((m) => (m.kind || 'image') === 'image' && !!m.url);

  const currency = (listing.currency || 'EUR').toUpperCase();
  const price = typeof listing.price === 'number' ? listing.price : null;
  const range = price ? estimateRange(price, listing.priceConfidence) : null;

  // VNTR-MIA-4F2A9C
  const refCity = (listing.city.slug || 'city').slice(0, 3).toUpperCase();
  const refShort = listing.id.replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase();
  const ref = `VNTR-${refCity}-${refShort}`;

  const verified =
    listing.verification === 'VERIFIED_DOCS' || listing.verification === 'VERIFIED_ON_SITE'
      ? 'Verified'
      : 'Unverified';

  const WIDE = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';

  return (
    <div className="min-h-[100dvh] bg-white text-[color:var(--ink)]">
      {jsonLd(pageJsonLd)}
      {jsonLd(crumbs)}

      {/* paper aura */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.24)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(0,0,0,0.04),transparent_62%)]" />
        <div className="absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(1100px_360px_at_50%_0%,rgba(231,201,130,0.12),transparent_62%)]" />
      </div>

      <TopBar />

      <main className="w-full">
        {/* Breadcrumb / back row */}
        <section className="border-b border-[color:var(--hairline)]">
          <div className={cx('py-6', WIDE)}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/listings"
                  className="text-sm text-[color:var(--ink-2)] hover:text-[color:var(--ink)] transition"
                  prefetch
                >
                  Listings
                </Link>
                <span className="text-[color:var(--ink-3)]">/</span>
                <Link
                  href={`/city/${listing.city.slug}`}
                  className="text-sm text-[color:var(--ink-2)] hover:text-[color:var(--ink)] transition"
                  prefetch
                >
                  {listing.city.name}
                </Link>
                <span className="text-[color:var(--ink-3)]">/</span>
                <span className="text-sm text-[color:var(--ink)]">{ref}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatPill>{verified}</StatPill>
                <StatPill>{indexable ? 'indexable' : 'noindex'}</StatPill>
                <StatPill>{listing.visibility}</StatPill>
              </div>
            </div>
          </div>
        </section>

        {/* Full-bleed hero */}
        <section className="relative">
          <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden border-b border-[color:var(--hairline)] bg-[color:var(--paper-2)]">
            <div className="relative h-[72vh] min-h-[560px] w-full">
              {heroUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={heroUrl} alt={heroAlt} className="h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_30%_10%,rgba(0,0,0,0.06),transparent_64%)]" />
              )}

              {/* editorial wash */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.88),rgba(255,255,255,0.56),rgba(255,255,255,0.30))]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.22),rgba(255,255,255,0.14),rgba(255,255,255,0.90))]" />

              <div className={cx('relative z-10 h-full', WIDE)}>
                <div className="flex h-full items-end pb-10 sm:pb-14">
                  <div className="max-w-[1050px]">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <StatPill>€2M+</StatPill>
                      {listing.propertyType ? <StatPill>{listing.propertyType}</StatPill> : null}
                      <StatPill>{cityLabel}</StatPill>
                    </div>

                    <h1 className="text-balance text-[40px] font-semibold tracking-[-0.05em] text-[color:var(--ink)] sm:text-[56px] lg:text-[68px] lg:leading-[0.98]">
                      {listing.title}
                    </h1>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div className="text-[15px] text-[color:var(--ink-2)]">
                        {priceLabel ?? 'Price on request'}
                      </div>

                      {range ? (
                        <div className="text-[13px] text-[color:var(--ink-3)]">
                          Indicative range: {currency}{' '}
                          {new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(range.lo)} -{' '}
                          {new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(range.hi)}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* bottom hairline */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="py-10 sm:py-12">
          <div className={WIDE}>
            <div className="grid grid-cols-12 gap-8">
              {/* Main */}
              <div className="col-span-12 lg:col-span-8">
                {/* Facts */}
                <div className="border border-[color:var(--hairline)] bg-white p-6 sm:p-7">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                        DETAILS
                      </div>
                      <div className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                        Key facts
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                      <StatPill>{ref}</StatPill>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <Spec k="Bedrooms" v={listing.bedrooms != null ? String(listing.bedrooms) : null} />
                    <Spec k="Bathrooms" v={listing.bathrooms != null ? String(listing.bathrooms) : null} />
                    <Spec k="Interior" v={builtM2 != null ? `${builtM2.toLocaleString('en-GB')} m²` : null} />
                    <Spec k="Plot" v={plotM2 != null ? `${plotM2.toLocaleString('en-GB')} m²` : null} />
                    <Spec k="City" v={listing.city.name} />
                    <Spec k="Verification" v={verified} />
                  </div>

                  <div className="mt-7">
                    <Hairline />
                  </div>

                  <div className="mt-6 max-w-[82ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
                    This is an editorial catalogue view. Contact and private report flows can be wired next, but the
                    presentation stays clean and premium.
                  </div>
                </div>

                {/* Gallery */}
                <div className="mt-8 border border-[color:var(--hairline)] bg-white p-6 sm:p-7">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                        GALLERY
                      </div>
                      <div className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                        Photography
                      </div>
                    </div>

                    <div className="text-xs text-[color:var(--ink-3)]">
                      {images.length ? `${images.length} images` : 'No images yet'}
                    </div>
                  </div>

                  {images.length ? (
                    <div className="mt-6 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {images.slice(0, 16).map((m) => (
                        <div
                          key={m.id}
                          className="relative h-[210px] w-[360px] shrink-0 overflow-hidden border border-[color:var(--hairline)] bg-[color:var(--paper-2)]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={m.url} alt={m.alt || 'Property image'} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 border border-[color:var(--hairline)] bg-[rgba(0,0,0,0.02)] p-6 text-sm text-[color:var(--ink-2)]">
                      Media is not available yet.
                    </div>
                  )}
                </div>

                {/* Related navigation */}
                <div className="mt-8 border border-[color:var(--hairline)] bg-white p-6 sm:p-7">
                  <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">NEXT</div>
                  <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                    Keep browsing
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/city/${listing.city.slug}`}
                      prefetch
                      className="inline-flex items-center justify-center px-4 py-2 text-sm border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)] transition"
                    >
                      {listing.city.name} overview
                    </Link>

                    <Link
                      href={`/city/${listing.city.slug}/luxury-real-estate`}
                      prefetch
                      className="inline-flex items-center justify-center px-4 py-2 text-sm border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)] transition"
                    >
                      Luxury in {listing.city.name}
                    </Link>

                    <Link
                      href="/listings"
                      prefetch
                      className="inline-flex items-center justify-center px-4 py-2 text-sm border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)] transition"
                    >
                      All listings
                    </Link>
                  </div>

                  <div className="mt-6 text-xs text-[color:var(--ink-3)]">
                    Robots: {indexable ? 'index, follow' : 'noindex, follow'}
                  </div>
                </div>
              </div>

              {/* Right rail */}
              <aside className="col-span-12 lg:col-span-4">
                <div className="sticky top-6 space-y-4">
                  <div className="border border-[color:var(--hairline)] bg-white p-6">
                    <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                      AT A GLANCE
                    </div>

                    <div className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-[color:var(--ink)]">
                      {priceLabel ?? 'Price on request'}
                    </div>

                    {range ? (
                      <div className="mt-2 text-sm text-[color:var(--ink-2)]">
                        Indicative: {currency}{' '}
                        {new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(range.lo)} -{' '}
                        {new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(range.hi)}
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-[color:var(--ink-2)]">Range pending.</div>
                    )}

                    <div className="mt-5">
                      <Hairline />
                    </div>

                    <div className="mt-5 space-y-3">
                      <InfoRow k="Reference" v={ref} />
                      <InfoRow k="City" v={listing.city.name} />
                      <InfoRow k="Country" v={listing.city.country} />
                      <InfoRow k="Verification" v={verified} />
                    </div>

                    <div className="mt-6 grid gap-2">
                      <ButtonPrimary href="/coming-soon?flow=inquiry">Request viewing</ButtonPrimary>
                      <ButtonSecondary href="/coming-soon?flow=report">Request private report</ButtonSecondary>
                    </div>

                    <div className="mt-5 text-xs text-[color:var(--ink-3)]">
                      Private flows are coming next. The catalogue stays minimal.
                    </div>
                  </div>

                  <div className="border border-[color:var(--hairline)] bg-[rgba(0,0,0,0.02)] p-6">
                    <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                      TIP
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                      Use <span className="font-mono text-[color:var(--ink)]">/</span> to open Search Atelier from
                      anywhere.
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string | null }) {
  return (
    <div className="border border-[color:var(--hairline)] bg-[rgba(0,0,0,0.02)] p-4">
      <div className="text-[11px] font-semibold tracking-[0.24em] text-[color:var(--ink-3)]">{k}</div>
      <div className="mt-2 text-[15px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
        {v ?? '—'}
      </div>
    </div>
  );
}
