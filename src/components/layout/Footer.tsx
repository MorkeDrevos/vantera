// src/components/layout/Footer.tsx
import Link from 'next/link';

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
    'text-sm text-zinc-300/90 hover:text-white transition underline-offset-4 hover:underline';

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

function TrustImprint() {
  return (
    <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.24em] text-zinc-500">
            CORPORATE PRESENTATION
          </div>

          <div className="mt-3 text-sm leading-relaxed text-zinc-300/90">
            For institutional clarity, Vantera is structured for a Delaware C-Corporation setup.
            Public registry details are presented in the standard Delaware format.
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <div className="px-4 py-3 text-xs font-semibold tracking-[0.22em] text-zinc-500">
              OFFICIAL RECORD FORMAT
            </div>
            <div className="h-px w-full bg-white/10" />
            <pre className="whitespace-pre-wrap px-4 py-4 text-[13px] leading-relaxed text-zinc-200">
{`Vantera, Inc.
Delaware, United States

Registered Agent:
Northwest Registered Agent LLC
8 The Green, Suite A
Dover, DE 19901`}
            </pre>
          </div>

          <div className="mt-3 text-xs text-zinc-500">
            Note: If the corporation is not yet filed, the registered agent line reflects the intended Delaware
            registered office presentation upon incorporation.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <a
            href="mailto:md@vantera.io"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 transition hover:border-white/18 hover:bg-white/[0.06]"
          >
            md@vantera.io
          </a>
          <a
            href="mailto:info@vantera.io"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 transition hover:border-white/18 hover:bg-white/[0.06]"
          >
            info@vantera.io
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-5 pb-12 pt-10 sm:px-8">
        <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.02] shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
          {/* ambient */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_15%_0%,rgba(255,255,255,0.06),transparent_58%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_85%_10%,rgba(120,76,255,0.10),transparent_58%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="relative px-5 py-8 sm:px-7 sm:py-10">
            {/* Brand row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.05] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold tracking-[0.18em] text-zinc-100">VANTERA</div>
                    <div className="mt-0.5 text-xs text-zinc-400">
                      Private intelligence for high-value real estate.
                    </div>
                  </div>
                </div>

                <div className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-300/90">
                  Built for clarity today, designed for truth tomorrow. This index expands as verified coverage grows.
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 transition hover:border-white/18 hover:bg-white/[0.06]"
                >
                  Contact
                </Link>

                <a
                  href="mailto:md@vantera.io"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 transition hover:border-white/18 hover:bg-white/[0.06]"
                >
                  md@vantera.io
                </a>
              </div>
            </div>

            {/* Trust imprint */}
            <TrustImprint />

            {/* Divider */}
            <div className="mt-8 h-px w-full bg-white/10" />

            {/* Link grid */}
            <div className="mt-7 grid gap-8 sm:grid-cols-3">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.24em] text-zinc-500">PRODUCT</div>
                <div className="mt-3 flex flex-col gap-2">
                  <FooterLink href="/">Cities</FooterLink>
                  <FooterLink href="/coming-soon">Signals</FooterLink>
                  <FooterLink href="/coming-soon">Protocol</FooterLink>
                  <FooterLink href="/coming-soon">Coverage</FooterLink>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold tracking-[0.24em] text-zinc-500">COMPANY</div>
                <div className="mt-3 flex flex-col gap-2">
                  <FooterLink href="/contact">Contact</FooterLink>
                  <FooterLink href="mailto:md@vantera.io">Email</FooterLink>
                  <FooterLink href="/coming-soon">Press</FooterLink>
                  <FooterLink href="/coming-soon">Careers</FooterLink>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold tracking-[0.24em] text-zinc-500">LEGAL</div>
                <div className="mt-3 flex flex-col gap-2">
                  <FooterLink href="/coming-soon">Privacy</FooterLink>
                  <FooterLink href="/coming-soon">Terms</FooterLink>
                  <FooterLink href="/coming-soon">Disclaimer</FooterLink>
                  <FooterLink href="/coming-soon">Data policy</FooterLink>
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <span>© {year} Vantera</span>
              <span className="text-zinc-600">Coverage expands continuously.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
