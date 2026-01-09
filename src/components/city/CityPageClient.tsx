// src/components/city/CityPageClient.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import PageShell from '@/components/layout/PageShell';

type CityLite = {
  name: string;
  slug: string;
  country: string;
  region: string | null;
  tz: string;
  blurb: string | null;
  image: { src: string; alt: string | null } | null;
};

type NavLite = { name: string; slug: string };

type TabKey = 'truth' | 'supply';

function formatLocalTime(tz: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: tz,
    }).format(new Date());
  } catch {
    return '';
  }
}

function pillTone(tone: 'good' | 'warn' | 'bad' | 'neutral') {
  if (tone === 'good') return 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100';
  if (tone === 'warn') return 'border-amber-400/20 bg-amber-500/10 text-amber-100';
  if (tone === 'bad') return 'border-rose-400/20 bg-rose-500/10 text-rose-100';
  return 'border-white/10 bg-white/5 text-zinc-200';
}

function TabButton({
  active,
  onClick,
  title,
  subtitle,
  tone = 'neutral',
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  tone?: 'good' | 'warn' | 'neutral';
}) {
  const activeClass = active
    ? 'border-white/20 bg-white/10'
    : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/5';

  const badge =
    tone === 'good'
      ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100'
      : tone === 'warn'
        ? 'border-amber-400/20 bg-amber-500/10 text-amber-100'
        : 'border-white/10 bg-white/5 text-zinc-200';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-2xl border px-4 py-3 text-left transition ${activeClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-100">{title}</div>
          <div className="mt-1 text-xs leading-relaxed text-zinc-400">{subtitle}</div>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] ${badge}`}>
          {active ? 'ACTIVE' : 'OPEN'}
        </span>
      </div>
    </button>
  );
}

function TruthCardPreview() {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-zinc-100">Truth Card</div>
          <div className="mt-1 text-xs leading-relaxed text-zinc-500">
            Preview only. Static values until verified coverage is wired.
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200">
          PREVIEW
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">Overpricing</div>
            <span className={`rounded-full border px-2.5 py-1 text-[11px] ${pillTone('bad')}`}>+18%</span>
          </div>
          <div className="mt-2 text-xs leading-relaxed text-zinc-500">
            Above micro-market fair value. Downward pressure likely without a cut.
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">Time-to-sell</div>
            <span className={`rounded-full border px-2.5 py-1 text-[11px] ${pillTone('warn')}`}>94 days</span>
          </div>
          <div className="mt-2 text-xs leading-relaxed text-zinc-500">
            At current ask, expected to sit. Faster exit requires price alignment.
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">Leverage</div>
            <span className={`rounded-full border px-2.5 py-1 text-[11px] ${pillTone('good')}`}>Buyer +2</span>
          </div>
          <div className="mt-2 text-xs leading-relaxed text-zinc-500">
            Buyer has more options. Seller urgency not yet priced into the listing.
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">Confidence</div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200">
            Low (preview)
          </span>
        </div>
        <div className="mt-2 text-xs leading-relaxed text-zinc-500">
          Locus only increases confidence when coverage exists (transactions, cuts, velocity). No fake precision.
        </div>
      </div>
    </div>
  );
}

function LiveSupplySnapshot() {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-zinc-100">Live supply snapshot</div>
          <div className="mt-1 text-xs leading-relaxed text-zinc-500">
            Designed for freshest listings. Static values for now.
          </div>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[11px] ${pillTone('good')}`}>LIVE</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs text-zinc-400">New today</div>
          <div className="mt-1 text-lg font-semibold text-zinc-100">14</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs text-zinc-400">Cuts (7d)</div>
          <div className="mt-1 text-lg font-semibold text-zinc-100">9</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs text-zinc-400">Relists (30d)</div>
          <div className="mt-1 text-lg font-semibold text-zinc-100">6</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs text-zinc-400">Last updated</div>
          <div className="mt-1 text-lg font-semibold text-zinc-100">6 min</div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">Source provenance</div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200">
              Public
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200">
              Broker
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200">
              Portal mirrors
            </span>
          </div>
        </div>

        <div className="mt-2 text-xs leading-relaxed text-zinc-500">
          Listings are the supply layer. Truth is computed on top. The supply layer can be complete and fast without compromising integrity.
        </div>
      </div>
    </div>
  );
}

