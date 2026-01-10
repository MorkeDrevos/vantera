// src/components/ComingSoon.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ComingSoon() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[#07080B] text-white">
      {/* Ultra-quiet luxury backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* deep vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_42%,rgba(255,255,255,0.045),transparent_68%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(720px_420px_at_70%_18%,rgba(120,76,255,0.08),transparent_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.88))]" />
      </div>

      <div className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center px-6 text-center">
        {/* LOGO — PRIMARY FOCAL POINT */}
        <div className="relative">
          {/* halo behind logo only */}
          <div className="pointer-events-none absolute left-1/2 top-[-120px] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)] blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-[-110px] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(232,190,92,0.06),transparent_74%)] blur-3xl" />

          <Image
            src="/brand/vantera-logo-dark.png"
            alt="Vantera"
            width={1400}
            height={420}
            priority
            className="relative z-10 h-28 w-auto opacity-[0.97] sm:h-32 md:h-40 lg:h-48"
          />
        </div>

        {/* BRAND LINE — VERY QUIET */}
        <div className="mt-6 text-[11px] tracking-[0.38em] text-white/45">
          GLOBAL PROPERTY INTELLIGENCE
        </div>

        {/* STATEMENT — SECONDARY, NOT HERO */}
        <div className="mt-12 w-full max-w-[520px]">
          <div className="relative rounded-[22px] border border-white/10 bg-white/[0.025] px-7 py-6 shadow-[0_28px_100px_rgba(0,0,0,0.75)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

            <div className="text-[11px] tracking-[0.32em] text-white/55">
              LAUNCHING SOON
            </div>

            <div className="mt-4 text-balance text-[20px] font-medium leading-snug text-white/88 sm:text-[22px]">
              Intelligence for the world’s most valuable assets.
            </div>

            <div className="mt-3 text-sm leading-relaxed text-white/50">
              A private surface for high-value real estate, built for clarity today and truth tomorrow.
            </div>
          </div>
        </div>

        {/* ACTIONS — VERY SUBDUED */}
        <div className="mt-8 flex items-center gap-3">
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

        {/* FOOTER */}
        <div className="mt-14 text-[11px] tracking-[0.26em] text-white/30">
          © {new Date().getFullYear()} VANTERA
        </div>
      </div>
    </main>
  );
}
