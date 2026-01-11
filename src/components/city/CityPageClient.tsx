// src/components/city/CityPageClient.tsx
'use client';

import Link from 'next/link';
import SafeImage from '@/components/home/SafeImage';
import BrokerVerificationBadge from '@/components/badges/BrokerVerificationBadge';

import TruthCard from '@/components/truth/TruthCard';
import type { TruthCardData } from '@/lib/truth/truth.schema';

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

  // Optional (won’t break callers)
  tier?: 'TIER_0' | 'TIER_1' | 'TIER_2' | 'TIER_3';
  status?: 'LIVE' | 'TRACKING' | 'EXPANDING';
};

export type CityNavItem = {
  name: string;
  slug: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function safeAlt(city: CityPageCity) {
  const a = city.image?.alt?.trim();
  return a ? a : `${city.name} city view`;
}

// Temporary until DB: per-city verified supply count
const VERIFIED_SUPPLY_COUNT: Record<string, number> = {
  marbella: 0,
  benahavis: 0,
  estepona: 0,
  monaco: 0,
  dubai: 0,
  london: 0,
  // when you publish first verified listing, flip one to 1
};

// Temporary sample Truth Cards (only rendered when verified supply exists)
function sampleTruthCards(cityName: string): TruthCardData[] {
  return [
    {
      propertyId: `VNT-${cityName.toUpperCase().slice(0, 3)}-A1`,
      cityName,
      assetType: 'Villa',
      verificationStatus: 'verified',
      dataConfidence: 86,
      lastUpdatedISO: new Date().toISOString(),

      askingPrice: 3_950_000,
      currency: 'EUR',
      fairValueBand: { low: 3_600_000, mid: 3_820_000, high: 4_050_000 },
      pricingSignal: 'fair',
      deviationPct: +3,

      estimatedTimeToSellDays: { low: 35, high: 72 },
      liquidityScore: 78,
      demandPressure: 'high',
      buyerPoolDepth: 'deep',

      reductionProbabilityPct: 22,
      anomalyFlags: [],
      bedrooms: 5,
      bathrooms: 5,
      builtAreaSqm: 420,
      plotAreaSqm: 1200,
      primeAttributes: ['Sea views', 'Gated', 'Near golf'],
    },
    {
      propertyId: `VNT-${cityName.toUpperCase().slice(0, 3)}-B7`,
      cityName,
      assetType: 'Penthouse',
      verificationStatus: 'verified',
      dataConfidence: 74,
      lastUpdatedISO: new Date().toISOString(),

      askingPrice: 1_650_000,
      currency: 'EUR',
      fairValueBand: { low: 1_420_000, mid: 1_520_000, high: 1_670_000 },
      pricingSignal: 'overpriced',
      deviationPct: +9,

      estimatedTimeToSellDays: { low: 55, high: 110 },
      liquidityScore: 62,
      demandPressure: 'medium',
      buyerPoolDepth: 'normal',

      reductionProbabilityPct: 57,
      anomalyFlags: ['price drift', 'stale positioning'],
      bedrooms: 3,
      bathrooms: 3,
      builtAreaSqm: 185,
      plotAreaSqm: undefined,
      primeAttributes: ['Walk to centre', 'Terrace'],
    },
  ];
}

function StateBanner({
  title,
  subtitle,
  tone = 'neutral',
  cta,
}: {
  title: string;
  subtitle: string;
  tone?: 'neutral' | 'good' | 'warn' | 'violet';
  cta?: React.ReactNode;
}) {
  const cls =
    tone === 'good'
      ? 'border-emerald-400/18 bg-emerald-500/10'
      : tone === 'warn'
        ? 'border-amber-400/18 bg-amber-500/10'
        : tone === 'violet'
          ? 'border-violet-400/18 bg-violet-500/10'
          : 'border-white/10 bg-white/[0.03]';

  return (
    <div className={cx('relative overflow-hidden rounded-[26px] border p-5 shadow-[0_22px_70px_rgba(0,0,0,0.55)]', cls)}>
      <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(900px_260px_at_18%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">CITY STATE</div>
          <div className="mt-2 text-base font-medium text-zinc-100">{title}</div>
          <div className="mt-1 text-sm text-zinc-300">{subtitle}</div>
        </div>
        {cta ? <div className="shrink-0">{cta}</div> : null}
      </div>
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

  const tier = city.tier ?? 'TIER_3';
  const verifiedCount = VERIFIED_SUPPLY_COUNT[city.slug] ?? 0;

  const showVerifiedSupply = verifiedCount > 0;
  const showIntelligenceLocked = !showVerifiedSupply && (tier === 'TIER_0' || tier === 'TIER_1');

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-6">
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
              title={`Next city: ${next.name}`}
            >
              Next →
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
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
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">{city.name}</h1>

              <div className="text-sm text-zinc-300">
                <span className="text-zinc-200">{city.country}</span>
                {city.region ? <span className="text-zinc-400">{` · ${city.region}`}</span> : null}
                <span className="text-zinc-500">{` · ${city.tz}`}</span>
                <span className="text-zinc-600">{` · ${tier}`}</span>
              </div>

              {city.blurb ? <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-200">{city.blurb}</p> : null}
            </div>

            <div className="mt-6 h-px w-full bg-white/10" />

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/listings?city=${city.slug}`}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:border-white/20"
              >
                Browse listings
              </Link>

              <Link
                href={`/city/${city.slug}/luxury-real-estate`}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:border-white/20"
              >
                Luxury in {city.name}
              </Link>

              <Link
                href={`/sell?city=${encodeURIComponent(city.slug)}`}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-zinc-300 hover:border-white/20"
              >
                Publish verified listing
              </Link>
            </div>
          </div>
        </div>

        {/* CITY STATE LOGIC */}
        {showVerifiedSupply ? (
          <StateBanner
            tone="good"
            title="Verified supply only"
            subtitle="Listings are visible because verification is complete. Truth Cards render from audited signals."
            cta={
              <div className="flex items-center gap-2">
                <BrokerVerificationBadge status="verified" level="verified-broker" />
              </div>
            }
          />
        ) : showIntelligenceLocked ? (
          <StateBanner
            tone="violet"
            title="Intelligence active · Listings locked"
            subtitle="The intelligence layer is ready, but listings remain locked until verified supply exists in this city."
            cta={
              <Link
                href={`/sell?city=${encodeURIComponent(city.slug)}`}
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.06] px-5 py-2 text-xs font-semibold tracking-[0.14em] text-zinc-100 hover:bg-white/[0.09]"
              >
                Publish verified listing
              </Link>
            }
          />
        ) : (
          <StateBanner
            tone="neutral"
            title="Coverage expanding"
            subtitle="Market structure first. Verified listings appear only once integrity gates are live for this city."
            cta={
              <Link
                href={`/sell?city=${encodeURIComponent(city.slug)}`}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-xs font-semibold tracking-[0.14em] text-zinc-200 hover:bg-white/[0.06]"
              >
                Submit a listing
              </Link>
            }
          />
        )}

        {/* Truth Cards (only when verified supply exists) */}
        {showVerifiedSupply ? (
          <div className="grid gap-4">
            {sampleTruthCards(city.name).map((d) => (
              <TruthCard key={d.propertyId} data={d} onOpen={() => {}} />
            ))}
          </div>
        ) : (
          <div className="rounded-[26px] border border-white/10 bg-white/[0.02] p-5 text-sm text-zinc-300">
            <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">WHY LOCK</div>
            <div className="mt-2">
              Vantera does not show unverified supply. This prevents fake inventory, inflated pricing and marketing theatre.
              The moment the first verified listing is published, this city flips to <span className="text-zinc-100">Verified supply only</span>.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
