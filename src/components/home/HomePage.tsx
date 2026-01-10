// src/components/home/HomePage.tsx
import Image from 'next/image';

import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import { CITIES } from './cities';
import { Suspense } from 'react';
import TopBar from '@/components/layout/TopBar';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#0C0F14] text-zinc-100">
      {/* Ambient royal backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(232,190,92,0.14),transparent_62%)] blur-2xl" />
        <div className="absolute -top-12 right-[-200px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.16),transparent_62%)] blur-2xl" />
        <div className="absolute bottom-[-240px] left-[-240px] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.10),transparent_60%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.16),rgba(0,0,0,0.78))]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      <div className="relative">
        <Suspense fallback={null}>
          <TopBar />
        </Suspense>

        <main className="w-full">{children}</main>

        <footer className="mx-auto w-full max-w-7xl px-5 pb-10 pt-10 sm:px-8">
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] px-5 py-5 text-xs text-zinc-400 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:px-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(700px_260px_at_20%_0%,rgba(232,190,92,0.08),transparent_58%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(700px_260px_at_85%_10%,rgba(120,76,255,0.08),transparent_58%)]" />
            </div>

            <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} Vantera</div>
              <div className="text-zinc-500">A private intelligence surface for high-value real estate.</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SectionLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400">
          {String(children).toUpperCase()}
        </div>
        {/* quieter gold (reduced) */}
        <div className="mt-2 h-px w-28 bg-gradient-to-r from-[rgba(232,190,92,0.38)] via-white/12 to-transparent" />
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
      ? 'ring-[rgba(232,190,92,0.16)]'
      : tone === 'violet'
        ? 'ring-[rgba(120,76,255,0.16)]'
        : tone === 'aqua'
          ? 'ring-[rgba(62,196,255,0.14)]'
          : 'ring-white/10';

  const toneGlow =
    tone === 'gold'
      ? 'bg-[radial-gradient(260px_120px_at_30%_0%,rgba(232,190,92,0.12),transparent_60%)]'
      : tone === 'violet'
        ? 'bg-[radial-gradient(260px_120px_at_30%_0%,rgba(120,76,255,0.12),transparent_60%)]'
        : tone === 'aqua'
          ? 'bg-[radial-gradient(260px_120px_at_30%_0%,rgba(62,196,255,0.10),transparent_60%)]'
          : 'bg-[radial-gradient(260px_120px_at_30%_0%,rgba(255,255,255,0.08),transparent_60%)]';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 shadow-[0_18px_55px_rgba(0,0,0,0.45)] ring-1">
      <div className={`pointer-events-none absolute inset-0 ${toneGlow}`} />
      <div className={`pointer-events-none absolute inset-0 ring-1 ${toneRing}`} />
      <div className="relative">
        <div className="text-[11px] tracking-[0.16em] text-zinc-400">{label}</div>
        <div className="mt-1 text-lg font-semibold text-zinc-100">{value}</div>
      </div>
    </div>
  );
}

