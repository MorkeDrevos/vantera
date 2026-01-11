// src/components/city/CityPageClient.tsx
'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Lock, ShieldCheck, Sparkles } from 'lucide-react';

import SafeImage from '@/components/home/SafeImage';

type CityImage = {
  src: string;
  alt: string | null;
};

export type CityPageCity = {
  name: string;
  slug: string;
  country: string;
  region: string | null;
  tz: string;
  blurb: string | null;
  image: CityImage | null;
};

export type CityNavItem = {
  name: string;
  slug: string;
};

function safeAlt(city: CityPageCity) {
  const a = city.image?.alt?.trim();
  return a ? a : `${city.name} city view`;
}

type CityUiState = 'INTELLIGENCE_ACTIVE_LISTINGS_LOCKED' | 'VERIFIED_SUPPLY_ONLY' | 'COVERAGE_EXPANDING';

type CitySupplySnapshot = {
  verifiedListingsCount: number;
  pendingListingsCount: number;
  intelligenceActive: boolean;
};

function computeCityUiState(s: CitySupplySnapshot): CityUiState {
  if (s.verifiedListingsCount > 0) return 'VERIFIED_SUPPLY_ONLY';
  if (s.intelligenceActive) return 'INTELLIGENCE_ACTIVE_LISTINGS_LOCKED';
  return 'COVERAGE_EXPANDING';
}

function stateCopy(state: CityUiState) {
  if (state === 'VERIFIED_SUPPLY_ONLY') {
    return {
      badge: 'Verified supply only',
      title: 'Verified supply only',
      body: 'Only properties that pass identity, pricing and integrity checks appear here. Each one opens a Truth Card.',
      icon: <ShieldCheck className="h-4 w-4 opacity-80" />,
    };
  }

  if (state === 'INTELLIGENCE_ACTIVE_LISTINGS_LOCKED') {
    return {
      badge: 'Intelligence active · Listings locked',
      title: 'Intelligence active · Listings locked',
      body: 'Market intelligence is live. Public inventory unlocks only after verified supply meets integrity thresholds.',
      icon: <Lock className="h-4 w-4 opacity-80" />,
    };
  }

  return {
    badge: 'Coverage expanding',
    title: 'Coverage expanding',
    body: 'This city is indexed. Verified supply unlocks as integrity thresholds are met.',
    icon: <Sparkles className="h-4 w-4 opacity-80" />,
  };
}

type TabKey = 'truth' | 'supply';

function getTab(sp: URLSearchParams): TabKey {
  const t = (sp.get('tab') ?? 'truth').toLowerCase();
  return t === 'supply' ? 'supply' : 'truth';
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full border px-3.5 py-2 text-[11px] font-semibold tracking-[0.18em] transition',
        active
          ? 'border-white/14 bg-white/[0.06] text-zinc-100'
          : 'border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.04] hover:border-white/12',
      ].join(' ')}
    >
      {label.toUpperCase()}
    </button>
  );
}

function MiniPill({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2">
      <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">{k}</div>
      <div className="text-xs text-zinc-100">{v}</div>
    </div>
  );
}

