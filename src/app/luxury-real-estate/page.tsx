// src/app/luxury-real-estate/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

import { CITIES } from '@/components/home/cities';

import { SEO_INTENT } from '@/lib/seo/seo.intent';
import { jsonLd, webPageJsonLd } from '@/lib/seo/seo.jsonld';
import { breadcrumbJsonLd } from '@/lib/seo/seo.breadcrumbs';

export const dynamic = 'force-static';

export const metadata: Metadata = (() => {
  const doc = SEO_INTENT.luxuryGlobal();

  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: doc.canonical },
    robots: doc.robots,

    openGraph: {
      type: 'article',
      title: doc.title,
      description: doc.description,
      url: doc.canonical,
      images: [doc.ogImage],
      siteName: 'Vantera',
    },

    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: [doc.ogImage],
    },
  };
})();

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const WIDE = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';
const NARROW = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

function Hairline() {
  return <div className="h-px w-full bg-[color:var(--hairline)]" />;
}

function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.26em] uppercase text-[color:var(--ink-3)]">
        <Link href="/" className="hover:text-[color:var(--ink-2)]">
          Home
        </Link>
        <span className="opacity-60">/</span>
        <Link href="/marketplace" className="hover:text-[color:var(--ink-2)]">
          Marketplace
        </Link>
        <span className="opacity-60">/</span>
        <span className="text-[color:var(--ink-2)]">Luxury real estate</span>
      </div>
    </nav>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center px-3 py-2 text-[11px] font-semibold tracking-[0.22em]',
        'border border-[color:var(--hairline)] bg-white',
        'text-[color:var(--ink-2)]',
      )}
    >
      {children}
    </span>
  );
}

function Card({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <section className="border border-[color:var(--hairline)] bg-white p-6 sm:p-7">
      <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">{eyebrow}</div>
      <h2 className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">{body}</p>
    </section>
  );
}

