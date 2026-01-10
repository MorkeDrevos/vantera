// src/components/ComingSoon.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ComingSoon() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[#07080B] text-white">
      {/* Premium ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* deep vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_800px_at_50%_40%,rgba(255,255,255,0.06),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_80%_10%,rgba(120,76,255,0.16),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_0%,rgba(232,190,92,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.80))]" />

        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.60)_1px,transparent_0)] [background-size:26px_26px]" />

        {/* soft “light cone” */}
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_62%)] blur-2xl" />
      </div>

      <div className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        {/* Brand lockup */}
        <div className="relative">
          <div className="pointer-events-none absolute -inset-x-24 -inset-y-16 -z-10 rounded-[48px] bg-[radial-gradient(600px_240px_at_50%_40%,rgba(232,190,92,0.10),transparent_62%)] blur-2xl" />
          <div className="pointer-events-none absolute -inset-x-24 -inset-y-16 -z-10 rounded-[48px] bg-[radial-gradient(600px_240px_at_65%_30%,rgba(120,76,255,0.12),transparent_62%)] blur-2xl" />

          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              {/* If this file name differs, change it here */}
              <Image
                src="/brand/vantera-logo-dark.png"
                alt="Vantera"
                width={420}
                height={140}
                priority
                className="h-14 w-auto opacity-[0.96] sm:h-16"
              />
              {/* top glint */}
              <div className="pointer-events-none absolute -top-6 left-1/2 h-10 w-64 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.22),transparent_65%)] blur-lg" />
            </div>

            <div className="text-[11px] tracking-[0.34em] text-white/60">
              GLOBAL PROPERTY INTELLIGENCE
            </div>
          </div>
        </div>

        {/* Statement card */}
        <div className="mt-10 w-full max-w-xl">
          <div className="relative overflow-hidden rounded-[26px] border border-white/12 bg-white/[0.035] px-7 py-6 shadow-[0_40px_120px_rgba(0,0,0,0.75)]">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(820px_260px_at_20%_0%,rgba(255,255,255,0.07),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(820px_260px_at_85%_10%,rgba(120,76,255,0.12),transparent_60%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[11px] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[rgba(232,190,92,0.95)] shadow-[0_0_0_3px_rgba(232,190,92,0.12)]" />
                <span className="tracking-wide">Launching soon</span>
              </div>

              <div className="mt-4 text-balance text-xl font-medium leading-snug text-white/92 sm:text-2xl">
                Intelligence for the world&apos;s most valuable assets.
              </div>

              <div className="mt-3 text-sm leading-relaxed text-white/60">
                A private surface for high-value real estate - designed for clarity today, built for truth tomorrow.
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="group relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] px-5 py-3 text-sm text-white/90 shadow-[0_18px_60px_rgba(0,0,0,0.55)] transition hover:border-white/20 hover:bg-white/[0.10]"
          >
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(420px_140px_at_50%_0%,rgba(255,255,255,0.14),transparent_60%)]" />
            <span className="relative">Refresh</span>
          </Link>

          <Link
            href="/"
            className="rounded-2xl border border-white/10 bg-black/30 px-5 py-3 text-sm text-white/70 transition hover:bg-black/20 hover:text-white/80"
          >
            Home
          </Link>
        </div>

        {/* Footer line */}
        <div className="mt-14 text-[11px] tracking-[0.22em] text-white/40">
          © {new Date().getFullYear()} VANTERA
        </div>
      </div>
    </main>
  );
}
