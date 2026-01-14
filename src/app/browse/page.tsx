// src/app/browse/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Browse · Vantera',
};

function Pill({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-zinc-300/90">{children}</div>
    </section>
  );
}

export default function BrowsePage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs tracking-[0.22em] text-zinc-300/90">
        BROWSE
        <span className="h-1 w-1 rounded-full bg-amber-300/70" />
        <span className="text-zinc-400">Index navigation</span>
      </div>

      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Browse Vantera
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300/90">
        Explore cities, coverage and listings. This page is a navigation hub - the product expands as verified coverage grows.
      </p>

      <div className="mt-9 grid gap-5 sm:grid-cols-2">
        <Pill title="Cities">
          Start with the city index and open a location page.
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 transition hover:border-white/18 hover:bg-white/[0.06]"
            >
              Browse cities
            </Link>
          </div>
        </Pill>

        <Pill title="Contact">
          For private sellers, agent partnerships, and verification discussions.
          <div className="mt-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 transition hover:border-white/18 hover:bg-white/[0.06]"
            >
              Go to contact
            </Link>
          </div>
        </Pill>

        <Pill title="Signals">
          Early indicators and market intelligence modules.
          <div className="mt-4">
            <Link
              href="/coming-soon"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 transition hover:border-white/18 hover:bg-white/[0.06]"
            >
              View signals
            </Link>
          </div>
        </Pill>

        <Pill title="Protocol">
          Truth-first records, verification levels, and audit trails.
          <div className="mt-4">
            <Link
              href="/coming-soon"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 transition hover:border-white/18 hover:bg-white/[0.06]"
            >
              View protocol
            </Link>
          </div>
        </Pill>
      </div>
    </main>
  );
}
