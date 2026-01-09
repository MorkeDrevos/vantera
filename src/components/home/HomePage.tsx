// src/components/home/HomePage.tsx

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';

import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import { CITIES } from './cities';

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute -bottom-48 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-white/5 blur-[130px]" />
      </div>

      <div className="relative">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-zinc-100">Locus</div>
              <div className="text-xs text-zinc-400">City discovery</div>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Real images
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Live local time
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">{children}</main>

        <footer className="mx-auto w-full max-w-6xl px-5 pb-10 pt-6 text-xs text-zinc-500 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Locus</div>
            <div className="text-zinc-600">A premium baseline for real data later</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
      <span className="h-px w-6 bg-white/10" />
      <span>{children}</span>
    </div>
  );
}

function HeroImage({ src, alt }: { src?: string; alt: string }) {
  const [ok, setOk] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="relative h-[220px] sm:h-[260px]">
        {ok && src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 700px"
            className="object-cover opacity-90"
            onError={() => setOk(false)}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_20%_20%,rgba(255,255,255,0.10),transparent_55%),radial-gradient(900px_450px_at_80%_10%,rgba(16,185,129,0.10),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(0,0,0,0.0))]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs text-zinc-200 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
          <span>Now shipping real imagery + clocks</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-sm font-medium text-zinc-100">Discover cities</div>
          <div className="mt-0.5 text-xs text-zinc-300">Search, open, and explore without noise.</div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const regionCount = useMemo(() => new Set(CITIES.map((c) => c.region).filter(Boolean)).size, []);
  const timezoneCount = useMemo(() => new Set(CITIES.map((c) => c.tz)).size, []);

  const featured = useMemo(
    () => [
      { title: 'European capitals', slugs: ['madrid', 'lisbon', 'paris', 'london'] },
      { title: 'Coastal cities', slugs: ['barcelona', 'lisbon', 'dubai'] },
      { title: '24/7 cities', slugs: ['new-york', 'london', 'dubai'] },
      { title: 'High-growth hubs', slugs: ['dubai', 'london', 'barcelona'] },
    ],
    [],
  );

  const heroSrc =
    CITIES.find((c) => c.slug === 'madrid')?.image?.src ||
    CITIES.find((c) => c.image?.src)?.image?.src;

  return (
    <Shell>
      {/* HERO */}
      <section className="pt-6 sm:pt-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            {/* Strong hero image */}
            <HeroImage src={heroSrc} alt="Locus hero image" />

            <h1 className="mt-8 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
              Find the city you want
              <span className="text-zinc-300"> in seconds</span>
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
              Search a city, open the page, and expand from there. A production-grade UI baseline with real imagery and live
              clocks.
            </p>

            <div className="mt-7 max-w-xl">
              <CitySearch />
            </div>

            {/* REAL STATS */}
            <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs text-zinc-400">Cities</div>
                <div className="mt-1 text-lg font-semibold text-zinc-100">{CITIES.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs text-zinc-400">Regions</div>
                <div className="mt-1 text-lg font-semibold text-zinc-100">{regionCount}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs text-zinc-400">Timezones</div>
                <div className="mt-1 text-lg font-semibold text-zinc-100">{timezoneCount}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs text-zinc-400">Status</div>
                <div className="mt-1 text-lg font-semibold text-emerald-300">Live</div>
              </div>
            </div>
          </div>

          {/* POPULAR = REAL CARDS (images + time) */}
          <div className="lg:col-span-5">
            <SectionLabel>Popular</SectionLabel>
            <CityCardsClient cities={CITIES.slice(0, 4)} />
          </div>
        </div>
      </section>

      {/* EXPLORE */}
      <section className="mt-16">
        <SectionLabel>Explore</SectionLabel>
        <CityCardsClient cities={CITIES} />
      </section>

      {/* FEATURED ROUTES */}
      <section className="mt-16">
        <SectionLabel>Featured routes</SectionLabel>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((row) => (
            <div key={row.title} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <div className="text-sm font-semibold text-zinc-100">{row.title}</div>

              <div className="mt-3 flex flex-wrap gap-2">
                {row.slugs.map((slug) => {
                  const city = CITIES.find((c) => c.slug === slug);
                  const label = city ? city.name : slug;

                  return (
                    <Link
                      key={slug}
                      href={`/city/${slug}`}
                      prefetch
                      className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
