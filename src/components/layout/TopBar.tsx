// src/components/layout/TopBar.tsx
'use client';

import Link from 'next/link';

export default function TopBar({
  pills = ['Buyer-first', 'No portal logic', 'Reality over hype'],
}: {
  pills?: string[];
}) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
      <Link href="/" className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <div className="h-4 w-4 rounded-full bg-emerald-300/80" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide text-zinc-100">
            Locus
          </div>
          <div className="text-xs text-zinc-400">
            Truth-first real estate intelligence
          </div>
        </div>
      </Link>

      <div className="hidden items-center gap-2 sm:flex">
        {pills.map((p) => (
          <span
            key={p}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
          >
            {p}
          </span>
        ))}
      </div>
    </header>
  );
}
