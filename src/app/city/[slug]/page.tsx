// src/app/city/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import CityPageClient from '@/components/city/CityPageClient';
import { CITIES } from '@/components/home/cities';

import { SEO_INTENT } from '@/lib/seo/seo.intent';
import { webPageJsonLd, jsonLd, breadcrumbJsonLd } from '@/lib/seo/seo.jsonld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const idx = CITIES.findIndex((c) => c.slug === slug);
  if (idx === -1) {
    return { title: 'City Not Found · Vantera', robots: { index: false, follow: false } };
  }

  const city = CITIES[idx];

  const doc = SEO_INTENT.cityHub({
    name: city.name,
    slug: city.slug,
    country: city.country,
    region: city.region ?? null,
  });

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
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const idx = CITIES.findIndex((c) => c.slug === slug);
  if (idx === -1) return notFound();

  const city = CITIES[idx];
  const prev = CITIES[(idx - 1 + CITIES.length) % CITIES.length];
  const next = CITIES[(idx + 1) % CITIES.length];

  const doc = SEO_INTENT.cityHub({
    name: city.name,
    slug: city.slug,
    country: city.country,
    region: city.region ?? null,
  });

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
      { '@type': 'Thing', name: `${city.name} real estate` },
      { '@type': 'Thing', name: 'Property intelligence' },
      { '@type': 'Thing', name: 'Market liquidity' },
      ...intentAbout,
    ],
  });

  const crumbs = breadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: city.name, url: `/city/${city.slug}` },
  ]);

  return (
    <>
      {jsonLd(pageJsonLd)}
      {jsonLd(crumbs)}

      <CityPageClient
        city={{
          name: city.name,
          slug: city.slug,
          country: city.country,
          region: city.region ?? null,
          tz: city.tz,
          blurb: city.blurb ?? null,
          image: city.image?.src
            ? {
                src: city.image.src,
                alt: city.image.alt ?? null,
              }
            : null,
        }}
        prev={{
          name: prev.name,
          slug: prev.slug,
        }}
        next={{
          name: next.name,
          slug: next.slug,
        }}
      />
    </>
  );
}
