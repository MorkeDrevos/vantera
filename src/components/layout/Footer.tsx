// src/components/layout/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const cls =
    'text-sm text-[color:var(--ink-2)] hover:text-[color:var(--ink)] transition underline-offset-4 hover:underline';

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

function Hairline({ className }: { className?: string }) {
  return <div className={cx('h-px w-full bg-[rgba(11,12,16,0.10)]', className)} />;
}

export default function Footer() {
  const year = new Date().getFullYear();

  const INNER =
    'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-12 2xl:px-16';

  return (
    <footer className="mt-16 w-full">
      {/* FULL-BLEED FOOTER BAND (runs edge-to-edge) */}
      <div className="relative w-full">
        {/* full-bleed paper + aura */}
        <div className="pointer-events-none absolute inset-0">
          {/* subtle footer band tint */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,251,250,0.65),rgba(251,251,250,0.92))]" />
          {/* crown warmth */}
          <div className="absolute inset-x-0 top-0 h-[220px] bg-[radial-gradient(1200px_380px_at_50%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
          {/* violet lift (very faint) */}
          <div className="absolute inset-x-0 top-0 h-[240px] bg-[radial-gradient(1100px_380px_at_85%_10%,rgba(139,92,246,0.06),transparent_66%)]" />
          {/* engineered hairlines */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.10)] to-transparent" />
          {/* micro grain */}
          <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:28px_28px]" />
        </div>

        <div className={cx('relative', INNER, 'pb-14 pt-10')}>
          {/* FULL-WIDTH PLATE (no rounding, still premium) */}
          <div className="relative overflow-hidden bg-white/72 backdrop-blur-[18px] ring-1 ring-inset ring-[color:var(--hairline)] shadow-[0_36px_120px_rgba(11,12,16,0.10)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(980px_320px_at_18%_0%,rgba(231,201,130,0.12),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_86%_10%,rgba(139,92,246,0.05),transparent_62%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.55)] to-transparent opacity-70" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
            </div>

            <div className="relative px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
              {/* Brand row */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden bg-white ring-1 ring-inset ring-[rgba(11,12,16,0.12)]">
                      <Image src="/brand/vantera-mark.png" alt="Vantera" fill className="object-cover" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold tracking-[0.22em] text-[color:var(--ink)]">
                        VANTERA
                      </div>
                      <div className="mt-0.5 text-xs text-[color:var(--ink-2)]">
                        Private intelligence for high-value real estate.
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 max-w-[78ch] text-sm leading-relaxed text-[color:var(--ink-2)]">
                    Built for clarity today, designed for truth tomorrow. This index expands as verified coverage grows.
                  </div>
                </div>

                {/* Primary CTAs */}
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Link
                    href="/contact"
                    className={cx(
                      'inline-flex items-center justify-center px-4 py-2 text-sm transition',
                      'bg-white/70 hover:bg-white/95',
                      'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[rgba(11,12,16,0.18)]',
                      'text-[color:var(--ink)]',
                    )}
                  >
                    Contact
                  </Link>

                  <a
                    href="mailto:md@vantera.io"
                    className={cx(
                      'inline-flex items-center justify-center px-4 py-2 text-sm transition',
                      'bg-white/60 hover:bg-white/92',
                      'ring-1 ring-inset ring-[color:var(--hairline)] hover:ring-[rgba(11,12,16,0.18)]',
                      'text-[color:var(--ink)]',
                    )}
                  >
                    md@vantera.io
                  </a>
                </div>
              </div>

              <div className="mt-8">
                <Hairline />
              </div>

              {/* Link grid */}
              <div className="mt-7 grid gap-8 sm:grid-cols-3">
                <div>
                  <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">
                    PRODUCT
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    <FooterLink href="/">Cities</FooterLink>
                    <FooterLink href="/coming-soon">Signals</FooterLink>
                    <FooterLink href="/coming-soon">Protocol</FooterLink>
                    <FooterLink href="/coming-soon">Coverage</FooterLink>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">
                    COMPANY
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    <FooterLink href="/contact">Contact</FooterLink>
                    <FooterLink href="mailto:md@vantera.io" external>
                      Email
                    </FooterLink>
                    <FooterLink href="/coming-soon">Press</FooterLink>
                    <FooterLink href="/coming-soon">Careers</FooterLink>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold tracking-[0.28em] text-[color:var(--ink-3)]">
                    LEGAL
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    <FooterLink href="/coming-soon">Privacy</FooterLink>
                    <FooterLink href="/coming-soon">Terms</FooterLink>
                    <FooterLink href="/coming-soon">Disclaimer</FooterLink>
                    <FooterLink href="/coming-soon">Data policy</FooterLink>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Hairline className="opacity-80" />
              </div>

              {/* Bottom row */}
              <div className="mt-5 flex flex-col gap-2 text-xs text-[color:var(--ink-3)] sm:flex-row sm:items-center sm:justify-between">
                <span>© {year} Vantera, Inc.</span>
                <span>Coverage expands continuously.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
