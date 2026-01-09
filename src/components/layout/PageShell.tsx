// src/components/layout/PageShell.tsx
'use client';

import type { ReactNode } from 'react';

import TopBar from './TopBar';
import Footer from './Footer';

type PageShellProps = {
  children: ReactNode;

  /** Optional: use when a page wants a full-bleed hero section */
  fullBleedHero?: ReactNode;

  /** Optional: small badges shown in the TopBar (desktop) */
  pills?: string[];
};

export default function PageShell({
  children,
  fullBleedHero,
  pills = ['Buyer-first', 'No portal logic', 'Reality over hype'],
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Ambient premium background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-56 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-white/10 blur-[140px]" />
        <div className="absolute top-24 left-10 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-220px] left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-white/5 blur-[160px]" />
      </div>

      <div className="relative">
        <TopBar pills={pills} />

        {/* Full-bleed hero section (optional) */}
        {fullBleedHero ? <div className="relative">{fullBleedHero}</div> : null}

        {/* Default constrained content */}
        <main className="relative mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
