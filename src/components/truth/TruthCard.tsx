// src/components/truth/TruthCard.tsx
'use client';

import { ShieldCheck, Info, TrendingDown, TrendingUp, Timer, Sparkles } from 'lucide-react';

export type TruthCardStatus = 'verified' | 'pending' | 'restricted';

export type PricingSignal = 'undervalued' | 'fair' | 'overpriced';
export type DemandPressure = 'low' | 'medium' | 'high';

export type TruthCardData = {
  // Identity
  propertyId: string;
  cityName: string;
  assetType: string; // villa, apartment, etc
  verificationStatus: TruthCardStatus;
  dataConfidence: number; // 0-100
  lastUpdatedISO: string;

  // Market position
  askingPrice?: number; // optional
  currency: string; // "EUR"
  fairValueBand: { low: number; mid: number; high: number };
  pricingSignal: PricingSignal;
  deviationPct: number; // eg +12 means asking is 12% above fair mid (if asking exists)

  // Liquidity
  estimatedTimeToSellDays: { low: number; high: number };
  liquidityScore: number; // 0-100
  demandPressure: DemandPressure;
  buyerPoolDepth: 'thin' | 'normal' | 'deep';

  // Risk
  reductionProbabilityPct?: number;
  anomalyFlags?: string[]; // "price drift", etc

  // DNA
  bedrooms?: number;
  bathrooms?: number;
  builtAreaSqm?: number;
  plotAreaSqm?: number;
  primeAttributes?: string[];
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}

function formatPct(x: number) {
  const s = Math.abs(x).toFixed(0);
  return `${x >= 0 ? '+' : '-'}${s}%`;
}

function ConfidencePill({ v }: { v: number }) {
  const tone =
    v >= 85 ? 'border-emerald-400/18 bg-emerald-500/10 text-emerald-100' :
    v >= 65 ? 'border-white/12 bg-white/[0.04] text-zinc-200' :
    'border-amber-400/18 bg-amber-500/10 text-amber-100';

  return (
    <span className={cx(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] leading-none backdrop-blur-xl',
      tone
    )}>
      <Sparkles className="h-3.5 w-3.5 opacity-80" />
      <span className="font-semibold tracking-[0.16em]">{v}</span>
      <span className="text-zinc-400/80">/100</span>
    </span>
  );
}

function StatusPill({ status }: { status: TruthCardStatus }) {
  const cfg =
    status === 'verified'
      ? { label: 'Verified', cls: 'border-emerald-400/18 bg-emerald-500/10 text-emerald-100' }
      : status === 'pending'
      ? { label: 'Pending', cls: 'border-white/12 bg-white/[0.04] text-zinc-200' }
      : { label: 'Restricted', cls: 'border-amber-400/18 bg-amber-500/10 text-amber-100' };

  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] leading-none', cfg.cls)}>
      <ShieldCheck className="h-3.5 w-3.5 opacity-80" />
      <span className="font-semibold tracking-[0.18em]">{cfg.label.toUpperCase()}</span>
    </span>
  );
}

function SignalPill({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'good' | 'warn' | 'violet' }) {
  const base = 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] leading-none backdrop-blur-xl';
  const cls =
    tone === 'good'
      ? 'border-emerald-400/18 bg-emerald-500/10 text-emerald-100'
      : tone === 'warn'
      ? 'border-amber-400/18 bg-amber-500/10 text-amber-100'
      : tone === 'violet'
      ? 'border-violet-400/18 bg-violet-500/10 text-violet-100'
      : 'border-white/10 bg-white/[0.03] text-zinc-200';

  return <span className={cx(base, cls)}>{label}</span>;
}

