// src/app/operations/layout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export default function OperationsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-black text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="text-xs tracking-[0.22em] text-zinc-400">VANTERA</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Operations</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-300/90">
              Internal tools for monitoring pipelines and keeping data quality tight.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className={cx(
                'inline-flex items-center justify-center rounded-xl border border-white/10',
                'bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 hover:bg-white/[0.06]',
                'transition'
              )}
            >
              Back to site
            </Link>

            <Link
              href="/operations/imports"
              className={cx(
                'inline-flex items-center justify-center rounded-xl border border-white/10',
                'bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 hover:bg-white/[0.06]',
                'transition'
              )}
            >
              Imports
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
          {children}
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Tip: later we’ll gate this by role (superadmin) and log everything in Prisma.
        </div>
      </div>
    </div>
  );
}
