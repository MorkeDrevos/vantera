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
    'text-[13px] text-[color:var(--ink-2)] hover:text-[color:var(--ink)] transition ' +
    'underline-offset-4 hover:underline';

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
  return <div className={cx('h-px w-full bg-[color:var(--hairline)]', className)} />;
}

export default function Footer() {
  const year = new Date().getFullYear();

  // Keep aligned with WIDE
  const CONTENT = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';

  // Marketplace-first links
  const primary = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Listings', href: '/listings' },
    { label: 'Search', href: '/search' },
    { label: 'List privately', href: '/coming-soon?flow=sell' },
  ];

  const company = [
    { label: 'Contact', href: '/contact' },
    { label: 'Press', href: '/coming-soon?section=press' },
    { label: 'Careers', href: '/coming-soon?section=careers' },
  ];

  const legal = [
    { label: 'Privacy', href: '/coming-soon?section=privacy' },
    { label: 'Terms', href: '/coming-soon?section=terms' },
    { label: 'Disclaimer', href: '/coming-soon?section=disclaimer' },
  ];

  return (
    <footer className="mt-16 w-full">
      {/* Quiet luxury footer: mostly white, hairlines, zero “glow” */}
      <div className="w-full bg-white">
        <div className="pointer-events-none">
          <Hairline />
        </div>

        <div className={cx('py-10 sm:py-12', CONTENT)}>
          {/* Top row */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            {/* Brand */}
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10">
  <img
  src="images/brand/favicon.svg"
  alt="Vantera"
  width={40}
  height={40}
/>
</div>

                <div className="min-w-0">
                  <div className="text-[12px] font-semibold tracking-[0.26em] text-[color:var(--ink)]">
                    VANTERA
                  </div>
                  <div className="mt-0.5 text-[13px] text-[color:var(--ink-2)]">
                    <p className="text-sm text-slate-700 leading-relaxed">
  A truth-driven real estate DNA for clarity over noise.
</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 max-w-[70ch] text-[13px] leading-relaxed text-[color:var(--ink-2)]">
                An editorial marketplace for high-value real estate. Private submissions, curated presentation,
                and a buyer experience built for confidence.
              </div>
            </div>

            {/* Contact / CTA */}
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <Link
                href="/contact"
                className={cx(
                  'inline-flex items-center justify-center px-4 py-2 text-[13px] transition',
                  'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                  'text-[color:var(--ink)]',
                )}
              >
                Contact
              </Link>

              <a
                href="mailto:md@vantera.io"
                className={cx(
                  'inline-flex items-center justify-center px-4 py-2 text-[13px] transition',
                  'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                  'text-[color:var(--ink)]',
                )}
              >
                md@vantera.io
              </a>

              <Link
                href="/coming-soon?flow=sell"
                className={cx(
                  'inline-flex items-center justify-center px-4 py-2 text-[13px] font-semibold transition',
                  'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                )}
              >
                List privately
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <Hairline />
          </div>

          {/* Links */}
          <div className="mt-7 grid gap-8 sm:grid-cols-3">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                MARKETPLACE
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {primary.map((l) => (
                  <FooterLink key={l.href} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">COMPANY</div>
              <div className="mt-3 flex flex-col gap-2">
                {company.map((l) => (
                  <FooterLink key={l.href} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">LEGAL</div>
              <div className="mt-3 flex flex-col gap-2">
                {legal.map((l) => (
                  <FooterLink key={l.href} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Hairline className="opacity-80" />
          </div>

          {/* Bottom row */}
          <div className="mt-5 flex flex-col gap-2 text-[12px] text-[color:var(--ink-3)] sm:flex-row sm:items-center sm:justify-between">
            <span>© {year} Vantera, Inc.</span>
            <span>All listings subject to verification and availability.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
