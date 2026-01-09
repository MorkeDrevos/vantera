'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import type { CityMeta } from './cities';

function formatLocalTime(tz: string, d: Date) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: tz,
    }).format(d);
  } catch {
    return '';
  }
}

function formatWeekday(tz: string, d: Date) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      timeZone: tz,
    }).format(d);
  } catch {
    return '';
  }
}

export default function CityCardsClient({ cities }: { cities: CityMeta[] }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(t);
  }, []);

  const cards = useMemo(() => {
    return cities.map((c) => {
      const time = formatLocalTime(c.tz, now);
      const day = formatWeekday(c.tz, now);
      return { ...c, time, day };
    });
  }, [cities, now]);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <a
          key={c.slug}
          href={`/city/${c.slug}`}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/10"
        >
          <div className="relative h-40 w-full">
            <Image
              src={c.image.src}
              alt={c.image.alt}
              fill
              className="object-cover opacity-85 transition group-hover:opacity-95"
              sizes="(max-width: 1024px) 100vw, 33vw"
              priority={c.slug === 'madrid'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/35 to-transparent" />
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-zinc-950/50 px-3 py-1 text-xs text-zinc-200 backdrop-blur">
                {c.region}
              </span>
              <span className="rounded-full border border-white/10 bg-zinc-950/50 px-3 py-1 text-xs text-zinc-200 backdrop-blur">
                {c.country}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold tracking-tight text-zinc-50">{c.name}</div>
                  <div className="mt-1 text-xs text-zinc-300/90">{c.blurb}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium text-zinc-100">
                    {c.day ? `${c.day} ` : ''}
                    {c.time}
                  </div>
                  <div className="mt-1 text-[11px] text-zinc-400">{c.tz}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-400">Open city page</div>
              <div className="text-xs text-zinc-500 transition group-hover:text-zinc-300">/city/{c.slug}</div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