export default function TruthCard({
  data,
  compact = false,
  onOpen,
}: {
  data: TruthCardData;
  compact?: boolean;
  onOpen?: () => void;
}) {
  const priceBand = `${formatMoney(data.fairValueBand.low, data.currency)} - ${formatMoney(
    data.fairValueBand.high,
    data.currency
  )}`;

  const pricingTone =
    data.pricingSignal === 'undervalued' ? 'good' :
    data.pricingSignal === 'overpriced' ? 'warn' :
    'neutral';

  const pricingLabel =
    data.pricingSignal === 'undervalued' ? 'Undervalued' :
    data.pricingSignal === 'overpriced' ? 'Overpriced' :
    'Fair value';

  const demandTone =
    data.demandPressure === 'high' ? 'good' :
    data.demandPressure === 'low' ? 'warn' :
    'neutral';

  const buyerPoolLabel =
    data.buyerPoolDepth === 'deep' ? 'Buyer pool: deep' :
    data.buyerPoolDepth === 'thin' ? 'Buyer pool: thin' :
    'Buyer pool: normal';

  const hasFlags = (data.anomalyFlags?.length ?? 0) > 0;

  return (
    <section
      className={cx(
        'relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.02]',
        'shadow-[0_34px_110px_rgba(0,0,0,0.55)]',
        'transition hover:border-white/14',
        compact ? 'p-5' : 'p-6'
      )}
    >
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_18%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_86%_10%,rgba(120,76,255,0.10),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">PROPERTY TRUTH CARD</div>
            <div className="mt-2 text-base font-medium text-zinc-100">
              {data.assetType} in {data.cityName}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              ID <span className="font-mono text-zinc-400">{data.propertyId}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <StatusPill status={data.verificationStatus} />
            <ConfidencePill v={data.dataConfidence} />
          </div>
        </div>

        {/* Fair value band (hero) */}
        <div className="mt-5 grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-[26px] border border-white/10 bg-black/25 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.55)]">
              <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">FAIR VALUE BAND</div>
              <div className="mt-2 text-balance text-2xl font-semibold tracking-[-0.02em] text-zinc-50">
                {priceBand}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <SignalPill label={pricingLabel} tone={pricingTone as any} />
                {typeof data.askingPrice === 'number' ? (
                  <SignalPill
                    label={`Asking: ${formatMoney(data.askingPrice, data.currency)} (${formatPct(data.deviationPct)})`}
                    tone={data.deviationPct > 8 ? 'warn' : data.deviationPct < -8 ? 'good' : 'neutral'}
                  />
                ) : (
                  <SignalPill label="Asking price: not primary" tone="neutral" />
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[26px] border border-white/10 bg-black/25 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.55)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">LIQUIDITY</div>
                  <div className="mt-2 text-lg font-semibold text-zinc-100">{data.liquidityScore}/100</div>
                </div>
                <Timer className="mt-0.5 h-5 w-5 text-zinc-400" />
              </div>

              <div className="mt-3 text-sm text-zinc-300">
                Estimated time-to-sell: <span className="font-medium text-zinc-100">{data.estimatedTimeToSellDays.low}-{data.estimatedTimeToSellDays.high} days</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <SignalPill label={`Demand: ${data.demandPressure}`} tone={demandTone as any} />
                <SignalPill label={buyerPoolLabel} tone={data.buyerPoolDepth === 'deep' ? 'good' : data.buyerPoolDepth === 'thin' ? 'warn' : 'neutral'} />
              </div>
            </div>
          </div>
        </div>

        {/* Risk + DNA */}
        <div className="mt-4 grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">RISK + INTEGRITY</div>
                  <div className="mt-2 text-sm text-zinc-300">
                    Calm, factual risk surface. No theatre.
                  </div>
                </div>
                {hasFlags ? <Info className="mt-0.5 h-5 w-5 text-amber-200/80" /> : <Info className="mt-0.5 h-5 w-5 text-zinc-500" />}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {typeof data.reductionProbabilityPct === 'number' ? (
                  <SignalPill
                    label={`Reduction probability: ${data.reductionProbabilityPct.toFixed(0)}%`}
                    tone={data.reductionProbabilityPct >= 55 ? 'warn' : data.reductionProbabilityPct <= 25 ? 'good' : 'neutral'}
                  />
                ) : (
                  <SignalPill label="Reduction probability: model warming" tone="neutral" />
                )}

                {hasFlags ? (
                  data.anomalyFlags!.slice(0, 3).map((f) => <SignalPill key={f} label={`Flag: ${f}`} tone="warn" />)
                ) : (
                  <SignalPill label="No anomaly flags" tone="good" />
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.02] p-5">
              <div className="text-[10px] font-semibold tracking-[0.22em] text-zinc-500">ASSET DNA</div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-[13px] text-zinc-200">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  Beds: <span className="text-zinc-100">{data.bedrooms ?? '-'}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  Baths: <span className="text-zinc-100">{data.bathrooms ?? '-'}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  Built: <span className="text-zinc-100">{data.builtAreaSqm ? `${data.builtAreaSqm} sqm` : '-'}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                  Plot: <span className="text-zinc-100">{data.plotAreaSqm ? `${data.plotAreaSqm} sqm` : '-'}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(data.primeAttributes ?? []).slice(0, 6).map((a) => (
                  <SignalPill key={a} label={a} tone="violet" />
                ))}
                {(data.primeAttributes ?? []).length === 0 ? (
                  <div className="text-xs text-zinc-500">Prime attributes appear once verified supply is ingested.</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-500">
            Truth Card · Updated <span className="text-zinc-400">{new Date(data.lastUpdatedISO).toLocaleDateString()}</span>
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-200 transition hover:bg-white/[0.06] hover:border-white/14"
          >
            Open intelligence
            {data.pricingSignal === 'undervalued' ? (
              <TrendingUp className="h-4 w-4 opacity-80" />
            ) : data.pricingSignal === 'overpriced' ? (
              <TrendingDown className="h-4 w-4 opacity-80" />
            ) : (
              <Info className="h-4 w-4 opacity-80" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
