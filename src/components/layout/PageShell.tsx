// src/components/layout/PageShell.tsx
'use client';

import type { ReactNode } from 'react';

import TopBar from './TopBar';
import ProtocolStrip from './ProtocolStrip';
import Footer from './Footer';

type PageShellProps = {
  children?: ReactNode;

  // Full-bleed hero band rendered under TopBar + ProtocolStrip
  fullBleedHero?: ReactNode;

  // If true, we skip the constrained <main> spacing (useful for hero-driven pages like city)
  heroOnly?: boolean;

  // Optional: override default body container width (homepage uses max-w-6xl, hero uses max-w-7xl)
  bodyMaxWidthClassName?: string;
};

export default function PageShell({
  children,
  fullBleedHero,
  heroOnly = false,
  bodyMaxWidthClassName = 'max-w-6xl',
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Ambient background (global) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* soft white halos */}
        <div className="absolute -top-56 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-white/10 blur-[160px]" />
        <div className="absolute bottom-[-260px] left-1/2 h-[680px] w-[1200px] -translate-x-1/2 rounded-full bg-white/5 blur-[180px]" />

        {/* Vantera gold aura (royal, not loud) */}
        <div className="absolute top-28 left-10 h-[520px] w-[520px] rounded-full bg-amber-400/10 blur-[150px]" />
        <div className="absolute -top-10 right-[-120px] h-[520px] w-[520px] rounded-full bg-amber-300/8 blur-[170px]" />

        {/* subtle gilded veil */}
        <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_18%_6%,rgba(251,191,36,0.10),transparent_60%),radial-gradient(900px_540px_at_82%_18%,rgba(255,255,255,0.06),transparent_62%),radial-gradient(900px_520px_at_50%_92%,rgba(251,191,36,0.07),transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/35" />
      </div>

      <div className="relative">
        <TopBar />
        <ProtocolStrip />

        {/* subtle spacer + separator so hero doesn't feel glued to the strip */}
        {fullBleedHero ? (
          <div className="relative">
            <div className="h-5 sm:h-7" />
            {fullBleedHero}
          </div>
        ) : null}

        {/* If hero-only page, do not inject a big constrained main */}
        {!heroOnly ? (
          <main className={`relative mx-auto w-full ${bodyMaxWidthClassName} px-5 pb-16 sm:px-8`}>
            {children}
          </main>
        ) : (
          children ? <div className="relative">{children}</div> : null
        )}

        <Footer />
      </div>
    </div>
  );
}
