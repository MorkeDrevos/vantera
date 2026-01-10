// src/components/layout/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative left-1/2 w-screen -translate-x-1/2 border-t border-white/10 bg-[#0B0E13]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 right-[-20%] h-[420px] w-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,76,255,0.08),transparent_65%)] blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative mx-auto w-full max-w-[1600px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-lg font-semibold tracking-wide text-zinc-100">
              Vantera
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              Truth-first real estate intelligence.
              <br />
              Built for clarity, confidence, and long-term trust.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-2">
            <FooterCol title="Platform">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/coming-soon">Protocol</FooterLink>
              <FooterLink href="/cities">Cities</FooterLink>
            </FooterCol>

            <FooterCol title="Company">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/press">Press</FooterLink>
            </FooterCol>

            <FooterCol title="Legal">
              <FooterLink href="/privacy">Privacy</FooterLink>
              <FooterLink href="/terms">Terms</FooterLink>
              <FooterLink href="/disclaimer">Disclaimer</FooterLink>
            </FooterCol>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <div>
            © {new Date().getFullYear()} Vantera. All rights reserved.
          </div>
          <div className="flex gap-5">
            <Link
              href="https://x.com"
              className="transition-colors hover:text-zinc-300"
            >
              X
            </Link>
            <Link
              href="https://linkedin.com"
              className="transition-colors hover:text-zinc-300"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium tracking-wide text-zinc-300">
        {title}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-zinc-400 transition-colors hover:text-zinc-200"
    >
      {children}
    </Link>
  );
}
