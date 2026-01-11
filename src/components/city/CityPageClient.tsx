// src/components/city/CityPageClient.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Lock, ShieldCheck, Sparkles } from 'lucide-react';

import PageShell from '@/components/layout/PageShell';
import type { City as FullCity } from '@/components/home/cities';
import { CITIES } from '@/components/home/cities';

import TruthCard, { type TruthCardData } from '@/components/truth/TruthCard';
import { computeCityUiState, cityUiCopy, type CitySupplySnapshot } from '@/lib/city/cityUiState';

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

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

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
      className={cx(
        'rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.14em] transition',
        active
          ? 'border-white/14 bg-white/[0.06] text-zinc-100'
          : 'border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.04] hover:border-white/12'
      )}
    >
      {label.toUpperCase()}
    </button>
  );
}

function StateBanner({
  badgeTop,
  badgeBottom,
  title,
  body,
}: {
  badgeTop: string;
  badgeBottom: string;
  title: string;
  body: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02] shadow-[0_34px_110px_rgba(0,0,0,0.55)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(120,76,255,0.10),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs text-zinc-300">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 opacity-80" />
              <span className="font-semibold tracking-[0.18em] text-zinc-200">{badgeTop}</span>
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">{badgeBottom}</span>
          </div>

          <div className="mt-3 text-lg font-semibold tracking-tight text-zinc-100">{title}</div>
          <div className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-300">{body}</div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-zinc-100 transition hover:bg-white/[0.09]"
          >
            Publish verified listing
            <Sparkles className="h-4 w-4 opacity-80" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-zinc-300 transition hover:bg-white/[0.04] hover:border-white/12"
          >
            Back to index
          </Link>
        </div>
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
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Pull the full city record so we can read tier/status/priority without changing the server page.
  const fullCity = useMemo<FullCity | undefined>(
    () => CITIES.find((c) => c.slug === city.slug),
    [city.slug]
  );

  // Phase 2: replace this with DB-backed counts (verified listings, pending, etc).
  // For now: a believable stub that still drives your UI states correctly.
  const supply = useMemo<CitySupplySnapshot>(() => {
    const tier = fullCity?.tier ?? 'TIER_3';
    const status = fullCity?.status ?? 'EXPANDING';

    // Intelligence models can be "active" earlier than listings (your whole premise).
    const hasIntelligenceModels = tier === 'TIER_0' || tier === 'TIER_1' || status === 'TRACKING';

    return {
      verifiedListingsCount: 0,
      pendingListingsCount: tier === 'TIER_0' ? 2 : tier === 'TIER_1' ? 1 : 0,
      hasIntelligenceModels,
    };
  }, [fullCity]);

  const uiState = useMemo(() => {
    // If city not found in canonical list, treat as expanding.
    if (!fullCity) {
      return computeCityUiState(
        { slug: city.slug, name: city.name, country: city.country, region: city.region ?? undefined, tz: city.tz } as any,
        supply
      );
    }
    return computeCityUiState(fullCity, supply);
  }, [city, fullCity, supply]);

  const copy = useMemo(() => cityUiCopy(uiState), [uiState]);

  const tab = useMemo(() => getTab(sp), [sp]);

  function setTab(nextTab: TabKey) {
    const nextParams = new URLSearchParams(sp.toString());
    nextParams.set('tab', nextTab);
    router.push(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }

  // Example Truth Card (Phase 2: hydrate from listing + truth pipeline)
  const sampleTruthCard = useMemo<TruthCardData>(() => {
    const currency = city.country === 'United States' ? 'USD' : 'EUR';
    return {
      propertyId: `VTR-${city.slug.toUpperCase()}-0001`,
      cityName: city.name,
      assetType: 'Villa',
      verificationStatus:
        uiState === 'VERIFIED_SUPPLY_ONLY' ? 'verified' : uiState === 'INTELLIGENCE_ACTIVE_LISTINGS_LOCKED' ? 'restricted' : 'pending',
      dataConfidence:
        uiState === 'VERIFIED_SUPPLY_ONLY' ? 86 : uiState === 'INTELLIGENCE_ACTIVE_LISTINGS_LOCKED' ? 72 : 60,
      lastUpdatedISO: new Date().toISOString(),

      askingPrice: undefined,
      currency,

      fairValueBand: { low: 2850000, mid: 3200000, high: 3650000 },
      pricingSignal: 'fair',
      deviationPct: 0,

      estimatedTimeToSellDays: { low: 45, high: 110 },
      liquidityScore: uiState === 'VERIFIED_SUPPLY_ONLY' ? 78 : 66,
      demandPressure: uiState === 'VERIFIED_SUPPLY_ONLY' ? 'high' : 'medium',
      buyerPoolDepth: uiState === 'VERIFIED_SUPPLY_ONLY' ? 'deep' : 'normal',

      reductionProbabilityPct: uiState === 'VERIFIED_SUPPLY_ONLY' ? 22 : 41,
      anomalyFlags: uiState === 'VERIFIED_SUPPLY_ONLY' ? [] : ['signal density warming'],

      bedrooms: 5,
      bathrooms: 6,
      builtAreaSqm: 520,
      plotAreaSqm: 1250,
      primeAttributes: ['Sea-view potential', 'Prime corridor', 'Low noise', 'Privacy'],
    };
  }, [city, uiState]);

  const localTime = useMemo(() => formatLocalTime(city.tz), [city.tz, now]);

  const hero = (
    <section className="relative w-full overflow-hidden border-b border-white/10 bg-[#0B0E13]">
      {/* Ambient layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_18%,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="absolute inset-0 opacity-75 [background:radial-gradient(920px_420px_at_15%_18%,rgba(120,76,255,0.16),transparent_56%)]" />
        <div className="absolute inset-0 opacity-75 [background:radial-gradient(920px_420px_at_85%_22%,rgba(62,196,255,0.11),transparent_56%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.28),rgba(0,0,0,0.78))]" />
        <div className="absolute inset-0 opacity-[0.055] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_0)] [background-size:26px_26px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Top meta */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] text-zinc-200">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
              <span className="tracking-wide text-zinc-200">City intelligence surface</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-300">{city.country}</span>
              {city.region ? (
                <>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-300">{city.region}</span>
                </>
              ) : null}
            </div>

            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.02em] text-zinc-50 sm:text-5xl lg:text-[64px] lg:leading-[1.02]">
              {city.name}
            </h1>

            <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-300 sm:text-base">
              {city.blurb
                ? city.blurb
                : 'A private city surface designed for clarity. Truth layers activate as verified coverage expands.'}
              <span className="text-zinc-500"> Signal over noise, always.</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs text-zinc-300">
              Local time: <span className="text-zinc-100">{localTime || '—'}</span>
            </div>

            <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs text-zinc-300">
              Node: <span className="font-mono text-zinc-100">{`/city/${city.slug}`}</span>
            </div>
          </div>
        </div>

        {/* Image band */}
        <div className="mt-7 grid gap-5 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.02] shadow-[0_42px_130px_rgba(0,0,0,0.70)]">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_20%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.10),transparent_60%)]" />
              </div>

              <div className="relative h-[260px] sm:h-[320px]">
                {city.image?.src ? (
                  <Image
                    src={city.image.src}
                    alt={city.image.alt ?? `${city.name} city view`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover opacity-[0.92] [filter:contrast(1.06)_saturate(1.04)]"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02),rgba(0,0,0,0.35))]" />
                )}

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.82),rgba(0,0,0,0.25),transparent)]" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0E13] to-transparent" />

                <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs text-zinc-200">
                  {fullCity?.tier ?? 'TIER_3'} · {fullCity?.status ?? 'EXPANDING'}
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="rounded-[26px] border border-white/10 bg-black/30 px-5 py-4 backdrop-blur-2xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm font-medium text-zinc-100">Market mode</div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-200">
                        {uiState === 'INTELLIGENCE_ACTIVE_LISTINGS_LOCKED' ? (
                          <>
                            <Lock className="h-4 w-4 opacity-80" />
                            Intelligence active · Listings locked
                          </>
                        ) : uiState === 'VERIFIED_SUPPLY_ONLY' ? (
                          <>
                            <ShieldCheck className="h-4 w-4 opacity-80" />
                            Verified supply only
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 opacity-80" />
                            Coverage expanding
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-xs leading-relaxed text-zinc-300">
                      {uiState === 'VERIFIED_SUPPLY_ONLY'
                        ? 'Only verified supply appears. Each property includes a Truth Card.'
                        : uiState === 'INTELLIGENCE_ACTIVE_LISTINGS_LOCKED'
                          ? 'The intelligence layer is live. Listings unlock when verified supply hits integrity thresholds.'
                          : 'This city is indexed. Truth signals warm as coverage deepens.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid gap-4">
              <StateBanner
                badgeTop={copy.badgeTop}
                badgeBottom={copy.badgeBottom}
                title={copy.title}
                body={copy.body}
              />

              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_34px_110px_rgba(0,0,0,0.55)] sm:p-6">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(120,76,255,0.10),transparent_60%)]" />
                </div>

                <div className="relative">
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">NAVIGATION</div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Link
                      href={`/city/${prev.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-zinc-200 transition hover:bg-white/[0.04] hover:border-white/12"
                    >
                      <ChevronLeft className="h-4 w-4 opacity-80" />
                      {prev.name}
                    </Link>

                    <Link
                      href={`/city/${next.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-zinc-200 transition hover:bg-white/[0.04] hover:border-white/12"
                    >
                      {next.name}
                      <ChevronRight className="h-4 w-4 opacity-80" />
                    </Link>
                  </div>

                  <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <TabButton active={tab === 'truth'} label="Truth" onClick={() => setTab('truth')} />
                    <TabButton active={tab === 'supply'} label="Supply" onClick={() => setTab('supply')} />
                    <div className="ml-auto rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs text-zinc-300">
                      Verified: <span className="text-zinc-100">{supply.verifiedListingsCount}</span>
                      <span className="text-zinc-600"> · </span>
                      Pending: <span className="text-zinc-100">{supply.pendingListingsCount}</span>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-zinc-500">
                    Tabs are URL-synced. Share <span className="font-mono text-zinc-400">{`?tab=${tab}`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#0B0E13]" />
    </section>
  );

  return (
    <PageShell fullBleedHero={hero} heroOnly>
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
        {tab === 'truth' ? (
          <section className="mt-10 sm:mt-12">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400">TRUTH</div>
                <div className="mt-2 h-px w-28 bg-gradient-to-r from-white/18 via-white/10 to-transparent" />
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-300">
                Signal over noise
              </div>
            </div>

            {uiState === 'VERIFIED_SUPPLY_ONLY' ? (
              <div className="grid gap-5">
                <TruthCard data={sampleTruthCard} />
              </div>
            ) : uiState === 'INTELLIGENCE_ACTIVE_LISTINGS_LOCKED' ? (
              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02] p-6 shadow-[0_34px_110px_rgba(0,0,0,0.55)]">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(120,76,255,0.10),transparent_60%)]" />
                </div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs text-zinc-200">
                    <Lock className="h-4 w-4 opacity-80" />
                    Intelligence active · Listings locked
                  </div>

                  <div className="mt-4 text-lg font-semibold text-zinc-100">Market intelligence is live</div>
                  <div className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
                    We model value, liquidity and risk before we accept public inventory. Verified supply unlocks once the
                    integrity gate is satisfied.
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Link
                      href="/sell"
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-zinc-100 transition hover:bg-white/[0.09]"
                    >
                      Publish verified listing
                      <Sparkles className="h-4 w-4 opacity-80" />
                    </Link>

                    <div className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-zinc-300">
                      Verified supply only
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-5">
                <TruthCard data={sampleTruthCard} />
              </div>
            )}
          </section>
        ) : null}

        {tab === 'supply' ? (
          <section className="mt-10 sm:mt-12">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-400">SUPPLY</div>
                <div className="mt-2 h-px w-28 bg-gradient-to-r from-white/18 via-white/10 to-transparent" />
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-300">
                Verified supply only
              </div>
            </div>

            {uiState === 'VERIFIED_SUPPLY_ONLY' ? (
              <div className="rounded-[30px] border border-white/10 bg-white/[0.02] p-6 shadow-[0_34px_110px_rgba(0,0,0,0.55)]">
                <div className="text-sm text-zinc-300">
                  Verified listings will render here (grid/virtualized). Each one opens its Truth Card.
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02] p-6 shadow-[0_34px_110px_rgba(0,0,0,0.55)]">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(120,76,255,0.10),transparent_60%)]" />
                </div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs text-zinc-200">
                    <Lock className="h-4 w-4 opacity-80" />
                    Listings locked
                  </div>

                  <div className="mt-4 text-lg font-semibold text-zinc-100">Supply is integrity-gated</div>
                  <div className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
                    This city is indexed, but inventory is not public until it passes verification. You can publish one
                    listing at a time, pay by credit card, and appear under Verified supply once approved.
                  </div>

                  <div className="mt-5">
                    <Link
                      href="/sell"
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-zinc-100 transition hover:bg-white/[0.09]"
                    >
                      Publish verified listing
                      <Sparkles className="h-4 w-4 opacity-80" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}
