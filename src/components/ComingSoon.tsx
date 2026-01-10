// src/components/ComingSoon.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ComingSoon() {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[#07080B] text-white">
      {/* Quiet luxury backdrop: single light source, no grid, softer vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* base vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_42%,rgba(255,255,255,0.055),transparent_64%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(720px_420px_at_70%_22%,rgba(120,76,255,0.09),transparent_66%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(720px_420px_at_30%_18%,rgba(232,190,92,0.06),transparent_68%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.86))]" />

        {/* ultra subtle film grain */}
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] [background-size:64px_64px]" />
      </div>

      <div className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        {/* Brand */}
        <div className="relative">
          {/* restrained halo behind mark */}
          <div className="pointer-events-none absolute left-1/2 top-[-40px] h-[220px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_68%)] blur-2xl" />
          <div className="pointer-events-none absolute left-1/2 top-[-30px] h-[220px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(232,190,92,0.05),transparent_72%)] blur-2xl" />

          <div className="flex flex-col items-center gap-4">
            <Image
              src="/brand/vantera-logo-dark.png"
              alt="Vantera"
              width={1100}
              height={320}
              priority
              className="h-24 w-auto opacity-[0.96] sm:h-28 md:h-32 lg:h-36"
            />

            <div className="text-[11px] tracking-[0.32em] text-white/55">
              GLOBAL PROPERTY INTELLIGENCE
            </div>
          </div>
        </div>

        {/* Statement */}
        <div className="mt-10 w-full max-w-[620px]">
          <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.028] px-8 py-7 shadow-[0_30px_110px_rgba(0,0,0,0.72)]">
            {/* very subtle top sheen */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(900px_240px_at_50%_0%,rgba(255,255,255,0.06),transparent_62%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/22 px-4 py-2 text-[11px] text-white/65">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_0_3px_rgba(255,255,255,0.08)]" />
                <span className="tracking-wide">Launching soon</span>
              </div>

              <div className="mt-4 text-balance text-[22px] font-medium leading-snug text-white/90 sm:text-[26px]">
                Intelligence for the world&apos;s most valuable assets.
              </div>

              <div className="mt-3 text-sm leading-relaxed text-white/55">
                A private surface for high-value real estate, designed for clarity today and built for truth tomorrow.
              </div>
            </div>
          </div>
        </div>

        {/* Actions (more understated) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-3 text-sm text-white/80 shadow-[0_16px_55px_rgba(0,0,0,0.55)] transition hover:bg-white/[0.08] hover:text-white/90"
          >
            Refresh
          </Link>

          <Link
            href="/"
            className="rounded-2xl border border-white/10 bg-black/18 px-5 py-3 text-sm text-white/55 transition hover:bg-black/22 hover:text-white/70"
          >
            Home
          </Link>
        </div>

        <div className="mt-12 text-[11px] tracking-[0.22em] text-white/35">
          © {new Date().getFullYear()} VANTERA
        </div>
      </div>
    </main>
  );
}
