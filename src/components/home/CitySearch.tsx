// src/components/home/CitySearch.tsx
'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { CITIES, type CityMeta } from './cities';

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function CitySearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  const results: CityMeta[] = useMemo(() => {
    const n = normalize(q);
    if (!n) return CITIES.slice(0, 7);
    return CITIES.filter((c) => {
      const hay = `${c.name} ${c.country} ${c.region ?? ''} ${c.slug}`.toLowerCase();
      return hay.includes(n);
    }).slice(0, 10);
  }, [q]);

  function openCity(slug?: string) {
    const s = slug ?? results[active]?.slug;
    if (!s) return;
    router.push(`/city/${s}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      openCity();
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setQ('');
      setActive(0);
      inputRef.current?.blur();
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search a city..."
          className="h-11 w-full bg-transparent px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => openCity()}
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-zinc-100 transition hover:border-white/20 hover:bg-white/10"
        >
          Open
        </button>
      </div>

      {q.trim() ? (
        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur">
          <div className="p-2">
            {results.length ? (
              <ul className="space-y-1">
                {results.map((c, idx) => (
                  <li key={c.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => openCity(c.slug)}
                      className={[
                        'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition',
                        idx === active ? 'bg-white/10' : 'hover:bg-white/5',
                      ].join(' ')}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-zinc-100">{c.name}</div>
                        <div className="truncate text-xs text-zinc-500">
                          {c.country}
                          {c.region ? ` · ${c.region}` : ''}
                        </div>
                      </div>
                      <div className="text-xs text-zinc-500">{`/city/${c.slug}`}</div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-3 text-sm text-zinc-400">No matches</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
