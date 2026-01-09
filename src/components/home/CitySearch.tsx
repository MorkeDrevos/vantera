'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { CITIES, type City } from './cities';

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function scoreCity(city: City, q: string) {
  const name = normalize(city.name);
  const slug = normalize(city.slug);
  const country = normalize(city.country);
  const tz = normalize(city.tz);

  if (!q) return 0;

  // Strongest: prefix match on name
  if (name.startsWith(q)) return 100;

  // Next: contains in name
  if (name.includes(q)) return 80;

  // Slug match
  if (slug.startsWith(q)) return 70;
  if (slug.includes(q)) return 60;

  // Country / timezone match (weaker)
  if (country.includes(q)) return 40;
  if (tz.includes(q)) return 30;

  return 0;
}

export default function CitySearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [q, setQ] = useState('');
  const [active, setActive] = useState<number>(-1);

  const results = useMemo(() => {
    const query = normalize(q);
    if (!query) return [];

    return [...CITIES]
      .map((c) => ({ city: c, score: scoreCity(c, query) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || a.city.name.localeCompare(b.city.name))
      .slice(0, 8)
      .map((x) => x.city);
  }, [q]);

  function go(city: City) {
    router.push(`/city/${city.slug}`);
  }

  function onSubmit() {
    if (results.length === 0) return;
    const idx = active >= 0 ? active : 0;
    go(results[Math.min(idx, results.length - 1)]);
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(-1);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSubmit();
              return;
            }

            if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (results.length === 0) return;
              setActive((v) => Math.min(v + 1, results.length - 1));
              return;
            }

            if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (results.length === 0) return;
              setActive((v) => Math.max(v - 1, 0));
              return;
            }

            if (e.key === 'Escape') {
              setQ('');
              setActive(-1);
              inputRef.current?.blur();
            }
          }}
          placeholder="Search a city..."
          className="h-11 w-full rounded-xl bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          aria-label="Search a city"
        />

        <button
          type="button"
          onClick={onSubmit}
          className="h-11 shrink-0 rounded-xl border border-white/10 bg-zinc-950/40 px-4 text-sm font-medium text-zinc-100 transition hover:border-white/20 hover:bg-white/5"
        >
          Open
        </button>
      </div>

      {results.length > 0 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-[0_16px_50px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="p-2">
            {results.map((city, i) => (
              <button
                key={city.slug}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(city)}
                className={[
                  'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition',
                  i === active ? 'bg-white/6' : 'hover:bg-white/5',
                ].join(' ')}
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-zinc-100">{city.name}</div>
                  <div className="truncate text-xs text-zinc-500">
                    {city.country} · {city.tz}
                  </div>
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-300">
                  /city/{city.slug}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
