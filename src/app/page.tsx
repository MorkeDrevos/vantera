// src/app/page.tsx
import type { Metadata } from 'next';

import HomePage, { type RuntimeCity } from '@/components/home/HomePage';
import ComingSoon from '@/components/ComingSoon';

import { SEO_INTENT } from '@/lib/seo/seo.intent';
import { jsonLd, webPageJsonLd } from '@/lib/seo/seo.jsonld';
import { prisma } from '@/lib/prisma';

// Make sure Prisma runs in Node (not Edge) and avoid build-time SSG attempts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = (() => {
  const doc = SEO_INTENT.home();

  const title = 'Vantera · A Global Catalogue of Exceptional Homes';
  const description =
    'Private intelligence for the world’s most valuable assets. Truth-first real estate intelligence, curated globally, presented with editorial-grade precision.';

  return {
    title,
    description,
    alternates: { canonical: doc.canonical },
    robots: doc.robots,
    openGraph: {
      type: 'website',
      title,
      description,
      url: doc.canonical,
      siteName: 'Vantera',
      images: [doc.ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [doc.ogImage],
    },
  };
})();

/**
 * Normalise public image paths for /public
 * Allows DB values like:
 * - "images/heroes/monaco.jpg"
 * - "/images/heroes/monaco.jpg"
 * - "https://..."
 */
function normalizePublicImagePath(v: unknown): string | null {
  const s = typeof v === 'string' ? v.trim() : '';
  if (!s) return null;

  // Absolute URLs remain untouched
  if (/^https?:\/\//i.test(s)) return s;

  // Ensure leading slash for public assets
  if (s.startsWith('/')) return s;
  return `/${s}`;
}

function toRuntimeCity(row: any): RuntimeCity {
  // Card image: prefer dedicated fields if you later add them
  const cardSrc = normalizePublicImagePath(row?.cardImageSrc ?? row?.imageSrc ?? row?.heroImageSrc);
  const heroSrc = normalizePublicImagePath(row?.heroImageSrc);

  const cardAlt = typeof row?.cardImageAlt === 'string' ? row.cardImageAlt : row?.heroImageAlt;
  const heroAlt = typeof row?.heroImageAlt === 'string' ? row.heroImageAlt : cardAlt;

  return {
    slug: row.slug,
    name: row.name,
    country: row.country,
    region: row.region,
    tz: row.tz,
    tier: row.tier,
    status: row.status,
    priority: row.priority ?? 0,
    blurb: row.blurb,

    // CityCard image
    image: cardSrc
      ? {
          src: cardSrc,
          alt: cardAlt ?? null,
        }
      : null,

    // Hero image
    heroImageSrc: heroSrc,
    heroImageAlt: heroAlt ?? null,
  };
}

export default async function Page() {
  const isProd = process.env.NODE_ENV === 'production';
  const comingSoon = isProd && process.env.NEXT_PUBLIC_COMING_SOON === '1';

  const canonical = SEO_INTENT.home().canonical;

  const pageJsonLd = webPageJsonLd({
    url: canonical,
    name: 'Vantera · A Global Catalogue of Exceptional Homes',
    description:
      'A global catalogue of exceptional homes, powered by intelligence. Built city by city with a Truth Layer that verifies, scores and explains the market.',
    about: [
      { '@type': 'Thing', name: 'Luxury real estate marketplace' },
      { '@type': 'Thing', name: 'Curated global listings' },
      { '@type': 'Thing', name: 'Real estate intelligence' },
      { '@type': 'Thing', name: 'Truth Layer verification' },
    ],
  });

  if (comingSoon) return <ComingSoon />;

  // HomePage expects clusters too (keep it simple while wiring data)
  const clusters: any[] = [];
  const emptyCities: RuntimeCity[] = [];

  // Build/preview safety: don’t crash if env isn’t set
  if (!process.env.DATABASE_URL) {
    return (
      <>
        {jsonLd(pageJsonLd)}
        <HomePage cities={emptyCities} clusters={clusters} />
      </>
    );
  }

  const rows = await prisma.city.findMany({
    orderBy: [{ priority: 'desc' }, { name: 'asc' }],
  });

  const cities: RuntimeCity[] = rows.map(toRuntimeCity);

  return (
    <>
      {jsonLd(pageJsonLd)}
      <HomePage cities={cities} clusters={clusters} />
    </>
  );
}
