// src/components/home/HomePage.tsx
import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import { CITIES } from './cities';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="w-full">{children}</main>

      <footer className="mx-auto w-full max-w-7xl px-5 pb-10 pt-14 text-xs text-zinc-500 sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Vantera</div>
          <div className="text-zinc-600">Global property intelligence protocol</div>
        </div>
      </footer>
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
      {/* ========================= */}
      {/* FULL SCREEN HERO */}
      {/* ========================= */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_15%_10%,rgba(255,255,255,0.08),transparent_60%),radial-gradient(900px_520px_at_85%_25%,rgba(251,191,36,0.12),transparent_55%),radial-gradient(900px_520px_at_50%_95%,rgba(59,130,246,0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/45" />
        </div>

        {/* Content */}
        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 sm:px-8">
          <div className="grid w-full gap-14 lg:grid-cols-12">
            {/* LEFT */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                Protocol-grade discovery
              </div>

              <h1 className="mt-8 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                Global property intelligence
                <span className="text-zinc-300"> without noise</span>
              </h1>

              <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
                Search a city, access verified listings, and read the market truth.
                Built for buyers, sellers, and private owners worldwide.
              </p>

              <div className="mt-8 max-w-2xl">
                <CitySearch />
              </div>

              {/* Stats */}
              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Cities" value={CITIES.length} />
                <Stat label="Regions" value={regionCount} />
                <Stat label="Timezones" value={timezoneCount} />
                <Stat label="Status" value="Live" accent />
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-5 lg:flex lg:items-center">
              <div className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_70%_0%,rgba(251,191,36,0.12),transparent_60%)]" />

                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <SectionLabel>Popular</SectionLabel>
                    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-zinc-300">
                      Live
                    </span>
                  </div>

                  <CityCardsClient
                    cities={CITIES.slice(0, 4)}
                    columns="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* ========================= */}
      {/* BODY */}
      {/* ========================= */}
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-16 sm:px-8">
        <section>
          <SectionLabel>Explore</SectionLabel>
          <CityCardsClient cities={CITIES} />
        </section>
      </div>
    </Shell>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="text-xs text-zinc-400">{label}</div>
      <div
        className={`mt-1 text-lg font-semibold ${
          accent ? 'text-emerald-300' : 'text-zinc-100'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
