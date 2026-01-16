// src/components/home/PremiumBadgeRow.tsx
'use client';

export default function PremiumBadgeRow() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
        Private sellers
      </span>
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
        Verified layer
      </span>
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
        Miami first
      </span>
    </div>
  );
}
