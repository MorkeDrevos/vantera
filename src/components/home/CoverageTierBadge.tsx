// src/components/home/CoverageTierBadge.tsx
'use client';

import type { CoverageTier } from './coverageTiers';
import { coverageTierLabel } from './coverageTiers';

export default function CoverageTierBadge({
  tier,
  className = '',
}: {
  tier: CoverageTier;
  className?: string;
}) {
  const base =
    'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] leading-none backdrop-blur-xl';

  const cls =
    tier === 'core'
      ? 'border-white/16 bg-white/[0.06] text-zinc-100'
      : tier === 'expanded'
        ? 'border-violet-400/18 bg-violet-500/10 text-violet-100/95'
        : 'border-white/10 bg-white/[0.03] text-zinc-200/90';

  return (
    <span className={`${base} ${cls} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.10)]" />
      <span className="font-semibold tracking-[0.14em]">{coverageTierLabel(tier).toUpperCase()}</span>
    </span>
  );
}
