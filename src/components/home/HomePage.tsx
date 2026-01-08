import Link from 'next/link';
import CitySearch from './CitySearch';

const FEATURED_CITIES = [
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
          <div className="text-lg font-semibold tracking-tight">Locus</div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
          <Link className="hover:text-zinc-900" href="/about">
            About
          </Link>
          <Link className="hover:text-zinc-900" href="/methodology">
            Methodology
          </Link>
          <Link className="hover:text-zinc-900" href="/contact">
            Contact
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-10 md:pt-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Real estate, observed.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
            Locus aggregates signals across markets to show what is actually happening in cities - before listings catch up.
          </p>

          <div className="mt-10">
            <CitySearch />
            <p className="mt-3 text-xs text-zinc-500">
              Start typing a city. No dropdowns. No filters.
            </p>
          </div>
        </div>
      </section>

      {/* What it is */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-16 md:pt-24">
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Cities are not static
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-zinc-600 md:text-base">
            <p>Markets move continuously.</p>
            <p>Listings, prices, and portals are delayed reflections of reality.</p>
            <p>
              Locus exists to observe cities in real time - by aggregating independent signals, activity, and data sources into a single, neutral view.
            </p>
            <p className="text-zinc-800">
              No selling. No paid ranking. No noise.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-16 md:pt-24">
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Observation before transaction
          </h2>

          <ul className="mt-6 space-y-2 text-sm text-zinc-600 md:text-base">
            <li>- Multiple data sources per city</li>
            <li>- Signals weighted by confidence, not volume</li>
            <li>- Local activity over global averages</li>
            <li>- No manual curation</li>
          </ul>

          <p className="mt-6 text-sm text-zinc-800 md:text-base">
            Locus does not predict. It observes.
          </p>
        </div>
      </section>

      {/* Explore */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-16 md:pb-24 md:pt-24">
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Start with a city
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {FEATURED_CITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/city/${c.slug}`}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
          <div className="text-sm font-semibold text-zinc-900">Locus</div>

          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <Link className="hover:text-zinc-900" href="/about">
              About
            </Link>
            <Link className="hover:text-zinc-900" href="/methodology">
              Methodology
            </Link>
            <Link className="hover:text-zinc-900" href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
