// src/components/ComingSoon.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ComingSoon() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[#07080B] text-white">
      {/* Backdrop: vignette + corners + grain */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* center glow */}
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_46%,rgba(255,255,255,0.050),transparent_68%)]" />

        {/* corner tints (subtle purple like your photo) */}
        <div className="absolute -top-40 -right-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.16),transparent_62%)] blur-3xl" />
        <div className="absolute -bottom-44 -left-44 h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.12),transparent_62%)] blur-3xl" />

        {/* dark falloff */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(0,0,0,0.90))]" />

        {/* very light grain */}
        <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:24px_24px]" />

        {/* faint diagonal streaks (gives that “lens / dust” feel) */}
        <div className="absolute inset-0 opacity-[0.10] [background:repeating-linear-gradient(115deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_1px,transparent_10px,transparent_22px)]" />
      </div>

      <div className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        {/* Top brand block (like your screenshot) */}
        <div className="flex flex-col items-center">
          {/* small logo + subtle top glow */}
          <div className="relative">
            <div className="pointer-events-none absolute left-1/2 top-[-46px] h-32 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_68%)] blur-2xl" />
            <Image
              src="/brand/vantera-logo-dark.png"
              alt="Vantera"
              width={520}
              height={180}
              priority
              className="relative h-12 w-auto opacity-[0.97] sm:h-14"
            />
          </div>

          {/* small subtitle under logo (tight) */}
          <div className="mt-1 text-[9px] tracking-[0.28em] text-white/55">
            GLOBAL PROPERTY INTELLIGENCE
          </div>

          {/* big line (your screenshot’s main anchor) */}
          <div className="mt-7 text-[12px] tracking-[0.42em] text-white/70 sm:text-[13px]">
            GLOBAL PROPERTY INTELLIGENCE
          </div>
        </div>

        {/* Plaque */}
        <div className="mt-10 w-full max-w-[720px]">
          <div className="relative overflow-hidden rounded-[18px] border border-white/18 bg-white/[0.035] px-7 py-6 shadow-[0_26px_110px_rgba(0,0,0,0.72)] sm:px-10 sm:py-7">
            {/* soft inner edge */}
            <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-white/10" />
            {/* tiny highlight sweep */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background:linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.10)_42%,transparent_64%)]" />

            <div className="relative text-balance text-lg font-semibold text-white/90 sm:text-xl">
              Intelligence for the world’s most valuable assets.
            </div>

            <div className="relative mt-3 text-[11px] tracking-[0.40em] text-white/55">
              LAUNCHING SOON
            </div>
          </div>
        </div>

        {/* Actions (optional, keep subtle) */}
        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/"
            className="rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-white/70 transition hover:bg-white/[0.07] hover:text-white/85"
          >
            Refresh
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm text-white/45 transition hover:bg-black/30 hover:text-white/65"
          >
            Home
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-14 text-[11px] tracking-[0.22em] text-white/35">
          © {new Date().getFullYear()} Vantera
        </div>
      </div>
    </main>
  );
}
