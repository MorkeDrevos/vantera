// src/components/home/CoverageTierBadge.tsx
import { coverageTierLabel } from './coverageTiers';
import type { CoverageTier } from './cities';

function toneForTier(tier: CoverageTier) {
  if (tier === 'TIER_0') return 'border-emerald-300/20 bg-emerald-400/10 text-emerald-200';
  if (tier === 'TIER_1') return 'border-violet-300/20 bg-violet-400/10 text-violet-200';
  if (tier === 'TIER_2') return 'border-white/10 bg-white/[0.04] text-zinc-200';
  return 'border-white/10 bg-white/[0.03] text-zinc-300';
}

export default function CoverageTierBadge({ tier }: { tier: CoverageTier }) {
  const styles = toneForTier(tier);
  const label = coverageTierLabel(tier);

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em]',
        styles,
      ].join(' ')}
      aria-label={`Coverage ${label}`}
    >
      {label.toUpperCase()}
    </span>
  );
}
