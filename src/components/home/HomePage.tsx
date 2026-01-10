// src/components/home/HomePage.tsx
import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import { CITIES } from './cities';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#06060a] text-zinc-100">
      {/* Ambient royal backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[540px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(232,190,92,0.18),transparent_62%)] blur-2xl" />
        <div className="absolute -top-10 right-[-160px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.20),transparent_62%)] blur-2xl" />
        <div className="absolute bottom-[-220px] left-[-220px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.12),transparent_60%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.65))]" />
        <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_0)] [background-size:22px_22px]" />
      </div>

      <div className="relative">
        <header className="mx-auto w-full max-w-7xl px-5 pt-6 sm:px-8 sm:pt-8">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_30%_0%,rgba(232,190,92,0.16),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(800px_260px_at_80%_10%,rgba(120,76,255,0.18),transparent_55%)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
            </div>

            <div className="relative flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
              <div className="flex items-center gap-4">
                <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                  <div className="absolute inset-0 bg-[radial-gradient(120px_120px_at_35%_25%,rgba(232,190,92,0.22),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(120px_120px_at_70%_70%,rgba(120,76,255,0.20),transparent_60%)]" />
                  <div className="relative h-6 w-6 rounded-lg bg-[linear-gradient(135deg,rgba(232,190,92,0.95),rgba(255,255,255,0.70),rgba(120,76,255,0.85))] opacity-90 shadow-[0_10px_25px_rgba(0,0,0,0.35)]" />
                </div>

                <div className="leading-tight">
                  <div className="flex items-center gap-2">
                    <div className="text-[13px] font-semibold tracking-[0.14em] text-zinc-100">
                      VANTERA
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-300">
                      City Index
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">
                    Premium discovery layer - built for real data later
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-zinc-300">
                  Real images
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-zinc-300">
                  Live city time
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-zinc-300">
                  Protocol-grade UI
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full">{children}</main>

        <footer className="mx-auto w-full max-w-7xl px-5 pb-10 pt-10 sm:px-8">
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.025] px-5 py-5 text-xs text-zinc-400 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:px-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(700px_260px_at_20%_0%,rgba(232,190,92,0.10),transparent_58%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(700px_260px_at_85%_10%,rgba(120,76,255,0.10),transparent_58%)]" />
            </div>

            <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} Vantera</div>
              <div className="text-zinc-500">Designed as a premium surface for the coming intelligence layer</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SectionLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400">
          {String(children).toUpperCase()}
        </div>
        <div className="mt-2 h-px w-28 bg-gradient-to-r from-[rgba(232,190,92,0.55)] via-white/15 to-transparent" />
      </div>
      {hint ? (
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-300">
          {hint}
        </div>
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: React.ReactNode;
  tone?: 'neutral' | 'gold' | 'violet' | 'aqua';
}) {
  const toneRing =
    tone === 'gold'
      ? 'ring-[rgba(232,190,92,0.20)]'
      : tone === 'violet'
        ? 'ring-[rgba(120,76,255,0.20)]'
        : tone === 'aqua'
          ? 'ring-[rgba(62,196,255,0.18)]'
          : 'ring-white/10';

  const toneGlow =
    tone === 'gold'
      ? 'bg-[radial-gradient(260px_120px_at_30%_0%,rgba(232,190,92,0.16),transparent_60%)]'
      : tone === 'violet'
        ? 'bg-[radial-gradient(260px_120px_at_30%_0%,rgba(120,76,255,0.16),transparent_60%)]'
        : tone === 'aqua'
          ? 'bg-[radial-gradient(260px_120px_at_30%_0%,rgba(62,196,255,0.14),transparent_60%)]'
          : 'bg-[radial-gradient(260px_120px_at_30%_0%,rgba(255,255,255,0.10),transparent_60%)]';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 shadow-[0_18px_55px_rgba(0,0,0,0.45)] ring-1">
      <div className={`pointer-events-none absolute inset-0 ${toneGlow}`} />
      <div className={`pointer-events-none absolute inset-0 ring-1 ${toneRing}`} />
      <div className="relative">
        <div className="text-[11px] tracking-[0.16em] text-zinc-400">{label}</div>
        <div className="mt-1 text-lg font-semibold text-zinc-100">{value}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const regionCount = new Set(CITIES.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(CITIES.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* ROYAL HERO */}
      <section className="relative mx-auto w-full max-w-7xl px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10">
        <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.03] shadow-[0_40px_120px_rgba(0,0,0,0.62)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_20%_0%,rgba(232,190,92,0.16),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_82%_10%,rgba(120,76,255,0.18),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_55%_110%,rgba(62,196,255,0.10),transparent_60%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/30" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          </div>

          <div className="relative grid gap-10 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-12 lg:items-start">
            {/* LEFT */}
            <div className="lg:col-span-7">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[11px] text-zinc-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[rgba(232,190,92,0.95)] shadow-[0_0_0_3px_rgba(232,190,92,0.10)]" />
                <span className="tracking-wide">Royal index layer</span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-300">Real images</span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-300">Live city time</span>
              </div>

              <h1 className="mt-7 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                Discover cities with
                <span className="bg-[linear-gradient(90deg,rgba(232,190,92,0.95),rgba(255,255,255,0.85),rgba(120,76,255,0.95))] bg-clip-text text-transparent">
                  {' '}
                  premium clarity
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
                Search a city, open the page, and expand from there. This is the luxury surface layer that will plug into verified
                listings and intelligence next.
              </p>

              <div className="mt-7 max-w-2xl">
                <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.55)] sm:p-5">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_220px_at_25%_0%,rgba(232,190,92,0.12),transparent_60%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_220px_at_85%_10%,rgba(120,76,255,0.12),transparent_60%)]" />
                  <div className="relative">
                    <CitySearch />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="CITIES" value={CITIES.length} tone="gold" />
                <StatCard label="REGIONS" value={regionCount} tone="violet" />
                <StatCard label="TIMEZONES" value={timezoneCount} tone="aqua" />
                <StatCard label="STATUS" value={<span className="text-[rgba(232,190,92,0.95)]">LIVE</span>} tone="neutral" />
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/20 p-5 shadow-[0_34px_110px_rgba(0,0,0,0.62)] sm:p-6">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(760px_260px_at_40%_0%,rgba(232,190,92,0.14),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(760px_260px_at_90%_20%,rgba(120,76,255,0.14),transparent_60%)]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
                </div>

                <div className="relative">
                  <SectionLabel hint="Live cards">Popular</SectionLabel>

                  <CityCardsClient
                    cities={CITIES.slice(0, 4)}
                    columns="grid gap-4 grid-cols-1 sm:grid-cols-2"
                  />

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[12px] text-zinc-300">
                    Curated picks update as the index grows.
                    <span className="text-zinc-500"> Real intelligence comes next.</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-300 shadow-[0_18px_55px_rgba(0,0,0,0.45)]">
                  <div className="text-[11px] tracking-[0.18em] text-zinc-400">SIGNAL</div>
                  <div className="mt-2 text-zinc-200">Truth-first city surfaces</div>
                  <div className="mt-1 text-xs text-zinc-500">Built to host verified data, not vibes.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-300 shadow-[0_18px_55px_rgba(0,0,0,0.45)]">
                  <div className="text-[11px] tracking-[0.18em] text-zinc-400">PACE</div>
                  <div className="mt-2 text-zinc-200">Open a city in seconds</div>
                  <div className="mt-1 text-xs text-zinc-500">Fast navigation, premium framing.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <section className="mt-10 sm:mt-12">
          <SectionLabel hint={`${CITIES.length} total`}>Explore</SectionLabel>

          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_20%_0%,rgba(232,190,92,0.10),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.10),transparent_60%)]" />
            </div>
            <div className="relative">
              <CityCardsClient cities={CITIES} />
            </div>
          </div>
        </section>

        <section className="mt-14 sm:mt-16">
          <SectionLabel hint="Curated lanes">Featured routes</SectionLabel>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'European capitals', tone: 'gold' as const },
              { title: 'Coastal cities', tone: 'aqua' as const },
              { title: '24/7 cities', tone: 'violet' as const },
              { title: 'High-growth hubs', tone: 'neutral' as const },
            ].map((item) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-sm text-zinc-200 shadow-[0_22px_60px_rgba(0,0,0,0.50)]"
              >
                <div
                  className={[
                    'pointer-events-none absolute inset-0',
                    item.tone === 'gold'
                      ? 'bg-[radial-gradient(520px_180px_at_20%_0%,rgba(232,190,92,0.12),transparent_60%)]'
                      : item.tone === 'aqua'
                        ? 'bg-[radial-gradient(520px_180px_at_20%_0%,rgba(62,196,255,0.10),transparent_60%)]'
                        : item.tone === 'violet'
                          ? 'bg-[radial-gradient(520px_180px_at_20%_0%,rgba(120,76,255,0.12),transparent_60%)]'
                          : 'bg-[radial-gradient(520px_180px_at_20%_0%,rgba(255,255,255,0.08),transparent_60%)]',
                  ].join(' ')}
                />
                <div className="relative">
                  <div className="text-[11px] tracking-[0.18em] text-zinc-400">FEATURED</div>
                  <div className="mt-2 font-medium">{item.title}</div>
                  <div className="mt-1 text-xs text-zinc-500">Handpicked entry points</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
