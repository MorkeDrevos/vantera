// src/components/home/HomePage.tsx
import Image from 'next/image';

import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
import { CITIES } from './cities';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#0C0F14] text-zinc-100">
      {/* Ambient royal backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(232,190,92,0.18),transparent_62%)] blur-2xl" />
        <div className="absolute -top-12 right-[-200px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.20),transparent_62%)] blur-2xl" />
        <div className="absolute bottom-[-240px] left-[-240px] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.12),transparent_60%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.72))]" />
        <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_0)] [background-size:22px_22px]" />
      </div>

      <div className="relative">
        {/* TOP BAR */}
        <header className="w-full px-5 pt-6 sm:px-8 sm:pt-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_30%_0%,rgba(232,190,92,0.16),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(800px_260px_at_80%_10%,rgba(120,76,255,0.18),transparent_55%)]" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
              </div>

              <div className="relative flex items-center justify-between px-6 py-5">
                <Image
                  src="/brand/vantera-logo-dark.png"
                  alt="Vantera"
                  width={170}
                  height={52}
                  priority
                  className="h-8 w-auto opacity-95"
                />

                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-zinc-300">
                  City Index · Live
                </span>
              </div>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}

function HeroShine() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 animate-[vanteraPulse_14s_ease-in-out_infinite]">
        <div className="absolute -top-24 left-1/2 h-[540px] w-[1050px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(232,190,92,0.22),transparent_62%)] blur-2xl" />
        <div className="absolute -top-10 right-[-260px] h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.24),transparent_62%)] blur-2xl" />
        <div className="absolute bottom-[-220px] left-[-220px] h-[660px] w-[660px] rounded-full bg-[radial-gradient(circle_at_center,rgba(62,196,255,0.13),transparent_60%)] blur-2xl" />
      </div>

      <div className="absolute inset-0 animate-[vanteraSweep_10s_ease-in-out_infinite] opacity-40 [background:linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.09)_45%,transparent_62%)]" />
    </div>
  );
}

export default function HomePage() {
  return (
    <Shell>
      <section className="relative w-full overflow-hidden border-y border-white/10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),rgba(255,255,255,0.015),rgba(0,0,0,0.58))]">
        <HeroShine />

        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <h1 className="text-4xl font-semibold tracking-[-0.015em] sm:text-5xl lg:text-[72px]">
            Discover cities with{' '}
            <span className="bg-[linear-gradient(90deg,rgba(232,190,92,1),rgba(255,255,255,0.9),rgba(120,76,255,1))] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(232,190,92,0.25)]">
              premium clarity
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-zinc-300">
            A private intelligence surface for global cities.
          </p>

          <div className="mt-8 max-w-xl">
            <CitySearch />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <CityCardsClient cities={CITIES} />
      </div>
    </Shell>
  );
}
