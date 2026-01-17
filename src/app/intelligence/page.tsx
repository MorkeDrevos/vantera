// src/app/intelligence/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Explore Intelligence · Vantera',
  robots: { index: false, follow: false },
};

export default function IntelligencePage() {
  return (
    <main className="relative min-h-[calc(100vh-1px)] overflow-hidden bg-[color:var(--bg)]">
      {/* Ambient royal backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.08),transparent_72%)] blur-2xl" />
        <div className="absolute -bottom-56 left-1/2 h-[640px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,214,102,0.08),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_30%,rgba(0,0,0,0.22))]" />
        <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        {/* Top utility row */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 backdrop-blur-md transition hover:border-white/16 hover:bg-white/[0.06]"
          >
            <ArrowLeft className="h-4 w-4 opacity-80 transition group-hover:-translate-x-0.5" />
            Back
          </Link>

          <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/75 backdrop-blur-md sm:inline-flex">
            <Sparkles className="h-4 w-4 opacity-80" />
            Private intelligence layer
          </div>
        </div>

        {/* Center stage */}
        <div className="mt-10 grid place-items-center sm:mt-14">
          <div className="w-full max-w-3xl">
            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.05] backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.40)]">
              {/* subtle inner sheen */}
              <div className="pointer-events-none absolute inset-0 opacity-80">
                <div className="absolute -top-24 left-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_68%)] blur-2xl" />
                <div className="absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,214,102,0.14),transparent_70%)] blur-2xl" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%,rgba(255,255,255,0.02))]" />
              </div>

              {/* the exact “button-like” header from your screenshot */}
              <div className="relative p-5 sm:p-6">
                <div className="rounded-2xl border border-black/10 bg-white px-6 py-6 text-center shadow-[0_20px_55px_rgba(0,0,0,0.12)]">
                  <h1 className="text-2xl font-semibold tracking-[-0.02em] text-black sm:text-3xl">
                    Explore intelligence (soon)
                  </h1>
                </div>

                <div className="mt-6 text-center">
                  <p className="mx-auto max-w-xl text-sm leading-6 text-white/70 sm:text-[15px]">
                    This is where Vantera’s market signals, pricing confidence, liquidity heatmaps, and risk flags will
                    live. For now it’s a clean placeholder that looks intentional.
                  </p>

                  <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      href="/search"
                      className="inline-flex items-center justify-center rounded-2xl border border-white/14 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white/90 backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      Browse listings
                    </Link>

                    <Link
                      href="/"
                      className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-transparent px-5 py-3 text-sm font-medium text-white/75 transition hover:border-white/16 hover:bg-white/[0.04]"
                    >
                      Return home
                    </Link>
                  </div>
                </div>
              </div>

              {/* hairline footer */}
              <div className="relative border-t border-white/10 px-5 py-4 text-center text-xs text-white/55 sm:px-6">
                Intelligence modules are being wired to verified data sources and audit trails.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
