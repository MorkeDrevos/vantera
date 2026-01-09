// src/app/city/[slug]/page.tsx
import { notFound } from 'next/navigation';

import CityPageClient from '@/components/city/CityPageClient';
import { CITIES } from '@/components/home/cities';

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

  return (
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
  );
}
