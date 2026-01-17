// src/components/home/DnaChapterBreak.tsx
import Link from 'next/link';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export default function DnaChapterBreak() {
  return (
    <section
      className={cx(
        'relative overflow-hidden',
        'w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]',
        'bg-white',
      )}
      aria-label="Vantera DNA chapter break"
    >
      {/* Hairlines + crown */}
      <div className="pointer-events-none absolute inset-x-0 top-0">
        <div className="h-px bg-[color:var(--hairline)]" />
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.85)] to-transparent opacity-70" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.55)] to-transparent opacity-60" />
        <div className="h-px bg-[color:var(--hairline)]" />
      </div>

      {/* Ambient depth */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_18%_0%,rgba(206,160,74,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_82%_20%,rgba(10,10,12,0.06),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.22)_1px,transparent_0)] [background-size:26px_26px]" />
      </div>

      <div className="mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20">
        <div className="grid gap-6 py-10 sm:py-12 lg:grid-cols-12 lg:items-end">
          {/* Left: chapter label + statement */}
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-3 py-1.5 text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-2)]">
                <span className="h-1.5 w-1.5 bg-[rgba(206,160,74,0.75)]" />
                VANTERA DNA
              </div>

              <div className="inline-flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-3 py-1.5 text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">
                TRUTH LAYER
              </div>

              <div className="inline-flex items-center gap-2 border border-[color:var(--hairline)] bg-white px-3 py-1.5 text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">
                SIGNAL OVER NOISE
              </div>
            </div>

            <div className="mt-5 text-balance text-[28px] font-semibold tracking-[-0.04em] text-[color:var(--ink)] sm:text-[34px] lg:text-[40px]">
              Not a portal. An intelligence system for the world’s most valuable homes.
            </div>

            <div className="mt-3 max-w-[86ch] text-sm leading-relaxed text-[color:var(--ink-2)] sm:text-[15px]">
              Vantera treats every listing as an asset record with attribution. Presentation stays calm, the Truth Layer stays rigorous.
              That’s the difference you feel in the first scroll.
            </div>

            {/* Gold rule */}
            <div className="mt-6 h-px w-40 bg-gradient-to-r from-[rgba(206,160,74,0.90)] to-transparent" />

            {/* Micro footnote line */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] tracking-[0.22em] text-[color:var(--ink-3)]">
              <span className="inline-flex items-center gap-2">
                <span className="h-px w-10 bg-[color:var(--hairline)]" />
                VERIFIED / INFERRED / UNKNOWN
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-px w-10 bg-[color:var(--hairline)]" />
                STRUCTURED CHECKS
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-px w-10 bg-[color:var(--hairline)]" />
                CITY-BY-CITY COVERAGE
              </span>
            </div>
          </div>

          {/* Right: CTA card */}
          <div className="lg:col-span-4">
            <div className="relative overflow-hidden border border-[color:var(--hairline)] bg-white shadow-[0_30px_110px_rgba(10,10,12,0.10)]">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 top-0">
                  <div className="h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.85)] to-transparent" />
                  <div className="h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.55)] to-transparent" />
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(700px_240px_at_22%_0%,rgba(206,160,74,0.10),transparent_60%)]" />
              </div>

              <div className="relative p-5">
                <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">CHAPTER</div>
                <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
                  Enter the Marketfront
                </div>
                <div className="mt-2 text-sm leading-relaxed text-[color:var(--ink-2)]">
                  Six cities to start. Clean entry points. Intelligence underneath.
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/marketplace"
                    className={cx(
                      'inline-flex h-10 items-center justify-center px-4 text-sm font-semibold transition',
                      'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                      'shadow-[0_16px_56px_rgba(10,10,12,0.10)] hover:shadow-[0_20px_80px_rgba(206,160,74,0.14)]',
                    )}
                  >
                    Browse
                  </Link>

                  <Link
                    href="/search"
                    className={cx(
                      'inline-flex h-10 items-center justify-center px-4 text-sm font-semibold transition',
                      'border border-[color:var(--hairline)] bg-white text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]',
                    )}
                  >
                    Search
                  </Link>
                </div>

                <div className="mt-3 text-[11px] text-[color:var(--ink-3)]">
                  Tip: press <span className="font-mono text-[color:var(--ink-2)]">/</span> anywhere.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Small fade to keep next section feeling like a new chapter */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.00),rgba(255,255,255,0.90))]" />
    </section>
  );
}