function HeroShine() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* breathing ambient - server-safe (keyframes live in globals.css) */}
      <div className="absolute inset-0 animate-[vanteraPulse_14s_ease-in-out_infinite]">
        <div className="absolute -top-24 left-1/2 h-[540px] w-[1050px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(232,190,92,0.18),transparent_62%)] blur-2xl" />
        <div className="absolute -top-10 right-[-260px] h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.20),transparent_62%)] blur-2xl" />
        <div className="absolute bottom-[-220px] left-[-220px] h-[660px] w-[660px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.11),transparent_60%)] blur-2xl" />
      </div>

      {/* glass highlight sweep (softer) */}
      <div className="absolute inset-0 animate-[vanteraSweep_10s_ease-in-out_infinite] opacity-30 [background:linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_45%,transparent_62%)]" />

      {/* subtle brand watermark */}
      <div className="absolute right-[-70px] top-[-50px] opacity-[0.06] blur-[0.2px]">
        <Image src="/brand/vantera-logo-dark.png" alt="" width={520} height={160} className="w-[520px]" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const regionCount = new Set(CITIES.map((c) => c.region).filter(Boolean)).size;
  const timezoneCount = new Set(CITIES.map((c) => c.tz)).size;

  return (
    <Shell>
      {/* FULL-WIDTH ROYAL HERO BAND (content centered) */}
      <section className="relative w-full pb-12 pt-12 sm:pb-16 sm:pt-14">
        <div className="relative w-full overflow-hidden border-y border-white/10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.045),rgba(255,255,255,0.014),rgba(0,0,0,0.62))] shadow-[0_55px_150px_rgba(0,0,0,0.72)]">
          <HeroShine />

          <div className="relative mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              {/* LEFT */}
              <div className="lg:col-span-7">
                {/* restrained pills (less “feature list”) */}
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-black/28 px-4 py-2 text-[11px] text-zinc-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[rgba(232,190,92,0.95)] shadow-[0_0_0_3px_rgba(232,190,92,0.10)]" />
                  <span className="tracking-wide text-zinc-200">Private index · Live</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-300">Signal over noise</span>
                </div>

                <h1 className="mt-7 text-balance text-4xl font-semibold tracking-[-0.02em] text-zinc-50 sm:text-5xl lg:text-[72px] lg:leading-[1.02]">
                  Private intelligence for the world’s{' '}
                  <span className="relative bg-[linear-gradient(90deg,rgba(255,255,255,0.90),rgba(232,190,92,0.95),rgba(255,255,255,0.86))] bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(232,190,92,0.18)]">
                    most valuable cities
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-300 sm:text-lg">
                  Vantera is a quiet intelligence surface designed for buyers, sellers and advisors who value signal over noise.
                  <span className="text-zinc-500"> Built for clarity today. Designed for truth tomorrow.</span>
                </p>

                <div className="mt-7 max-w-2xl">
                  <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] p-4 shadow-[0_26px_80px_rgba(0,0,0,0.62)] transition-all duration-700 hover:border-white/22 hover:bg-white/[0.035] sm:p-5">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_220px_at_25%_0%,rgba(232,190,92,0.10),transparent_60%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_220px_at_85%_10%,rgba(120,76,255,0.10),transparent_60%)]" />
                    <div className="relative">
                      <div className="mb-2 text-[11px] font-semibold tracking-[0.22em] text-zinc-400">
                        SEARCH A CITY
                      </div>
                      <div className="text-xs text-zinc-500">Open its intelligence surface.</div>

                      <div className="mt-3">
                        <CitySearch />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatCard label="GLOBAL COVERAGE" value={CITIES.length} tone="gold" />
                  <StatCard label="CROSS-MARKET VIEW" value={regionCount} tone="violet" />
                  <StatCard label="ALWAYS CURRENT" value={timezoneCount} tone="aqua" />
                  <StatCard
                    label="STATUS"
                    value={<span className="text-[rgba(232,190,92,0.92)]">LIVE</span>}
                    tone="neutral"
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/22 p-5 shadow-[0_42px_130px_rgba(0,0,0,0.70)] sm:p-6">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(760px_260px_at_40%_0%,rgba(232,190,92,0.10),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(760px_260px_at_90%_20%,rgba(120,76,255,0.10),transparent_60%)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  <div className="relative">
                    <SectionLabel hint="Private index">Selected cities</SectionLabel>

                    <CityCardsClient cities={CITIES.slice(0, 4)} columns="grid gap-4 grid-cols-1 sm:grid-cols-2" />

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[12px] text-zinc-300">
                      Curated entry points.
                      <span className="text-zinc-500"> Intelligence expands as the system evolves.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-300 shadow-[0_22px_70px_rgba(0,0,0,0.55)]">
                    <div className="text-[11px] tracking-[0.18em] text-zinc-400">SIGNAL</div>
                    <div className="mt-2 text-zinc-200">Truth-first city intelligence</div>
                    <div className="mt-1 text-xs text-zinc-500">Designed to host verified data, not speculation.</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-300 shadow-[0_22px_70px_rgba(0,0,0,0.55)]">
                    <div className="text-[11px] tracking-[0.18em] text-zinc-400">ACCESS</div>
                    <div className="mt-2 text-zinc-200">Open a city in seconds</div>
                    <div className="mt-1 text-xs text-zinc-500">Immediate context. No friction.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* soft bottom fade into body */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#0C0F14]" />
        </div>
      </section>

      {/* BODY */}
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        <section className="mt-10 sm:mt-12">
          <SectionLabel hint={`${CITIES.length} cities tracked`}>Explore the index</SectionLabel>

          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_20%_0%,rgba(232,190,92,0.08),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.08),transparent_60%)]" />
            </div>
            <div className="relative">
              <CityCardsClient cities={CITIES} />
            </div>
          </div>
        </section>

        <section className="mt-14 sm:mt-16">
          <SectionLabel hint="Curated lanes">Curated routes</SectionLabel>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'European capitals', subtitle: 'Strategic centers of influence', tone: 'gold' as const },
              { title: 'Coastal cities', subtitle: 'Lifestyle-driven value', tone: 'aqua' as const },
              { title: '24-hour cities', subtitle: 'Always-on markets', tone: 'violet' as const },
              { title: 'High-growth hubs', subtitle: 'Emerging signal density', tone: 'neutral' as const },
            ].map((item) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-sm text-zinc-200 shadow-[0_22px_60px_rgba(0,0,0,0.50)]"
              >
                <div
                  className={[
                    'pointer-events-none absolute inset-0',
                    item.tone === 'gold'
                      ? 'bg-[radial-gradient(520px_180px_at_20%,rgba(232,190,92,0.10),transparent_60%)]'
                      : item.tone === 'aqua'
                        ? 'bg-[radial-gradient(520px_180px_at_20%,rgba(62,196,255,0.08),transparent_60%)]'
                        : item.tone === 'violet'
                          ? 'bg-[radial-gradient(520px_180px_at_20%,rgba(120,76,255,0.10),transparent_60%)]'
                          : 'bg-[radial-gradient(520px_180px_at_20%,rgba(255,255,255,0.07),transparent_60%)]',
                  ].join(' ')}
                />
                <div className="relative">
                  <div className="text-[11px] tracking-[0.18em] text-zinc-400">FEATURED</div>
                  <div className="mt-2 font-medium">{item.title}</div>
                  <div className="mt-1 text-xs text-zinc-500">{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
