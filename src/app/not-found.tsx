// src/app/not-found.tsx
import Link from 'next/link';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const WIDE = 'mx-auto w-full max-w-[1100px] px-5 sm:px-8 lg:px-14 2xl:px-20';

function Hairline() {
  return <div className="h-px w-full bg-[color:var(--hairline)]" />;
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)]">
      {children}
    </span>
  );
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] px-6 py-3 text-sm font-semibold text-white hover:bg-[rgba(10,10,12,1.0)]"
    >
      {children}
    </Link>
  );
}

function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[color:var(--hairline)] bg-white px-6 py-3 text-sm font-semibold text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.22)]"
    >
      {children}
    </Link>
  );
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white">
      {/* Quiet paper texture */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.24)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(0,0,0,0.04),transparent_62%)]" />
      </div>

      <section className="border-b border-[color:var(--hairline)] bg-[color:var(--paper-2)]">
        <div className={cx('py-12 sm:py-14', WIDE)}>
          <div className="flex flex-wrap items-center gap-2">
            <TagPill>404</TagPill>
            <TagPill>NOT FOUND</TagPill>
          </div>

          <h1 className="mt-5 text-balance text-[34px] font-semibold tracking-[-0.05em] text-[color:var(--ink)] sm:text-[44px] lg:text-[52px] lg:leading-[1.02]">
            This page doesn’t exist
          </h1>

          <p className="mt-4 max-w-[75ch] text-pretty text-sm leading-relaxed text-[color:var(--ink-2)] sm:text-[15px]">
            The page may have moved, or the link is incorrect.
          </p>

          <div className="mt-8">
            <Hairline />
          </div>
        </div>
      </section>

      <section className={cx('py-10 sm:py-12', WIDE)}>
        <div className="flex flex-wrap gap-3">
          <PrimaryLink href="/search">Search</PrimaryLink>
          <SecondaryLink href="/">Home</SecondaryLink>
          <SecondaryLink href="/contact">Contact</SecondaryLink>
        </div>
      </section>
    </main>
  );
}