export default function LuxuryRealEstatePage() {
  const doc = SEO_INTENT.luxuryGlobal();

  const intentAbout =
    doc.jsonld?.about?.map((a) => ({
      '@type': a.type,
      name: a.name,
      ...(a.extra ?? {}),
    })) ?? [];

  const pageJsonLd = webPageJsonLd({
    url: doc.canonical,
    name: doc.jsonld?.name ?? doc.title,
    description: doc.description,
    about: [
      { '@type': 'Thing', name: 'Private intelligence for the world’s most valuable assets' },
      { '@type': 'Thing', name: 'Luxury real estate for sale' },
      { '@type': 'Thing', name: 'Prime real estate' },
      { '@type': 'Thing', name: 'Property value signals' },
      { '@type': 'Thing', name: 'Market liquidity' },
      { '@type': 'Thing', name: 'Pricing reality' },
      ...intentAbout,
    ],
  });

  // Breadcrumb JSON-LD (SEO-grade)
  const crumbsJsonLd = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Luxury real estate', path: '/luxury-real-estate' },
  ]);

  const exampleCities = CITIES.slice(0, 12);

  return (
    <main className="min-h-[100dvh] bg-white text-[color:var(--ink)]">
      {/* Quiet paper texture + micro grid (matches home tokens) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.24)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 opacity-[0.030] [background-image:linear-gradient(to_right,rgba(10,10,12,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,12,0.18)_1px,transparent_1px)] [background-size:140px_140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(0,0,0,0.04),transparent_62%)]" />
      </div>

      {/* JSON-LD */}
      {jsonLd(pageJsonLd)}
      {jsonLd(crumbsJsonLd)}

      {/* Top hairline */}
      <div className="w-full">
        <div className="h-px w-full bg-[color:var(--hairline)]" />
      </div>

      <section className="py-10 sm:py-14">
        <div className={WIDE}>
          <Breadcrumbs />

          <div className="mt-6 border border-[color:var(--hairline)] bg-white/84 backdrop-blur-[14px] shadow-[0_40px_140px_rgba(10,10,12,0.08)]">
            <div className="px-5 py-6 sm:px-7 sm:py-7">
              <div className="flex flex-wrap items-center gap-2">
                <Chip>Private intelligence</Chip>
                <Chip>Truth Layer</Chip>
                <Chip>Signal over noise</Chip>
              </div>

              <h1 className="mt-7 text-balance text-[34px] font-semibold tracking-[-0.05em] text-[color:var(--ink)] sm:text-[46px] lg:text-[56px] lg:leading-[1.02]">
                Luxury real estate for sale, with pricing reality and market context
              </h1>

              <p className="mt-4 max-w-[78ch] text-pretty text-[15px] leading-relaxed text-[color:var(--ink-2)] sm:text-lg">
                Not just listings. Vantera adds a Truth Layer that verifies what’s known, surfaces what’s missing, and helps you
                move with clarity - not noise.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/marketplace"
                  className={cx(
                    'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
                    'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                  )}
                >
                  Browse marketplace
                </Link>

                <Link
                  href="/search"
                  className={cx(
                    'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
                    'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
                  )}
                >
                  Open search
                </Link>

                <Link
                  href="/sell-luxury-property"
                  className={cx(
                    'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition',
                    'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
                  )}
                >
                  Sell privately
                </Link>
              </div>
            </div>

            <div className="px-5 pb-6 sm:px-7 sm:pb-7">
              <Hairline />
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card
                  eyebrow="TRUTH LAYER"
                  title="Verified versus assumed"
                  body="Clear attribution of what is verified, inferred, or unknown - with structured checks to remove ambiguity."
                />
                <Card
                  eyebrow="MARKET INTELLIGENCE"
                  title="Markets, not listings"
                  body="Signals that explain pricing dynamics, liquidity and risk at a city level - built city by city."
                />
                <Card
                  eyebrow="SIGNAL OVER NOISE"
                  title="Designed to reduce noise"
                  body="Editorial control replaces volume. Fewer listings, higher signal density, and calmer decision-making."
                />
                <Card
                  eyebrow="PRIVATE NETWORK"
                  title="Private by architecture"
                  body="Controlled access, verified submissions, and discretion as a system default for serious buyers and advisors."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14 sm:pb-18">
        <div className={NARROW}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">CITY CLUSTERS</div>
              <div className="mt-2 text-balance text-[24px] font-semibold tracking-[-0.03em] text-[color:var(--ink)] sm:text-[30px]">
                Explore luxury by city
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                City pages are where Vantera wins long-tail searches and delivers the intelligence layer that portals don’t have.
              </p>
            </div>

            <Link
              href="/"
              className={cx(
                'mt-2 w-fit sm:mt-0',
                'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition',
                'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
              )}
            >
              Browse all cities
            </Link>
          </div>

          <div className="mt-7">
            <Hairline />
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {exampleCities.map((c) => (
              <Link
                key={c.slug}
                href={`/city/${c.slug}/luxury-real-estate`}
                className={cx(
                  'group flex items-center justify-between gap-4 px-4 py-4',
                  'border border-[color:var(--hairline)] bg-white',
                  'transition hover:border-[rgba(10,10,12,0.22)]',
                )}
              >
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold tracking-[-0.01em] text-[color:var(--ink)]">
                    {c.name}
                  </div>
                  <div className="mt-1 truncate text-[12px] text-[color:var(--ink-2)]">
                    {[c.region, c.country].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <div className="h-px w-10 bg-[color:var(--hairline)] transition-all duration-300 group-hover:w-14 group-hover:bg-[rgba(10,10,12,0.30)]" />
              </Link>
            ))}
          </div>

          <div className="mt-8 text-[12px] text-[color:var(--ink-3)]">
            Popular searches: luxury real estate for sale, luxury homes for sale, prime real estate, high-end property, exclusive
            homes, off-market luxury.
          </div>

          <div className="mt-8 border border-[color:var(--hairline)] bg-white p-5">
            <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">CANONICAL</div>
            <div className="mt-2 text-sm text-[color:var(--ink-2)]">{doc.canonical}</div>
          </div>
        </div>
      </section>

      {/* Bottom hairline */}
      <div className="w-full">
        <div className="h-px w-full bg-[color:var(--hairline)]" />
      </div>
    </main>
  );
}
