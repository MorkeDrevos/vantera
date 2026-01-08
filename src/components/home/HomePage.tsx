import Link from 'next/link';
import CitySearch from './CitySearch';

const FEATURED = [
  { name: 'Madrid', slug: 'madrid' },
  { name: 'Barcelona', slug: 'barcelona' },
  { name: 'Lisbon', slug: 'lisbon' },
  { name: 'London', slug: 'london' },
  { name: 'Paris', slug: 'paris' },
  { name: 'Dubai', slug: 'dubai' },
  { name: 'New York', slug: 'new-york' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl border border-zinc-200 bg-white shadow-sm" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Locus</div>
            <div className="text-xs text-zinc-500">Real estate, observed</div>
          </div>
        </div>

        <nav className="hidden items-center gap-7 text-sm text-zinc-600 md:flex">
          <Link className="hover:text-zinc-950" href="/about">
            About
          </Link>
          <Link className="hover:text-zinc-950" href="/methodology">
            Methodology
          </Link>
          <Link className="hover:text-zinc-950" href="/contact">
            Contact
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-6 md:pb-24 md:pt-12">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Signals, not listings
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
              Real estate,
              <span className="text-zinc-400"> observed.</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600 md:text-lg">
              Locus aggregates early signals across markets to show what is actually happening in cities before listings
              catch up.
            </p>

            <div className="mt-8">
              <CitySearch />
              <div className="mt-3 text-xs text-zinc-500">
                Tip: type a city, hit Enter. Try <span className="text-zinc-700">madrid</span> or{' '}
                <span className="text-zinc-700">nyc</span>.
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 text-sm">
              <Link
                href="/methodology"
                className="rounded-xl bg-zinc-950 px-5 py-3 text-white shadow-sm hover:bg-zinc-900"
              >
                How it works
              </Link>
              <Link
                href="/about"
                className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                Why Locus
              </Link>
            </div>
          </div>

          {/* Right card */}
          <div className="md:col-span-5">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold">Featured cities</div>
              <div className="mt-1 text-sm text-zinc-600">Start with a market you know well.</div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {FEATURED.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/city/${c.slug}`}
                    className="group rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm hover:bg-zinc-50"
                  >
                    <div className="font-medium text-zinc-950">{c.name}</div>
                    <div className="text-xs text-zinc-500 group-hover:text-zinc-600">Open market</div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-medium text-zinc-700">Coming next</div>
                <div className="mt-1 text-sm text-zinc-600">City dashboards, alerts, and trend snapshots.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} Locus</div>
          <div className="flex items-center gap-4">
            <Link className="hover:text-zinc-700" href="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-zinc-700" href="/terms">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
