// src/components/home/HomePage.tsx
import type { ReactNode } from 'react';

import SafeImage from './SafeImage';
import CitySearch from './CitySearch';
import PopularGridClient from './PopularGridClient';
import CityCardsClient from './CityCardsClient';
import FeaturedRoutesClient from './FeaturedRoutesClient';
import { CITIES } from './cities';

function uniqCount(values: Array<string | undefined | null>) {
  return new Set(values.filter(Boolean) as string[]).size;
}

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
            <div className="text-zinc-600">Truth-first city discovery baseline</div>
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

export default function HomePage() {
  const regions = uniqCount(CITIES.map((c) => c.region));
  const timezones = uniqCount(CITIES.map((c) => c.tz));

  const hero = CITIES.find((c) => c.slug === 'madrid') ?? CITIES[0];
  const popular = CITIES.slice(0, 6);

  return (
    <Shell>
      <section className="pt-6 sm:pt-10">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
          <div className="relative h-[280px] sm:h-[340px]">
            {hero?.image?.src ? (
              <SafeImage
                src={hero.image.src}
                alt={hero.image.alt ?? `${hero.name} hero`}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover opacity-80"
                priority
                fallback={
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
                }
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute inset-0 p-6 sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-zinc-200 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                <span>Real images + live city time</span>
              </div>

              <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                Find the city you want
                <span className="text-zinc-300"> in seconds</span>
              </h1>

              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-200 sm:text-lg">
                Search like a human. Open a city page. Expand from there. We’ll layer truth-first property data next.
              </p>

              <div className="mt-7 max-w-xl">
                <CitySearch />
              </div>

              <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur">
                  <div className="text-xs text-zinc-300/80">Cities</div>
                  <div className="mt-1 text-lg font-semibold text-zinc-50">{CITIES.length}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur">
                  <div className="text-xs text-zinc-300/80">Regions</div>
                  <div className="mt-1 text-lg font-semibold text-zinc-50">{regions}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur">
                  <div className="text-xs text-zinc-300/80">Timezones</div>
                  <div className="mt-1 text-lg font-semibold text-zinc-50">{timezones}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur">
                  <div className="text-xs text-zinc-300/80">Status</div>
                  <div className="mt-1 text-lg font-semibold text-emerald-300">Live</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <SectionLabel>Popular</SectionLabel>
        <PopularGridClient cities={popular} />
      </section>

      <section className="mt-12">
        <SectionLabel>Featured routes</SectionLabel>
        <FeaturedRoutesClient cities={CITIES} />
      </section>

      <section className="mt-12">
        <SectionLabel>Explore</SectionLabel>
        <CityCardsClient cities={CITIES} />
      </section>
    </Shell>
  );
}
