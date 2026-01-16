// src/components/listings/PremiumBadgeRow.tsx
import type { Listing } from '@prisma/client';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'gold' | 'violet' }) {
  const base =
    'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em]';
  const cls =
    tone === 'gold'
      ? 'border-[#d7b86a]/30 bg-[#d7b86a]/10 text-[#f4e1a6]'
      : tone === 'violet'
        ? 'border-violet-300/20 bg-violet-500/10 text-violet-200'
        : 'border-white/10 bg-white/[0.03] text-white/70';

  return <span className={cx(base, cls)}>{children}</span>;
}

export default function PremiumBadgeRow({ listing }: { listing: Listing }) {
  const source = (listing.source || 'manual').toUpperCase();
  const status = listing.status;
  const visibility = listing.visibility;

  const completeness = listing.dataCompleteness ?? null;
  const conf = listing.priceConfidence ?? null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Pill tone="gold">Vantera Intelligence</Pill>
      <Pill>{status}</Pill>
      <Pill>{visibility}</Pill>
      <Pill>Source {source}</Pill>
      <Pill tone={conf != null && conf >= 70 ? 'violet' : 'neutral'}>
        Price confidence {conf != null ? `${conf}/100` : 'pending'}
      </Pill>
      <Pill tone={completeness != null && completeness >= 75 ? 'violet' : 'neutral'}>
        Data completeness {completeness != null ? `${completeness}/100` : 'pending'}
      </Pill>
    </div>
  );
}
