'use client';

// src/components/ComingSoon.tsx

import Image from 'next/image';

export default function ComingSoon() {
  const year = new Date().getFullYear();

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[color:var(--paper)] text-[color:var(--ink)]">
      {/* Backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* focused center glow */}
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_50%_42%,rgba(120,76,255,0.10),transparent_72%)]" />

        {/* corner tint */}
        <div className="absolute -top-48 -right-48 h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.12),transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-56 -left-56 h-[860px] w-[860px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.10),transparent_72%)] blur-3xl" />

        {/* soft vignette (NO black) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.00),rgba(10,12,18,0.12))]" />

        {/* grain */}
        <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.35)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>

      <div className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center px-6 text-center">
        {/* LOGO */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* tight glow cone */}
            <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.18),transparent_70%)] blur-3xl" />

            <Image
              src="/images/brand/vantera-square-black.svg"
              alt="Vantera"
              width={2000}
              height={600}
              priority
              className="relative h-36 w-auto sm:h-44 md:h-56 lg:h-64"
            />
          </div>
        </div>

        {/* SPACE */}
        <div className="h-14 sm:h-20" />

        {/* STATEMENT */}
        <div className="w-full max-w-[820px]">
          <div className="relative rounded-[20px] bg-[color:var(--surface-1)]/85 px-8 py-7 shadow-[0_30px_90px_rgba(10,12,18,0.18)] sm:px-12 sm:py-9 backdrop-blur-xl">
            {/* ultra-hairline */}
            <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-[color:var(--hairline)]" />

            <div className="relative text-balance text-base font-medium text-[color:var(--ink)]/85 sm:text-lg">
              Intelligence for the world’s most valuable assets.
            </div>

            <div className="relative mt-4 text-[11px] tracking-[0.46em] text-[color:var(--ink)]/45">
              COMING SOON
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-16 text-[11px] tracking-[0.22em] text-[color:var(--ink)]/35">
          © {year} Vantera
        </div>
      </div>
    </main>
  );
}
