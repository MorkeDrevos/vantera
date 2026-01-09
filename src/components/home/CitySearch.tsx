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
      return;
    }
  }

  const showDropdown = open && (results.length > 0 || q.trim().length > 0);

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
            window.setTimeout(() => setOpen(false), 140);
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
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 pr-28 text-base text-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] outline-none placeholder:text-zinc-500 focus:border-white/20"
          aria-label="Search a city"
          spellCheck={false}
          autoComplete="off"
        />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onSubmit}
          className="absolute right-2 top-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-zinc-100 transition hover:bg-white/15"
        >
          Open
        </button>
      </div>

      {showDropdown && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="p-2">
            {results.length > 0 ? (
              results.map((city, idx) => (
                <button
                  key={city.slug}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToCity(city)}
                  onMouseEnter={() => setActive(idx)}
                  className={[
                    'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition',
                    idx === active
                      ? 'bg-white/10 text-zinc-50'
                      : 'bg-transparent text-zinc-200 hover:bg-white/5',
                  ].join(' ')}
                >
                  <span className="font-medium">{city.name}</span>
                  <span className="text-xs text-zinc-500">city</span>
                </button>
              ))
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-zinc-300">
                No matches for <span className="font-medium text-zinc-100">"{q.trim()}"</span>
                <div className="mt-1 text-xs text-zinc-500">Try: madrid, barcelona, lisbon, nyc</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
