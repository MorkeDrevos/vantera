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

/**
 * PageShell responsibility (keep it strict):
 * - Global chrome (TopBar + Footer)
 * - Optional FULL-BLEED hero band (true edge-to-edge)
 * - Constrained page body (content)
 *
 * NOTE:
 * - Do NOT paint global backgrounds here.
 * - Global paper, glows, and typography belong in src/app/globals.css (body).
 */
export default function PageShell({
  children,
  fullBleedHero,
  heroOnly = false,
  bodyMaxWidthClassName = 'max-w-[1200px]',
}: PageShellProps) {
  return (
    <div className="min-h-[100dvh] text-[color:var(--ink)]">
      <div className="relative">
        <Suspense fallback={null}>
          <TopBar />
        </Suspense>

        {/* True full-bleed hero band (never boxed by containers) */}
        {fullBleedHero ? (
          <section className="relative">
            {/* Force 100vw even if any ancestor ever becomes constrained */}
            <div className="relative left-1/2 w-screen -translate-x-1/2">
              {fullBleedHero}
            </div>
          </section>
        ) : null}

        {!heroOnly ? (
          <main className={cx('relative mx-auto w-full px-5 pb-16 sm:px-8', bodyMaxWidthClassName)}>
            {children}
          </main>
        ) : children ? (
          <div className="relative">{children}</div>
        ) : null}

        <Footer />
      </div>
    </div>
  );
}
