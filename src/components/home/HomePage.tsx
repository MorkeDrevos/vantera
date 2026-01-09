// src/components/home/HomePage.tsx
import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import { CITIES } from './cities';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="relative">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]" />
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
              Live city time
            </span>
          </div>
        </header>

        <main className="w-full">{children}</main>

        <footer className="mx-auto w-full max-w-7xl px-5 pb-10 pt-10 text-xs text-zinc-500 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Locus</div>
            <div className="text-zinc-600">Premium baseline for real data later</div>
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

export default function HomePage() {
  const regionCount = new Set(CITIES.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(CITIES.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* FULL-WIDTH HERO (edge-to-edge) */}
      <section className="relative w-full overflow-hidden">
        {/* background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_20%_10%,rgba(255,255,255,0.08),transparent_60%),radial-gradient(900px_520px_at_80%_25%,rgba(251,191,36,0.10),transparent_55%),radial-gradient(900px_520px_at_50%_95%,rgba(59,130,246,0.07),transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/40" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* content container */}
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-6 sm:px-8 sm:pb-20 sm:pt-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            {/* LEFT */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                <span>Protocol-grade discovery</span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-300">Real images</span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-300">Live city time</span>
              </div>

              <h1 className="mt-7 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                Find the city you want
                <span className="text-zinc-300"> in seconds</span>
              </h1>

              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
                Search a city, open the page, and expand from there. This is the premium surface layer that will plug into global listings next.
              </p>

              <div className="mt-7 max-w-2xl">
                <CitySearch />
              </div>

              {/* REAL STATS */}
              <div className="mt-6 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                  <div className="text-xs text-zinc-400">Cities</div>
                  <div className="mt-1 text-lg font-semibold text-zinc-100">{CITIES.length}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                  <div className="text-xs text-zinc-400">Regions</div>
                  <div className="mt-1 text-lg font-semibold text-zinc-100">{regionCount}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                  <div className="text-xs text-zinc-400">Timezones</div>
                  <div className="mt-1 text-lg font-semibold text-zinc-100">{timezoneCount}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                  <div className="text-xs text-zinc-400">Status</div>
                  <div className="mt-1 text-lg font-semibold text-emerald-300">Live</div>
                </div>
              </div>
            </div>

            {/* RIGHT (POPULAR) */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.45)] sm:p-6">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_70%_0%,rgba(251,191,36,0.10),transparent_60%)]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <SectionLabel>Popular</SectionLabel>
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-zinc-300">
                      Live cards
                    </span>
                  </div>

                  {/* Premium 2x2 grid on desktop, never squeezed */}
                  <CityCardsClient
                    cities={CITIES.slice(0, 4)}
                    columns="grid gap-4 grid-cols-1 sm:grid-cols-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        {/* EXPLORE */}
        <section className="mt-12 sm:mt-14">
          <SectionLabel>Explore</SectionLabel>
          <CityCardsClient cities={CITIES} />
        </section>

        {/* FEATURED ROUTES */}
        <section className="mt-16">
          <SectionLabel>Featured routes</SectionLabel>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              European capitals
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              Coastal cities
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              24/7 cities
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              High-growth hubs
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
