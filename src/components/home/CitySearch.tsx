// src/components/home/CitySearch.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import SafeImage from './SafeImage';
import CityLocalTime from './CityLocalTime';
import { CITIES, type City } from './cities';

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function rank(city: City, q: string) {
  const qq = normalize(q);
  if (!qq) return 0;

  const name = normalize(city.name);
  const slug = normalize(city.slug);
  const country = normalize(city.country);
  const region = normalize(city.region ?? '');

  if (name === qq) return 100;
  if (name.startsWith(qq)) return 90;
  if (name.includes(qq)) return 80;

  if (slug.startsWith(qq)) return 70;
  if (slug.includes(qq)) return 60;

  if (country.includes(qq)) return 50;
  if (region.includes(qq)) return 40;

  return 0;
}

export default function CitySearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!q.trim()) setActive(0);
  }, [q]);

  const results = useMemo(() => {
    const qq = normalize(q);
    if (!qq) return CITIES.slice(0, 7);

    return [...CITIES]
      .map((c) => ({ c, s: rank(c, qq) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.c.name.localeCompare(b.c.name))
      .slice(0, 10)
      .map((x) => x.c);
  }, [q]);

  const examples = useMemo(() => ['Madrid', 'Paris', 'Dubai', 'NYC'], []);

  function go(slug: string) {
    setOpen(false);
    router.push(`/city/${slug}`);
  }

  function onSubmit() {
    if (results.length === 0) return;
    const pick = results[Math.max(0, Math.min(active, results.length - 1))];
    if (pick) go(pick.slug);
  }

  return (
    <div className="relative">
      <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-2 shadow-[0_22px_80px_rgba(0,0,0,0.50)] backdrop-blur-2xl">
        {/* top highlight + subtle polish */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.10] via-white/[0.02] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
          <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[rgba(120,76,255,0.10)] blur-2xl" />
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[rgba(255,255,255,0.06)] blur-2xl" />
        </div>

        <div className="relative flex w-full items-center gap-3">
          <div className="pointer-events-none hidden shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-zinc-300 sm:inline-flex">
            <span className="font-mono text-zinc-200">⌘</span>
            <span className="text-white/20">+</span>
            <span className="font-mono text-zinc-200">/</span>
          </div>

          <input
            id="vantera-city-search"
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 120)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSubmit();
                return;
              }
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setOpen(true);
                setActive((v) => Math.min(v + 1, Math.max(0, results.length - 1)));
                return;
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setOpen(true);
                setActive((v) => Math.max(v - 1, 0));
                return;
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                setOpen(false);
                setQ('');
                setActive(0);
                inputRef.current?.blur();
              }
            }}
            placeholder="Search a city..."
            className="h-11 w-full bg-transparent px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
            spellCheck={false}
            autoComplete="off"
            aria-label="Search a city"
          />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onSubmit}
            className={[
              'group relative h-11 shrink-0 overflow-hidden rounded-xl px-5 text-sm font-semibold',
              'border border-white/10 bg-white/[0.03] text-zinc-100',
              'shadow-[0_12px_38px_rgba(0,0,0,0.45)]',
              'transition hover:border-white/18 hover:bg-white/[0.05]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
            ].join(' ')}
          >
            <span className="pointer-events-none absolute inset-0 opacity-70">
              <span className="absolute -left-1/3 top-0 h-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            </span>
            <span className="relative">Open</span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+12px)] z-20 overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-[0_26px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
          {/* dropdown polish */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />
          </div>

          <div className="relative p-2">
            {results.length > 0 ? (
              <ul className="space-y-1">
                {results.map((c, idx) => (
                  <li key={c.slug}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => go(c.slug)}
                      className={[
                        'group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition',
                        idx === active ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]',
                      ].join(' ')}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative h-9 w-12 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                          {c.image?.src ? (
                            <SafeImage
                              src={c.image.src}
                              alt={c.image.alt ?? `${c.name} thumbnail`}
                              fill
                              sizes="48px"
                              className="object-cover opacity-[0.92] transition duration-500 group-hover:opacity-100"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
                          )}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-zinc-100">
                            {c.name}
                          </div>
                          <div className="truncate text-xs text-zinc-500">
                            {c.country}
                            {c.region ? ` · ${c.region}` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <CityLocalTime
                          tz={c.tz}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-100 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                        />
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300 shadow-[0_10px_30px_rgba(0,0,0,0.30)]">
                          /city/{c.slug}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-4">
                <div className="text-sm font-semibold text-zinc-200">No results</div>
                <div className="mt-1 text-xs text-zinc-500">
                  Try {examples.map((x, i) => (i === examples.length - 1 ? x : `${x}, `))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
