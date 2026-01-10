// src/components/ComingSoon.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ComingSoon() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[#07080B] text-white">
      {/* Backdrop: vignette + corners + grain (quieter, more premium) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* center glow */}
        <div className="absolute inset-0 bg-[radial-gradient(980px_560px_at_50%_44%,rgba(255,255,255,0.045),transparent_70%)]" />

        {/* corner tints (subtle purple like your photo) */}
        <div className="absolute -top-44 -right-44 h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.12),transparent_66%)] blur-3xl" />
        <div className="absolute -bottom-52 -left-52 h-[820px] w-[820px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.10),transparent_68%)] blur-3xl" />

        {/* dark falloff */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.20),rgba(0,0,0,0.92))]" />

        {/* very light grain */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.40)_1px,transparent_0)] [background-size:26px_26px]" />

        {/* very faint diagonal streaks (less loud) */}
        <div className="absolute inset-0 opacity-[0.06] [background:repeating-linear-gradient(115deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_1px,transparent_12px,transparent_26px)]" />
      </div>

      <div className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        {/* Brand block (logo should be center of attention) */}
        <div className="flex flex-col items-center pt-4 sm:pt-8">
          <div className="relative">
            {/* top glow, tighter and more controlled */}
            <div className="pointer-events-none absolute left-1/2 top-[-160px] h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.11),transparent_72%)] blur-3xl" />

            {/* BIGGER logo */}
            <Image
              src="/brand/vantera-logo-dark.png"
              alt="Vantera"
              width={1600}
              height={480}
              priority
              className="
                relative
                h-28 w-auto
                opacity-[0.99]
                sm:h-36
                md:h-44
                lg:h-52
              "
            />
          </div>

          {/* Keep ONLY one subtitle line (remove the duplicate) */}
          <div className="mt-3 text-[11px] tracking-[0.34em] text-white/55 sm:text-[12px]">
            GLOBAL PROPERTY INTELLIGENCE
          </div>
        </div>

        {/* Plaque (no big white border, feels like a caption not UI) */}
        <div className="mt-10 w-full max-w-[860px]">
          <div
            className="
              relative overflow-hidden
              rounded-[22px]
              bg-black/45
              px-7 py-7
              shadow-[0_30px_95px_rgba(0,0,0,0.72)]
              sm:px-12 sm:py-9
            "
          >
            {/* ultra-thin edge (hairline), not a border */}
            <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-white/[0.06]" />

            {/* tiny highlight sweep (subtle) */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background:linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.10)_44%,transparent_66%)]" />

            {/* soft inner haze at top (museum glass feel) */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent)]" />

            <div className="relative text-balance text-xl font-semibold text-white/92 sm:text-2xl">
              Intelligence for the world’s most valuable assets.
            </div>

            <div className="relative mt-4 text-[11px] tracking-[0.46em] text-white/50">
              LAUNCHING SOON
            </div>
          </div>
        </div>

        {/* Actions (more subtle, less loud) */}
        <div className="mt-7 flex items-center gap-3">
          <Link
            href="/"
            className="rounded-2xl border border-white/[0.10] bg-white/[0.03] px-5 py-3 text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white/90"
          >
            Refresh
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-white/[0.08] bg-black/20 px-5 py-3 text-sm text-white/45 transition hover:bg-black/30 hover:text-white/70"
          >
            Home
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-14 text-[11px] tracking-[0.22em] text-white/30">
          © {new Date().getFullYear()} Vantera
        </div>
      </div>
    </main>
  );
}
