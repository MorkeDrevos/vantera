// src/components/layout/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-10 sm:px-8">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] px-5 py-5 text-sm text-zinc-300 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:px-7">
          {/* subtle ambient */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(760px_260px_at_20%_0%,rgba(255,255,255,0.06),transparent_58%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(760px_260px_at_85%_10%,rgba(120,76,255,0.08),transparent_58%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          </div>

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-zinc-200">© {new Date().getFullYear()} Vantera</span>
              <span className="text-xs text-zinc-500">Private intelligence for high-value real estate.</span>
            </div>

            <nav className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 transition hover:border-white/18 hover:bg-white/[0.05]"
              >
                Contact
              </Link>

              <a
                href="mailto:hello@vantera.io"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 transition hover:border-white/18 hover:bg-white/[0.05]"
              >
                hello@vantera.io
              </a>
            </nav>
          </div>

          <div className="relative mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Built for clarity today, designed for truth tomorrow.</span>
            <span className="text-zinc-600">Coverage expands continuously.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