function ListingRow({
  title,
  sub,
  price,
  chip,
}: {
  title: string;
  sub: string;
  price: string;
  chip: { label: string; tone: 'neutral' | 'warn' | 'good' };
}) {
  const chipCls =
    chip.tone === 'good'
      ? pillTone('good')
      : chip.tone === 'warn'
        ? pillTone('warn')
        : pillTone('neutral');

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-zinc-100">{title}</div>
        <div className="mt-1 truncate text-xs text-zinc-400">{sub}</div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-[11px] ${chipCls}`}>{chip.label}</span>
        <div className="text-sm font-semibold text-zinc-100">{price}</div>
      </div>
    </div>
  );
}

export default function CityPageClient({
  city,
  prev,
  next,
}: {
  city: CityLite;
  prev: NavLite;
  next: NavLite;
}) {
  const [tab, setTab] = useState<TabKey>('truth');
  const [localTime, setLocalTime] = useState(() => formatLocalTime(city.tz));

  useEffect(() => {
    const update = () => setLocalTime(formatLocalTime(city.tz));
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, [city.tz]);

  const nodeId = useMemo(() => `LOCUS:${city.slug.toUpperCase()}`, [city.slug]);

  const hero = (
    <section className="relative">
      {/* Full-bleed market surface background */}
      <div className="pointer-events-none absolute inset-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[1400px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[160px]" />
        <div className="absolute right-[-260px] top-[40px] h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:86px_86px]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_460px_at_50%_0%,rgba(0,0,0,0),rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.86)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <div className="pt-8 sm:pt-12 pb-10 sm:pb-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* HERO LEFT */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/90" />
                <span>Market surface</span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1 font-mono text-[11px] text-zinc-300">
                  {nodeId}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200">
                  Signals: initializing
                </span>
                <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[11px] text-amber-100">
                  Liquidity model: pending
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200">
                  Supply: live (soon)
                </span>
              </div>

              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
                {city.name}
                <span className="text-zinc-300"> market</span>
              </h1>

              <div className="mt-3 text-sm text-zinc-300">
                {city.country}
                {city.region ? ` · ${city.region}` : ''}
                {localTime ? ` · Local time ${localTime}` : ''}
              </div>

              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-200/90">
                {city.blurb ?? 'Truth-first market surface. Listings are the supply layer. Truth is computed on top.'}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <TabButton
                  active={tab === 'truth'}
                  onClick={() => setTab('truth')}
                  title="Truth"
                  subtitle="Value, liquidity, pressure, risk. No paid boosts. No suppression."
                  tone="warn"
                />
                <TabButton
                  active={tab === 'supply'}
                  onClick={() => setTab('supply')}
                  title="Live supply"
                  subtitle="Fresh listings and price changes with source provenance and deduping."
                  tone="good"
                />
              </div>
            </div>

            {/* HERO RIGHT */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <div className="relative aspect-[16/9] w-full bg-zinc-950">
                  {city.image?.src ? (
                    <img
                      src={city.image.src}
                      alt={city.image.alt ?? `${city.name} image`}
                      className="absolute inset-0 h-full w-full object-cover opacity-90"
                      loading="eager"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-transparent" />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-zinc-100">Surface status</div>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] ${pillTone('good')}`}>
                      Live UI
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs text-zinc-400">Truth</div>
                      <div className="mt-1 text-sm font-semibold text-amber-100">Initializing</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs text-zinc-400">Supply</div>
                      <div className="mt-1 text-sm font-semibold text-emerald-100">Planned</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs text-zinc-400">Timezone</div>
                      <div className="mt-1 text-sm font-semibold text-zinc-100">{city.tz}</div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-zinc-500">
                    This page will always show the freshest supply, but truth outputs stay locked to reality.
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Link
                      href="/"
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
                      prefetch
                    >
                      Back to labs
                    </Link>
                    <div className="text-xs text-zinc-500">Node: {nodeId}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT BELOW HERO */}
          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {tab === 'truth' ? (
                <div className="grid gap-6">
                  <TruthCardPreview />

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <div className="text-sm font-semibold text-zinc-100">Truth layer notes</div>
                    <div className="mt-2 text-sm leading-relaxed text-zinc-300">
                      Truth is not a listing. It is computed output with an audit trail.
                      When coverage is incomplete, the system shows what it knows and refuses to fake certainty.
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="text-xs text-zinc-400">Pressure</div>
                        <div className="mt-1 text-sm font-semibold text-zinc-100">Pending</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="text-xs text-zinc-400">Risk</div>
                        <div className="mt-1 text-sm font-semibold text-zinc-100">Pending</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="text-xs text-zinc-400">Liquidity</div>
                        <div className="mt-1 text-sm font-semibold text-zinc-100">Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  <LiveSupplySnapshot />

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-zinc-100">Latest listings</div>
                        <div className="mt-1 text-xs text-zinc-500">
                          This is the supply layer preview. Final version will show source, last seen, and deduped identity.
                        </div>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] ${pillTone('good')}`}>
                        Updated 6 min ago
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3">
                      <ListingRow
                        title="2 bed apartment, near center"
                        sub="Active · Source: broker · Seen 6 min ago"
                        price="€740k"
                        chip={{ label: 'New', tone: 'good' }}
                      />
                      <ListingRow
                        title="3 bed family home, schools zone"
                        sub="Active · Source: portal mirror · Seen 12 min ago"
                        price="€1.15M"
                        chip={{ label: 'Cut -3%', tone: 'warn' }}
                      />
                      <ListingRow
                        title="1 bed prime location"
                        sub="Relisted · Source: public · Seen 22 min ago"
                        price="€520k"
                        chip={{ label: 'Relist', tone: 'neutral' }}
                      />
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-zinc-500">
                      Supply is complete and fast. Truth is conservative and locked. Both exist without conflict.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <div className="text-sm font-semibold text-zinc-100">Navigate labs</div>
                <div className="mt-2 text-sm leading-relaxed text-zinc-300">
                  Move through market nodes. Each node becomes a truth surface and a live supply terminal.
                </div>

                <div className="mt-5 grid gap-3">
                  <Link
                    href={`/city/${prev.slug}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
                    prefetch
                  >
                    ← {prev.name}
                  </Link>

                  <Link
                    href={`/city/${next.slug}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
                    prefetch
                  >
                    {next.name} →
                  </Link>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-zinc-500">
                  Default is Truth. Live supply is always available, always sourced, always deduped.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return <PageShell fullBleedHero={hero}>{/* page body handled inside hero */}</PageShell>;
}
