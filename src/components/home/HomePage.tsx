// src/components/home/HomePage.tsx

import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import { CITIES } from './cities';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* premium ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-56 left-1/2 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-white/10 blur-[140px]" />
        <div className="absolute -bottom-56 left-1/2 h-[640px] w-[1020px] -translate-x-1/2 rounded-full bg-white/5 blur-[160px]" />
        <div className="absolute left-0 top-0 h-[520px] w-[520px] rounded-full bg-[rgba(168,85,247,0.14)] blur-[160px]" />
        <div className="absolute right-0 top-12 h-[520px] w-[520px] rounded-full bg-[rgba(245,158,11,0.12)] blur-[170px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
      </div>

      <div className="relative">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-7 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,158,11,0.22),transparent_45%,rgba(168,85,247,0.22))]" />
              <div className="absolute inset-0 bg-[radial-gradient(18px_18px_at_30%_25%,rgba(255,255,255,0.25),transparent_70%)]" />
            </div>
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
      <span className="h-px w-6 bg-white/10" />
      <span>{children}</span>
    </div>
  );
}

function findCities(slugs: string[]) {
  const map = new Map(CITIES.map((c) => [c.slug, c]));
  return slugs.map((s) => map.get(s)).filter(Boolean) as typeof CITIES;
}

export default function HomePage() {
  const regionCount = new Set(CITIES.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(CITIES.map((c) => c.tz)).size;

  const heroCity = CITIES.find((c) => c.image?.src) ?? CITIES[0];
  const heroSrc = heroCity?.image?.src?.trim() ?? '';

  const featured = [
    { title: 'European capitals', slugs: ['madrid', 'barcelona', 'paris', 'london'] },
    { title: 'Coastal cities', slugs: ['barcelona', 'lisbon', 'dubai'] },
    { title: '24/7 cities', slugs: ['new-york', 'london', 'dubai'] },
    { title: 'High-growth hubs', slugs: ['dubai', 'new-york', 'barcelona'] },
  ] as const;

  return (
    <Shell>
      {/* HERO */}
      <section className="pt-6 sm:pt-12">
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          {/* hero image (no broken icon risk because it's a background-image) */}
          <div className="relative">
            <div
              className="h-[290px] w-full sm:h-[320px] lg:h-[360px]"
              style={
                heroSrc
                  ? {
                      backgroundImage: `url(${heroSrc})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_30%_20%,rgba(255,255,255,0.22),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(245,158,11,0.14),transparent_45%,rgba(168,85,247,0.14))]" />
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-zinc-200 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                  <span>Real images + live city time</span>
                </div>

                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                  Find the city you want
                  <span className="text-zinc-300"> in seconds</span>
                </h1>

                <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
                  Search a city, open the page, and expand from there. A production-grade UI baseline with real imagery and live clocks.
                </p>

                <div className="mt-7 max-w-xl">
                  <CitySearch />
                </div>

                {/* REAL STATS */}
                <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-zinc-400">Cities</div>
                    <div className="mt-1 text-lg font-semibold text-zinc-100">{CITIES.length}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-zinc-400">Regions</div>
                    <div className="mt-1 text-lg font-semibold text-zinc-100">{regionCount}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-zinc-400">Timezones</div>
                    <div className="mt-1 text-lg font-semibold text-zinc-100">{timezoneCount}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
                    <div className="text-xs text-zinc-400">Status</div>
                    <div className="mt-1 text-lg font-semibold text-emerald-300">Live</div>
                  </div>
                </div>
              </div>

              {/* POPULAR = REAL CARDS */}
              <div className="lg:col-span-5">
                <div className="flex items-center justify-between">
                  <SectionLabel>Popular</SectionLabel>
                  <div className="hidden text-xs text-zinc-400 sm:block">
                    {heroCity?.name ? `Hero: ${heroCity.name}` : null}
                  </div>
                </div>
                <CityCardsClient cities={CITIES.slice(0, 4)} />
              </div>
            </div>
          </div>

          {/* subtle inner edge */}
          <div className="pointer-events-none absolute inset-0 rounded-[34px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
        </div>
      </section>

      {/* FEATURED ROUTES */}
      <section className="mt-16">
        <SectionLabel>Featured routes</SectionLabel>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((row) => (
            <div
              key={row.title}
              className="group rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-white/20"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-zinc-100">{row.title}</div>
                <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[11px] text-zinc-300">
                  {row.slugs.length} picks
                </span>
              </div>

              <div className="mt-3 text-xs text-zinc-400">Curated collection</div>
              <div className="mt-3 h-px w-full bg-white/10" />
              <div className="mt-3 text-xs text-zinc-300">
                {row.slugs
                  .map((s) => CITIES.find((c) => c.slug === s)?.name)
                  .filter(Boolean)
                  .join(', ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPLORE */}
      <section className="mt-16">
        <SectionLabel>Explore</SectionLabel>
        <CityCardsClient cities={CITIES} />
      </section>

      {/* (optional) curated strips under explore for immediate “alive” feel */}
      <section className="mt-16">
        <SectionLabel>Collections</SectionLabel>

        <div className="grid gap-10">
          {featured.map((row) => {
            const cities = findCities(row.slugs);
            return (
              <div key={`strip-${row.title}`}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-100">{row.title}</div>
                  <div className="text-xs text-zinc-500">{cities.length} cities</div>
                </div>
                <CityCardsClient cities={cities} />
              </div>
            );
          })}
        </div>
      </section>
    </Shell>
  );
}
