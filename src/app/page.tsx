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
  // Keep your SEO intent system, but hard-tilt copy toward Marketplace positioning.
  const doc = SEO_INTENT.home();

  const title = 'Vantera · World’s Largest Luxury Marketplace';
  const description =
    'World’s Largest Luxury Marketplace for €2M+ properties. Curated globally, presented with editorial-grade precision.';

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

function toRuntimeCity(row: any): RuntimeCity {
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
    image: row.heroImageSrc
      ? {
          src: row.heroImageSrc,
          alt: row.heroImageAlt,
        }
      : null,
    heroImageSrc: row.heroImageSrc,
    heroImageAlt: row.heroImageAlt,
  };
}

export default async function Page() {
  const isProd = process.env.NODE_ENV === 'production';
  const comingSoon = isProd && process.env.NEXT_PUBLIC_COMING_SOON === '1';

  const canonical = SEO_INTENT.home().canonical;

  const pageJsonLd = webPageJsonLd({
    url: canonical,
    name: 'Vantera · World’s Largest Luxury Marketplace',
    description:
      'World’s Largest Luxury Marketplace for €2M+ properties. Curated globally, presented with editorial-grade precision.',
    about: [
      { '@type': 'Thing', name: 'Luxury real estate marketplace' },
      { '@type': 'Thing', name: '€2M+ properties' },
      { '@type': 'Thing', name: 'Ultra-prime homes' },
      { '@type': 'Thing', name: 'Global luxury property listings' },
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
