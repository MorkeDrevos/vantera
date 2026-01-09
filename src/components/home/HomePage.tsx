import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import { CITIES } from './cities';

function Shell({ children }: { children: React.ReactNode }) {
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

        <main className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
          {children}
        </main>

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

export default function HomePage() {
  const regionCount = new Set(CITIES.map(c => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(CITIES.map(c => c.tz)).size;

  return (
    <Shell>
      {/* HERO */}
      <section className="pt-6 sm:pt-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-300">
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

          {/* POPULAR = REAL CARDS */}
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
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            European capitals
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            Coastal cities
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            24/7 cities
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            High-growth hubs
          </div>
        </div>
      </section>
    </Shell>
  );
}
