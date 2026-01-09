import Link from 'next/link';
import type { ReactNode } from 'react';

import CitySearch from './CitySearch';
import CityCardsClient from './CityCardsClient';
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

export default function HomePage() {
  const regions = uniqCount(CITIES.map((c: any) => c.region));
  const timezones = uniqCount(CITIES.map((c: any) => c.tz));

  return (
    <Shell>
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
              Search a city, open the page, and expand from there. This is a production-grade UI baseline with real
              imagery and real-time local clocks.
            </p>

            <div className="mt-7 max-w-xl">
              <CitySearch />
            </div>

            <div className="mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs text-zinc-400">Cities</div>
                <div className="mt-1 text-lg font-semibold text-zinc-100">{CITIES.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs text-zinc-400">Regions</div>
                <div className="mt-1 text-lg font-semibold text-zinc-100">{regions || 0}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs text-zinc-400">Timezones</div>
                <div className="mt-1 text-lg font-semibold text-zinc-100">{timezones || 0}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs text-zinc-400">Status</div>
                <div className="mt-1 text-lg font-semibold text-emerald-300">Live</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <SectionLabel>Popular</SectionLabel>

              <div className="grid grid-cols-2 gap-3">
                {CITIES.slice(0, 6).map((c: any) => (
                  <Link
                    key={c.slug}
                    href={`/city/${c.slug}`}
                    className="group rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-4 transition hover:border-white/20 hover:bg-white/5"
                  >
                    <div className="text-sm font-medium text-zinc-100">{c.name}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {c.country}
                      {c.tz ? ` · ${c.tz}` : ''}
                    </div>
                    <div className="mt-3 h-px w-full bg-white/10 transition group-hover:bg-white/15" />
                    <div className="mt-3 text-xs text-zinc-400">/city/{c.slug}</div>
                  </Link>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-300">
                Tip: type “mad”, “bar”, “lis”, or “nyc”. Use ↑ ↓ then Enter.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <SectionLabel>Explore</SectionLabel>
        <CityCardsClient cities={CITIES as any} />
      </section>
    </Shell>
  );
}
