// src/components/layout/PageShell.tsx
'use client';

import type { ReactNode } from 'react';

import TopBar from './TopBar';
import ProtocolStrip from './ProtocolStrip';
import Footer from './Footer';

export default function PageShell({
  children,
  fullBleedHero,
}: {
  children: ReactNode;
  fullBleedHero?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-56 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-white/10 blur-[140px]" />
        <div className="absolute top-24 left-10 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-220px] left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-white/5 blur-[160px]" />
      </div>

      <div className="relative">
        <TopBar />
        <ProtocolStrip />

        {/* full-bleed hero sits outside the constrained main */}
        {fullBleedHero ? fullBleedHero : null}

        <main className="relative mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
