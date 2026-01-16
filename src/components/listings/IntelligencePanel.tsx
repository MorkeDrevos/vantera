// src/components/listings/IntelligencePanel.tsx
import type { Listing } from '@prisma/client';

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function estimateRange(price: number, confidence?: number | null) {
  const c = confidence == null ? 50 : clamp(confidence, 0, 100);

  // High confidence => tighter band
  // 90 => +-6%
  // 60 => +-12%
  // 30 => +-20%
  const pct = clamp(0.24 - (c / 100) * 0.20, 0.06, 0.24);

  const lo = Math.round(price * (1 - pct));
  const hi = Math.round(price * (1 + pct));
  return { lo, hi, pct };
}

export default function IntelligencePanel({ listing }: { listing: Listing }) {
  const currency = (listing.currency || 'EUR').toUpperCase();
  const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

  const hasPrice = typeof listing.price === 'number' && listing.price > 0;
  const range = hasPrice ? estimateRange(listing.price!, listing.priceConfidence) : null;

  const conf = listing.priceConfidence ?? null;
  const completeness = listing.dataCompleteness ?? null;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-[12px] uppercase tracking-[0.16em] text-white/55">Intelligence</div>
          <div className="mt-2 text-[16px] font-medium text-white/85">Vantera signal brief</div>
        </div>

        <span className="inline-flex items-center rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/70">
          Source {(listing.source || 'manual').toUpperCase()}
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="text-[11px] uppercase tracking-[0.16em] text-white/55">Indicative range</div>
        <div className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-white">
          {range ? (
            <>
              {currency} {fmt.format(range.lo)} - {fmt.format(range.hi)}
            </>
          ) : (
            <span className="text-white/80">Pending valuation</span>
          )}
        </div>

        <div className="mt-3 text-sm leading-6 text-white/70">
          Calm, private estimate derived from available signals. This tightens as verification, media and market depth
          improve.
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Metric label="Price confidence" value={conf != null ? `${conf}/100` : 'Pending'} />
        <Metric label="Data completeness" value={completeness != null ? `${completeness}/100` : 'Pending'} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.16em] text-white/55">{label}</div>
      <div className="mt-1 text-[15px] font-medium text-white/85">{value}</div>
    </div>
  );
}
