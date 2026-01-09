'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type City = {
  name: string;
  slug: string;
  alt?: string[];
};

const CITIES: City[] = [
  { name: 'Madrid', slug: 'madrid', alt: ['madrid, spain'] },
  { name: 'Barcelona', slug: 'barcelona', alt: ['barcelona, spain'] },
  { name: 'Lisbon', slug: 'lisbon', alt: ['lisboa'] },
  { name: 'London', slug: 'london' },
  { name: 'Paris', slug: 'paris' },
  { name: 'Dubai', slug: 'dubai' },
  { name: 'New York', slug: 'new-york', alt: ['nyc', 'new york city'] },
];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function scoreCity(q: string, city: City) {
  const qq = normalize(q);
  if (!qq) return 0;

  const name = normalize(city.name);
  if (name === qq) return 100;
  if (name.startsWith(qq)) return 80;
  if (name.includes(qq)) return 60;

  for (const a of city.alt ?? []) {
    const aa = normalize(a);
    if (aa === qq) return 90;
    if (aa.startsWith(qq)) return 70;
    if (aa.includes(qq)) return 55;
  }

  return 0;
}

export default function CitySearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const qq = normalize(q);
    if (!qq) return [];

    return CITIES.map((c) => ({ c, s: scoreCity(qq, c) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map((x) => x.c);
  }, [q]);

  function goToCity(city: City) {
    setOpen(false);
    router.push(`/city/${city.slug}`);
  }

  function onSubmit() {
    if (results.length > 0) {
      goToCity(results[Math.max(0, Math.min(active, results.length - 1))]);
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSubmit();
            }
            if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
              setOpen(true);
              return;
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((v) => Math.min(v + 1, Math.max(0, results.length - 1)));
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((v) => Math.max(v - 1, 0));
            }
            if (e.key === 'Escape') {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder="Search a city…"
          className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 pr-24 text-[15px] text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-white/20 focus:bg-white/[0.06]"
          aria-label="Search a city"
          spellCheck={false}
          autoComplete="off"
        />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onSubmit}
          className="absolute right-2 top-2 inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 text-sm font-medium text-white/90 transition hover:bg-white/15 active:scale-[0.99]"
        >
          Open
        </button>
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="p-2">
            {results.map((city, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={city.slug}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToCity(city)}
                  onMouseEnter={() => setActive(idx)}
                  className={[
                    'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'bg-transparent text-white/80 hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="text-xs text-white/45">city</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