export default function CityPageClient({
  city,
  prev,
  next,
}: {
  city: CityPageCity;
  prev: CityNavItem;
  next: CityNavItem;
}) {
  const src = city.image?.src?.trim() ?? '';

  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tab = useMemo(() => getTab(sp), [sp]);

  function setTab(nextTab: TabKey) {
    const nextParams = new URLSearchParams(sp.toString());
    nextParams.set('tab', nextTab);
    router.push(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }

  // Phase 2: replace this with real DB numbers
  // For now we keep it deterministic and believable:
  const supply = useMemo<CitySupplySnapshot>(() => {
    const isFlagship = city.slug === 'marbella' || city.slug === 'benahavis' || city.slug === 'estepona';
    const intelligenceActive = isFlagship || city.country === 'United Kingdom' || city.country === 'United States';

    return {
      verifiedListingsCount: 0, // <- flip to >0 and the city becomes "Verified supply only"
      pendingListingsCount: isFlagship ? 2 : 0,
      intelligenceActive,
    };
  }, [city.country, city.slug]);

  const uiState = useMemo(() => computeCityUiState(supply), [supply]);
  const copy = useMemo(() => stateCopy(uiState), [uiState]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-6">
        {/* Top nav */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:border-white/20"
          >
            ← Back
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/city/${prev.slug}`}
              prefetch
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:border-white/20"
              aria-label={`Previous city: ${prev.name}`}
              title={`Previous: ${prev.name}`}
            >
              ← Prev
            </Link>
            <Link
              href={`/city/${next.slug}`}
              prefetch
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:border-white/20"
              aria-label={`Next city: ${next.name}`}
              title={`Next: ${next.name}`}
            >
              Next →
            </Link>
          </div>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          {/* Hero image */}
          <div className="relative h-[260px] w-full sm:h-[360px]">
            {src ? (
              <SafeImage
                src={src}
                alt={safeAlt(city)}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover opacity-95"
                priority={false}
                fallback={<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Market mode badge */}
            <div className="absolute left-4 top-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xs text-zinc-200 backdrop-blur-2xl">
                {copy.icon}
                <span className="font-semibold tracking-[0.12em]">{copy.badge}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">{city.name}</h1>

              <div className="text-sm text-zinc-300">
                <span className="text-zinc-200">{city.country}</span>
                {city.region ? <span className="text-zinc-400">{` · ${city.region}`}</span> : null}
                <span className="text-zinc-500">{` · ${city.tz}`}</span>
              </div>

              {city.blurb ? (
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-200">{city.blurb}</p>
              ) : null}
            </div>

            {/* State panel */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.55)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-zinc-200">
                    {copy.icon}
                    <span className="font-semibold tracking-[0.18em]">{copy.title.toUpperCase()}</span>
                  </div>

                  <div className="mt-3 text-sm leading-relaxed text-zinc-300">{copy.body}</div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <TabButton active={tab === 'truth'} label="Truth" onClick={() => setTab('truth')} />
                    <TabButton active={tab === 'supply'} label="Supply" onClick={() => setTab('supply')} />
                  </div>
                </div>

                <div className="grid gap-2 sm:text-right">
                  <MiniPill k="VERIFIED" v={<span className="font-mono">{supply.verifiedListingsCount}</span>} />
                  <MiniPill k="PENDING" v={<span className="font-mono">{supply.pendingListingsCount}</span>} />
                </div>
              </div>
            </div>

            {/* Tab body */}
            <div className="mt-6">
              {tab === 'truth' ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">TRUTH CARD</div>

                  {uiState === 'VERIFIED_SUPPLY_ONLY' ? (
                    <div className="mt-3 text-sm text-zinc-300">
                      Truth Card will render here for each verified listing (Phase 2).
                    </div>
                  ) : uiState === 'INTELLIGENCE_ACTIVE_LISTINGS_LOCKED' ? (
                    <div className="mt-3 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-zinc-300">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-200">
                        <Lock className="h-4 w-4 opacity-80" />
                        Intelligence active · Listings locked
                      </div>
                      <div className="mt-3 leading-relaxed">
                        We run the intelligence layer before opening public supply. Publish a verified listing to help
                        unlock this market.
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href="/sell"
                          className="rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-zinc-100 hover:bg-white/[0.09]"
                        >
                          Publish verified listing
                        </Link>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-zinc-300">
                          Verified supply only
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-zinc-300">
                      Coverage is warming. Truth Cards activate as soon as verified listings exist.
                    </div>
                  )}
                </div>
              ) : null}

              {tab === 'supply' ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">SUPPLY</div>

                  {uiState === 'VERIFIED_SUPPLY_ONLY' ? (
                    <div className="mt-3 text-sm text-zinc-300">
                      Verified listings grid will render here (Phase 2). Each listing opens its Truth Card.
                    </div>
                  ) : (
                    <div className="mt-3 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-zinc-300">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-200">
                        <Lock className="h-4 w-4 opacity-80" />
                        Listings locked
                      </div>
                      <div className="mt-3 leading-relaxed">
                        Supply is integrity-gated. You can upload one listing, pay by credit card and publish after
                        verification.
                      </div>

                      <div className="mt-4">
                        <Link
                          href="/sell"
                          className="rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-zinc-100 hover:bg-white/[0.09]"
                        >
                          Publish verified listing
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="mt-6 h-px w-full bg-white/10" />

            {/* Links */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/listings?city=${city.slug}`}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:border-white/20"
              >
                Browse listings
              </Link>

              {/* ✅ Ranking fuel */}
              <Link
                href={`/city/${city.slug}/luxury-real-estate`}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:border-white/20"
              >
                Luxury in {city.name}
              </Link>

              <Link
                href={`/city/${city.slug}`}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-zinc-300 hover:border-white/20"
              >
                {`/city/${city.slug}`}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
