import CitySearch from './CitySearch';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_20%_15%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(900px_600px_at_80%_20%,rgba(168,85,247,0.16),transparent_55%),radial-gradient(1000px_700px_at_50%_90%,rgba(34,197,94,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black" />
      </div>

      {/* Top */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-7 sm:px-8">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/10" />
          <span className="text-sm font-semibold tracking-wide text-white/90">Locus</span>
        </div>

        <div className="text-xs text-white/60">Prototype</div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 sm:px-8 sm:pt-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            Live city routing
          </div>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.02em] sm:text-6xl">
            Find your city
            <span className="text-white/70"> in seconds.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            A clean, fast directory that routes instantly. Search a city and jump straight into its page.
          </p>
        </div>

        {/* Search card */}
        <div className="mt-10 max-w-2xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] sm:p-5">
            <CitySearch />
            <div className="mt-3 flex items-center justify-between gap-3 px-1">
              <p className="text-xs text-white/50">
                Tip: try <span className="text-white/70">Madrid</span> or <span className="text-white/70">Dubai</span>
              </p>
              <p className="text-xs text-white/40">Enter to open • ↑↓ to navigate</p>
            </div>
          </div>

          {/* Small trust row */}
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-white/85">Fast routing</p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">Instant push to /city/[slug]</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-white/85">Clean UI</p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">Minimal, premium spacing & type</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-medium text-white/85">Keyboard-first</p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">Enter, arrows, escape supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-6xl px-6 pb-10 sm:px-8">
        <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/45">
          <span>© {new Date().getFullYear()} Locus</span>
          <span className="text-white/35">Built with Next + Tailwind</span>
        </div>
      </footer>
    </main>
  );
}
