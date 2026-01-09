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
        <div className="absolute -top-56 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-white/10 blur-[140px]" />
        <div className="absolute top-24 left-10 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-220px] left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-white/5 blur-[160px]" />
      </div>

      <div className="relative">
        <TopBar />
        <ProtocolStrip />

        {/* subtle spacer + separator so hero doesn't feel glued to the strip */}
        {fullBleedHero ? (
          <div className="relative">
            <div className="h-4 sm:h-6" />
            {fullBleedHero}
          </div>
        ) : null}

        {/* If hero-only page, do not inject a big constrained main */}
        {!heroOnly ? (
          <main className={`relative mx-auto w-full ${bodyMaxWidthClassName} px-5 pb-16 sm:px-8`}>
            {children}
          </main>
        ) : (
          // still allow children if passed, but no forced padding/container
          children ? <div className="relative">{children}</div> : null
        )}

        <Footer />
      </div>
    </div>
  );
}
