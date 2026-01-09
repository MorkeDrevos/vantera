// src/app/city/[slug]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CITIES } from '@/components/home/cities';

function formatLocalTime(tz: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: tz,
    }).format(new Date());
  } catch {
    return '';
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const idx = CITIES.findIndex((c) => c.slug === slug);
  if (idx === -1) return notFound();

  const city = CITIES[idx];
  const prev = CITIES[(idx - 1 + CITIES.length) % CITIES.length];
  const next = CITIES[(idx + 1) % CITIES.length];

  const localTime = formatLocalTime(city.tz);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute -bottom-48 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-white/5 blur-[130px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-zinc-100">Locus</div>
              <div className="text-xs text-zinc-400">City discovery</div>
            </div>
          </div>

          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200 hover:border-white/20 hover:bg-white/10"
            prefetch
          >
            Back
          </Link>
        </header>

        <main className="pt-2">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <div className="relative aspect-[16/7] w-full bg-zinc-950">
              {city.image?.src ? (
                // Using <img> keeps this page server-only and avoids Next Image remote config issues.
                // If the URL is bad, the gradient still looks acceptable behind it.
                <img
                  src={city.image.src}
                  alt={city.image.alt ?? `${city.name} image`}
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                  loading="eager"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-transparent" />

              <div className="absolute left-5 right-5 bottom-5 sm:left-8 sm:right-8 sm:bottom-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      {city.country}
                      {city.region ? ` · ${city.region}` : ''}
                    </div>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                      {city.name}
                    </h1>
                    <div className="mt-2 text-sm text-zinc-300">
                      {city.blurb ?? 'Explore this city page.'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {localTime ? (
                      <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-200 backdrop-blur">
                        Local time: {localTime}
                      </div>
                    ) : null}
                    <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-200 backdrop-blur">
                      TZ: {city.tz}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick facts (placeholder cards) */}
            <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-8">
              <div className="rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-4">
                <div className="text-xs text-zinc-400">Status</div>
                <div className="mt-1 text-base font-semibold text-emerald-300">Live</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-4">
                <div className="text-xs text-zinc-400">Country</div>
                <div className="mt-1 text-base font-semibold text-zinc-100">{city.country}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-4">
                <div className="text-xs text-zinc-400">Region</div>
                <div className="mt-1 text-base font-semibold text-zinc-100">{city.region ?? '—'}</div>
              </div>
            </div>
          </div>

          {/* Prev / Next */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`/city/${prev.slug}`}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 hover:border-white/20 hover:bg-white/10"
              prefetch
            >
              ← {prev.name}
            </Link>

            <Link
              href={`/city/${next.slug}`}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 hover:border-white/20 hover:bg-white/10"
              prefetch
            >
              {next.name} →
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
