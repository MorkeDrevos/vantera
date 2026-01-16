// src/components/home/HeroEdge.tsx

import Link from 'next/link';
import Image from 'next/image';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export default function HeroEdge() {
  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden">
      {/* Background media (edge-to-edge) */}
      <div className="absolute inset-0 -z-20">
        {/* Swap this to your best premium hero image later */}
        <Image
          src="/brand/hero.jpg"
          alt="Vantera skyline"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Cinematic shading */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_35%,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.9))]" />
      </div>

      {/* Ambient grid + glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:120px_120px] [mask-image:radial-gradient(900px_520px_at_50%_40%,black,transparent)]" />
        <div className="absolute left-1/2 top-[40%] h-[520px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_65%)] blur-3xl" />
      </div>

      {/* Content (still edge-to-edge; no container lock) */}
      <div className="relative mx-auto flex w-full max-w-none flex-col px-5 pt-28 sm:px-10 sm:pt-32 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: headline */}
            <div className="min-w-0 lg:max-w-[42rem]">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[12px] text-white/80 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
                Private intelligence for prime real estate
              </div>

              <h1 className="mt-5 text-balance text-[38px] font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-[54px] lg:text-[64px]">
                Vantera
                <span className="block text-white/85">Intelligence for the world’s most valuable assets</span>
              </h1>

              <p className="mt-5 max-w-[46rem] text-pretty text-[15px] leading-relaxed text-white/70 sm:text-[16px]">
                Market signals, liquidity context and verification-first listings - presented with quiet luxury, built for
                buyers, sellers and elite advisors.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/city/marbella"
                  className={cx(
                    'group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/14',
                    'bg-white/10 px-5 py-3 text-[13px] font-medium text-white backdrop-blur-xl',
                    'hover:bg-white/14 transition'
                  )}
                >
                  Explore markets
                  <span className="text-white/70 group-hover:text-white transition">→</span>
                </Link>

                <Link
                  href="/intel"
                  className={cx(
                    'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-[13px] font-medium',
                    'text-white/80 hover:text-white transition'
                  )}
                >
                  View intelligence briefings
                </Link>

                <div className="mt-2 flex items-center gap-2 text-[12px] text-white/55 sm:mt-0">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/40" />
                  Verification-led, manipulation-resistant
                </div>
              </div>
            </div>

            {/* Right: “computer screen” (floating, not boxed section) */}
            <div className="w-full lg:max-w-[520px]">
              <div className="relative">
                {/* Outer glow */}
                <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)] blur-2xl" />

                {/* Screen frame */}
                <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-black/35 backdrop-blur-2xl">
                  {/* Top chrome */}
                  <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    </div>
                    <div className="text-[11px] text-white/60">Vantera Console</div>
                    <div className="text-[11px] text-white/40">Secure</div>
                  </div>

                  {/* Screen body */}
                  <div className="relative p-4 sm:p-5">
                    {/* Subtle scanline */}
                    <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.05),rgba(255,255,255,0.05)_1px,transparent_1px,transparent_6px)]" />

                    <div className="relative grid gap-4">
                      {/* Main panel */}
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-[11px] text-white/55">Market pulse</div>
                            <div className="mt-1 text-[14px] font-medium text-white">
                              Costa del Sol - Prime Liquidity
                            </div>
                            <div className="mt-2 text-[12px] text-white/60">
                              Bid depth rising, verified supply tightening
                            </div>
                          </div>
                          <div className="shrink-0 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[11px] text-white/70">
                            Live
                          </div>
                        </div>

                        {/* Faux chart */}
                        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-3">
                          <div className="h-24 w-full bg-[radial-gradient(140px_80px_at_25%_55%,rgba(255,255,255,0.12),transparent_60%),radial-gradient(180px_120px_at_65%_35%,rgba(255,255,255,0.10),transparent_62%)]" />
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <Metric k="Liquidity" v="A-" />
                            <Metric k="Risk" v="Low" />
                            <Metric k="Yield" v="3.2%" />
                          </div>
                        </div>
                      </div>

                      {/* Secondary row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <div className="text-[11px] text-white/55">Verification</div>
                          <div className="mt-1 text-[14px] font-medium text-white">Docs-first</div>
                          <div className="mt-2 text-[12px] text-white/60">Audit trails, provenance and signals</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <div className="text-[11px] text-white/55">Discovery</div>
                          <div className="mt-1 text-[14px] font-medium text-white">Global</div>
                          <div className="mt-2 text-[12px] text-white/60">Cities, regions, clusters and intent</div>
                        </div>
                      </div>

                      {/* Bottom CTA inside screen */}
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                        <div className="text-[12px] text-white/65">
                          Start with a city, region or intent
                        </div>
                        <Link
                          href="/search"
                          className="rounded-xl border border-white/14 bg-white/10 px-3 py-2 text-[12px] text-white hover:bg-white/14 transition"
                        >
                          Open search
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Bottom edge highlight */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(400px_120px_at_50%_100%,rgba(255,255,255,0.10),transparent_70%)]" />
                </div>

                {/* Floating shadow */}
                <div className="pointer-events-none absolute inset-x-10 -bottom-10 h-20 rounded-full bg-black/70 blur-2xl" />
              </div>
            </div>
          </div>

          {/* Trust line */}
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-white/45">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
              Prime-only positioning
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
              Institutional-grade data hygiene
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
              Built for quiet-luxury conversion
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <div className="text-[10px] text-white/50">{k}</div>
      <div className="mt-0.5 text-[12px] font-medium text-white/85">{v}</div>
    </div>
  );
}
