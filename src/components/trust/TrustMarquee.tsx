// src/components/trust/TrustMarquee.tsx
import Image from 'next/image';
import Link from 'next/link';

export type TrustLogo = {
  name: string;
  src: string; // put files in /public/brands/... so src is like "/brands/sothebys.svg"
  href?: string;
  invertOnDark?: boolean; // useful if you only have dark logos
};

export default function TrustMarquee({
  eyebrow = "Trusted by the world's finest",
  title = 'Global leaders in luxury real estate',
  subtitle = 'A few of the firms we study, benchmark and reference daily.',
  logos,
  className = '',
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  logos: TrustLogo[];
  className?: string;
}) {
  return (
    <section className={`w-full ${className}`}>
      <div className="relative w-full overflow-hidden border-y border-white/10 bg-[#070A10]">
        {/* Ambient royal glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_220px_at_18%_0%,rgba(255,255,255,0.07),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_82%_0%,rgba(185,150,255,0.10),transparent_62%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06),transparent_18%,transparent_82%,rgba(255,255,255,0.06))]" />
        </div>

        {/* Content */}
        <div className="relative mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-zinc-300/80">
              <span className="h-[7px] w-[7px] rounded-full bg-white/60 shadow-[0_0_0_3px_rgba(255,255,255,0.08)]" />
              <span>{eyebrow}</span>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-pretty text-lg font-semibold text-zinc-50 sm:text-xl">
                  {title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-zinc-300/90">
                  {subtitle}
                </p>
              </div>

              <div className="mt-4 hidden shrink-0 md:block">
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-300 shadow-[0_18px_55px_rgba(0,0,0,0.55)]">
                  15 firms - updated anytime
                </div>
              </div>
            </div>
          </div>

          {/* Logos rail */}
          <div className="mt-8">
            <div className="relative rounded-[22px] border border-white/10 bg-white/[0.02] p-3 shadow-[0_28px_80px_rgba(0,0,0,0.55)] sm:p-4">
              {/* inner ambient */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]">
                <div className="absolute -top-24 left-1/2 h-[240px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_65%)] blur-2xl" />
                <div className="absolute -bottom-32 left-[-120px] h-[320px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(185,150,255,0.10),transparent_62%)] blur-2xl" />
              </div>

              {/* Mobile: horizontal snap scroller */}
              <div className="relative md:hidden">
                <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {logos.map((l) => (
                    <LogoTile key={l.name} logo={l} />
                  ))}
                </div>
              </div>

              {/* Desktop: soft grid rail */}
              <div className="relative hidden md:block">
                <div className="grid grid-cols-5 gap-3 lg:grid-cols-6">
                  {logos.map((l) => (
                    <LogoTile key={l.name} logo={l} />
                  ))}
                </div>
              </div>

              {/* Fade edges */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-[linear-gradient(to_right,#070A10,transparent)] md:hidden" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-[linear-gradient(to_left,#070A10,transparent)] md:hidden" />
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-zinc-400/80">
            Logos shown for industry reference and credibility. Replace with your licensed assets and preferred set.
          </p>
        </div>
      </div>
    </section>
  );
}

function LogoTile({ logo }: { logo: TrustLogo }) {
  const inner = (
    <div className="group relative flex h-14 min-w-[148px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-4 shadow-[0_14px_44px_rgba(0,0,0,0.55)] transition hover:border-white/20 hover:bg-white/[0.04] sm:h-16 sm:min-w-[164px]">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(520px_140px_at_50%_0%,rgba(255,255,255,0.10),transparent_60%)]" />
      </div>

      <div
        className={`relative flex items-center justify-center ${
          logo.invertOnDark ? 'invert saturate-0 brightness-110' : ''
        } opacity-90 transition group-hover:opacity-100`}
      >
        <Image
          src={logo.src}
          alt={logo.name}
          width={180}
          height={56}
          className="h-8 w-auto object-contain sm:h-9"
          priority={false}
        />
      </div>
    </div>
  );

  if (logo.href) {
    return (
      <Link
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={logo.name}
        className="block"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
