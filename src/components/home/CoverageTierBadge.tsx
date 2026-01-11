// src/components/home/CoverageTierBadge.tsx
type CoverageTier = 'Core' | 'Plus' | 'Watchlist';

export default function CoverageTierBadge({ tier }: { tier: CoverageTier }) {
  const styles =
    tier === 'Core'
      ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-200'
      : tier === 'Plus'
      ? 'border-violet-300/20 bg-violet-400/10 text-violet-200'
      : 'border-white/10 bg-white/[0.04] text-zinc-200';

  const label = tier === 'Core' ? 'Core coverage' : tier === 'Plus' ? 'Plus coverage' : 'Watchlist';

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em]',
        styles,
      ].join(' ')}
    >
      {label.toUpperCase()}
    </span>
  );
}
