// src/app/page.tsx
import type { Metadata } from 'next';
import { PrismaClient } from '@prisma/client';

import HomePage, { type RuntimeCity } from '@/components/home/HomePage';
import ComingSoon from '@/components/ComingSoon';

import { SEO_INTENT } from '@/lib/seo/seo.intent';
import { jsonLd, webPageJsonLd } from '@/lib/seo/seo.jsonld';

// ---- Prisma (safe singleton for Next dev/hot reload) ----
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const metadata: Metadata = (() => {
  const doc = SEO_INTENT.home();

  return {
    title: doc.title,
    description: doc.description,
    alternates: {
      canonical: doc.canonical,
    },
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
  // We intentionally treat DB rows as `any` here so this file won’t break
  // if schema field names evolve (you can tighten typing later).
  const imageSrc =
    (row?.imageSrc as string | undefined) ??
    (row?.image_url as string | undefined) ??
    (row?.image as string | undefined) ??
    (row?.heroImageSrc as string | undefined) ??
    null;

  const imageAlt =
    (row?.imageAlt as string | undefined) ??
    (row?.image_alt as string | undefined) ??
    (row?.heroImageAlt as string | undefined) ??
    null;

  return {
    slug: String(row.slug),
    name: String(row.name),
    country: String(row.country ?? ''),
    region: (row.region ?? null) as string | null,
    tz: String(row.tz ?? 'UTC'),

    tier: (row.tier ?? undefined) as any,
    status: (row.status ?? undefined) as any,
    priority: typeof row.priority === 'number' ? row.priority : undefined,

    blurb: (row.blurb ?? null) as string | null,

    image: imageSrc
      ? {
          src: imageSrc,
          alt: imageAlt,
        }
      : null,

    heroImageSrc: (row.heroImageSrc ?? null) as string | null,
    heroImageAlt: (row.heroImageAlt ?? null) as string | null,
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

  // DB -> RuntimeCity[]
  const rows = (await prisma.city.findMany({
    orderBy: [{ priority: 'desc' }, { name: 'asc' }],
  })) as any[];

  const cities: RuntimeCity[] = rows.map(toRuntimeCity);

  return (
    <>
      {jsonLd(pageJsonLd)}
      <HomePage cities={cities} />
    </>
  );
}
