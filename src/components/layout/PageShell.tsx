// src/components/layout/PageShell.tsx
'use client';

import type { ReactNode } from 'react';
import { Suspense } from 'react';

import TopBar from './TopBar';
import Footer from './Footer';

type PageShellProps = {
  children?: ReactNode;

  // Full-bleed hero band rendered under TopBar
  fullBleedHero?: ReactNode;

  // If true, we skip constrained <main> spacing
  heroOnly?: boolean;

  // Optional body width override
  bodyMaxWidthClassName?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

// True full-bleed breakout (viewport width) - safe + production proven
const FULL_BLEED = 'w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]';

export default function PageShell({
  children,
  fullBleedHero,
  heroOnly = false,
  bodyMaxWidthClassName = 'max-w-[1200px]',
}: PageShellProps) {
  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-[color:var(--paper)] text-[color:var(--ink)]">
      {/* Global paper stage */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(252,251,249,1)_55%,rgba(249,248,246,1)_100%)]" />
        <div className="absolute -top-[520px] left-1/2 h-[980px] w-[1600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(231,201,130,0.20),transparent_66%)] blur-3xl" />
        <div className="absolute -top-[560px] right-[-520px] h-[980px] w-[980px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06),transparent_68%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      {/* isolate prevents weird blend/stacking issues when hero uses heavy overlays */}
      <div className="relative isolation-isolate">
        <Suspense fallback={null}>
          <TopBar />
        </Suspense>

        {/* TRUE FULL-BLEED HERO WRAPPER */}
        {fullBleedHero ? <div className={cx('relative overflow-hidden', FULL_BLEED)}>{fullBleedHero}</div> : null}

        {!heroOnly ? (
          <main className={cx('relative mx-auto w-full px-5 pb-16 sm:px-8', bodyMaxWidthClassName)}>{children}</main>
        ) : children ? (
          <div className="relative">{children}</div>
        ) : null}

        <Footer />
      </div>
    </div>
  );
}
