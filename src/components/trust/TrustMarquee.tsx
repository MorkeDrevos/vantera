// src/components/trust/TrustWordmarks.tsx
export default function TrustWordmarks({
  eyebrow = "Trusted reference set",
  title = "Benchmarked against the world’s leading firms",
  subtitle = "A quiet credibility layer for clients who expect institutional standards.",
  firms,
  className = '',
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  firms: string[];
  className?: string;
}) {
  return (
    <section className={`w-full ${className}`}>
      <div className="relative overflow-hidden border-y border-white/10 bg-[#070A10]">
        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_240px_at_20%_0%,rgba(255,255,255,0.07),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_85%_10%,rgba(120,76,255,0.12),transparent_60%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
          {/* Header */}
          <div className="max-w-2xl">
            <div className="text-[11px] tracking-[0.32em] text-zinc-400">
              {eyebrow.toUpperCase()}
            </div>
            <h2 className="mt-3 text-lg font-semibold text-zinc-50 sm:text-xl">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              {subtitle}
            </p>
          </div>

          {/* Wordmark grid */}
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {firms.map((name) => (
              <div
                key={name}
                className="group relative"
              >
                <div className="text-sm font-medium tracking-wide text-zinc-300 transition group-hover:text-zinc-100">
                  {name}
                </div>
                <div className="mt-1 h-px w-10 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-zinc-500">
            Firms listed for market benchmarking and reference only.
          </p>
        </div>
      </div>
    </section>
  );
}
