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

  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: doc.canonical },
    robots: doc.robots,
    openGraph: {
      type: 'website',
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

  const doc = SEO_INTENT.home();

  const pageJsonLd = webPageJsonLd({
    url: doc.canonical,
    name: 'Vantera',
    description: doc.description,
    about: [
      { '@type': 'Thing', name: 'Luxury real estate' },
      { '@type': 'Thing', name: 'Property intelligence' },
      { '@type': 'Thing', name: 'Market pricing signals' },
      { '@type': 'Thing', name: 'Private asset analysis' },
    ],
  });

  if (comingSoon) return <ComingSoon />;

  // Build/preview safety: don’t crash if env isn’t set
  if (!process.env.DATABASE_URL) {
    return (
      <>
        {jsonLd(pageJsonLd)}
        <HomePage cities={[]} />
      </>
    );
  }

  const rows = await prisma.city.findMany({
    orderBy: [{ priority: 'desc' }, { name: 'asc' }],
  });

  const cities = rows.map(toRuntimeCity);

  return (
    <>
      {jsonLd(pageJsonLd)}
      <HomePage cities={cities} />
    </>
  );
}
