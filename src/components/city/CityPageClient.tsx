// src/components/city/CityPageClient.tsx
'use client';

import Link from 'next/link';
import SafeImage from '@/components/home/SafeImage';

type CityImage = {
  src: string;
  alt: string | null;
};

export type CityPageCity = {
  name: string;
  slug: string;
  country: string;
  region: string | null;
  tz: string;
  blurb: string | null;
  image: CityImage | null;
};

export type CityNavItem = {
  name: string;
  slug: string;
};

function safeAlt(city: CityPageCity) {
  const a = city.image?.alt?.trim();
  return a ? a : `${city.name} city view`;
}

export default function CityPageClient({
  city,
  prev,
  next,
}: {
  city: CityPageCity;
  prev: CityNavItem;
  next: CityNavItem;
}) {
  const src = city.image?.src?.trim() ?? '';

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:border-white/20"
          >
            ← Back
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/city/${prev.slug}`}
              prefetch
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:border-white/20"
              aria-label={`Previous city: ${prev.name}`}
              title={`Previous: ${prev.name}`}
            >
              ← Prev
            </Link>
            <Link
              href={`/city/${next.slug}`}
              prefetch
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:border-white/20"
              aria-label={`Next city: ${next.name}`}
              title={`Next: ${next.name}`}
            >
              Next →
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className="relative h-[260px] w-full sm:h-[360px]">
            {src ? (
              <SafeImage
                src={src}
                alt={safeAlt(city)}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover opacity-95"
                priority={false}
                fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                {city.name}
              </h1>

              <div className="text-sm text-zinc-300">
                <span className="text-zinc-200">{city.country}</span>
                {city.region ? <span className="text-zinc-400">{` · ${city.region}`}</span> : null}
                <span className="text-zinc-500">{` · ${city.tz}`}</span>
              </div>

              {city.blurb ? (
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-200">
                  {city.blurb}
                </p>
              ) : null}
            </div>

            <div className="mt-6 h-px w-full bg-white/10" />

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/listings?city=${city.slug}`}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:border-white/20"
              >
                Browse listings
              </Link>

              {/* ✅ Ranking fuel: internal link to the city luxury page */}
              <Link
                href={`/city/${city.slug}/luxury-real-estate`}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:border-white/20"
              >
                Luxury in {city.name}
              </Link>

              <Link
                href={`/city/${city.slug}`}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-zinc-300 hover:border-white/20"
              >
                {`/city/${city.slug}`}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
