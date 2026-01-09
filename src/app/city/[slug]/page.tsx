// src/app/city/[slug]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';

import SafeImage from '@/components/home/SafeImage';
import CityLocalTime from '@/components/home/CityLocalTime';
import { CITIES } from '@/components/home/cities';

export default function CityPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const idx = CITIES.findIndex((c) => c.slug === slug);
  if (idx === -1) notFound();

  const city = CITIES[idx];
  const prev = CITIES[(idx - 1 + CITIES.length) % CITIES.length];
  const next = CITIES[(idx + 1) % CITIES.length];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute -bottom-48 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-white/5 blur-[130px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
            prefetch
          >
            ← Back
          </Link>

          <div className="flex items-center gap-2">
            <CityLocalTime tz={city.tz} />
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              {city.tz}
            </span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
          <div className="relative h-[260px] sm:h-[360px]">
            {city.image?.src ? (
              <SafeImage
                src={city.image.src}
                alt={city.image.alt ?? `${city.name} header`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover opacity-85"
                fallback={
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
                }
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            <div className="absolute inset-0 p-6 sm:p-10">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-300/80">City</div>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
                {city.name}
              </h1>
              <div className="mt-3 text-sm text-zinc-200">
                {city.country}
                {city.region ? ` · ${city.region}` : ''}
              </div>

              {city.blurb ? (
                <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-zinc-200">
                  {city.blurb}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-zinc-400">Truth baseline</div>
            <div className="mt-2 text-sm text-zinc-200">Placeholder facts</div>
            <div className="mt-1 text-xs text-zinc-500">We’ll attach real datasets next</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-zinc-400">Listings</div>
            <div className="mt-2 text-sm text-zinc-200">Coming soon</div>
            <div className="mt-1 text-xs text-zinc-500">Multi-source ingestion layer</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-zinc-400">Signals</div>
            <div className="mt-2 text-sm text-zinc-200">Coming soon</div>
            <div className="mt-1 text-xs text-zinc-500">Liquidity, fair value, confidence</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs text-zinc-400">Agent sites</div>
            <div className="mt-2 text-sm text-zinc-200">Coming soon</div>
            <div className="mt-1 text-xs text-zinc-500">Self-serve premium microsites</div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/city/${prev.slug}`}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
            prefetch
          >
            ← {prev.name}
          </Link>

          <Link
            href={`/city/${next.slug}`}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
            prefetch
          >
            {next.name} →
          </Link>
        </div>
      </div>
    </div>
  );
}
