// src/components/search/SearchResultsPageClient.tsx
'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BedDouble,
  ChevronDown,
  Filter,
  Heart,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Waves,
  X,
} from 'lucide-react';

export type SearchParams = Record<string, string | string[] | undefined>;

type Mode = 'buy' | 'rent' | 'sell';

type Initial = {
  q: string;
  place: string;
  kw: string;
  mode: Mode;
  max?: number;
  beds?: number;
  type: string;
  needs: string[];
};

type Props = {
  // NEW: server passes URL params here
  searchParams?: SearchParams;

  // OLD: keep support if something still uses it
  initial?: Initial;
};

// helper: always produce a full Initial object (so the rest of your code stays unchanged)
function initialFromSearchParams(sp?: SearchParams): Initial {
  const get = (k: string) => {
    const v = sp?.[k];
    if (Array.isArray(v)) return v[0] ?? '';
    return typeof v === 'string' ? v : '';
  };

  const q = get('q');
  const place = get('place');
  const kw = get('kw');

  const modeRaw = get('mode');
  const mode: Mode = modeRaw === 'rent' || modeRaw === 'sell' ? modeRaw : 'buy';

  const maxRaw = get('max');
  const maxNum = maxRaw ? Number(maxRaw) : undefined;
  const max = Number.isFinite(maxNum as number) ? (maxNum as number) : undefined;

  const bedsRaw = get('beds');
  const bedsNum = bedsRaw ? Number(bedsRaw) : undefined;
  const beds = Number.isFinite(bedsNum as number) ? (bedsNum as number) : undefined;

  const type = get('type') || 'any';

  const needsRaw = get('needs');
  const needs = needsRaw
    ? needsRaw
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
    : [];

  return {
    q,
    place,
    kw,
    mode,
    max,
    beds,
    type,
    needs,
  };
}

export default function SearchResultsPageClient({ searchParams, initial }: Props) {
  const router = useRouter();

  // ✅ unify: prefer searchParams (URL truth), fall back to initial
  const boot: Initial = useMemo(() => {
    if (searchParams && Object.keys(searchParams).length) return initialFromSearchParams(searchParams);
    if (initial) return initial;
    return initialFromSearchParams(undefined);
  }, [searchParams, initial]);

  const [mode, setMode] = useState<Mode>(boot.mode ?? 'buy');
  const [q, setQ] = useState(boot.q ?? '');
  const [place, setPlace] = useState(boot.place ?? '');
  const [kw, setKw] = useState(boot.kw ?? '');
  const [max, setMax] = useState<number | undefined>(boot.max);
  const [beds, setBeds] = useState<number | undefined>(boot.beds);
  const [type, setType] = useState<string>(boot.type || 'any');
  const [needs, setNeeds] = useState<string[]>(boot.needs ?? []);

  const [sort, setSort] = useState<'price_high' | 'price_low' | 'beds' | 'sqm'>('price_high');

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [sortOpen, setSortOpen] = useState(false);
  const sortBtnRef = useRef<HTMLButtonElement | null>(null);
  const sortMenuRef = useRef<HTMLDivElement | null>(null);

  useClickOutside([sortBtnRef, sortMenuRef], () => setSortOpen(false), sortOpen);

  const baseListings = useMemo(() => makeMockListings(q || kw || place || 'global', place || ''), [q, kw, place]);

  const filters: Initial = useMemo(
    () => ({
      q,
      place,
      kw,
      mode,
      max,
      beds,
      type,
      needs,
    }),
    [q, place, kw, mode, max, beds, type, needs],
  );

  const filtered = useMemo(() => baseListings.filter((l) => matchesFilters(l, filters)), [baseListings, filters]);
  const results = useMemo(() => sortListings(filtered, sort), [filtered, sort]);

  const activeNeeds = new Set(needs.map(normalize));

  function toggleNeed(n: string) {
    setNeeds((prev) => {
      const nn = normalize(n);
      const set = new Set(prev.map(normalize));
      if (set.has(nn)) return prev.filter((x) => normalize(x) !== nn);
      return [...prev, n];
    });
  }

  function applyToUrl() {
    router.push(
      buildUrl({
        q,
        place,
        kw,
        mode,
        max,
        beds,
        type,
        needs,
      }),
    );
  }

  function clearAll() {
    setMode('buy');
    setQ('');
    setPlace('');
    setKw('');
    setMax(undefined);
    setBeds(undefined);
    setType('any');
    setNeeds([]);
    setSort('price_high');
    setSortOpen(false);
    router.push('/search');
  }

  const summaryBits = useMemo(() => {
    const bits: string[] = [];
    if (place.trim()) bits.push(place.trim());
    if (type && normalize(type) !== 'any') bits.push(type);
    if (beds) bits.push(`${beds}+ beds`);
    if (max) bits.push(`under ${shortMoneyEUR(max)}`);
    if (needs.length) bits.push(needs.slice(0, 2).join(', '));
    if (kw.trim()) bits.push(`kw: ${kw.trim()}`);
    if (q.trim() && q.trim() !== kw.trim()) bits.push(`q: ${q.trim()}`);
    return bits;
  }, [place, type, beds, max, needs, kw, q]);

  const sortLabel =
    sort === 'price_low'
      ? 'price: low to high'
      : sort === 'beds'
        ? 'beds: most first'
        : sort === 'sqm'
          ? 'size: largest first'
          : 'price: high to low';

  return (
    <div className="relative">
      {/* top bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur">
        <div className="relative">
          <GoldHairline />
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[12px] text-zinc-500">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white ring-1 ring-inset ring-zinc-200">
                    <Search className="h-4 w-4" />
                  </span>
                  <span>property search</span>
                </div>
                <div className="mt-1 text-[18px] font-semibold text-zinc-900">
                  results
                  <span className="ml-2 text-[13px] font-medium text-zinc-500">
                    {results.length ? `${results.length} matches` : 'no matches'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] text-zinc-800 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                >
                  <Filter className="h-4 w-4 text-zinc-500" />
                  <span>filters</span>
                </button>

                <div className="relative">
                  <button
                    ref={sortBtnRef}
                    type="button"
                    onClick={() => setSortOpen((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] text-zinc-800 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
                    <span>sort</span>
                    <ChevronDown className={cx('h-4 w-4 text-zinc-500 transition', sortOpen && 'rotate-180')} />
                  </button>

                  {sortOpen ? (
                    <div
                      ref={sortMenuRef}
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.10)] ring-1 ring-inset ring-zinc-200"
                    >
                      <div className="px-4 py-3 text-[11px] text-zinc-500">current: {sortLabel}</div>

                      {[
                        { k: 'price_high', label: 'price: high to low' },
                        { k: 'price_low', label: 'price: low to high' },
                        { k: 'beds', label: 'beds: most first' },
                        { k: 'sqm', label: 'size: largest first' },
                      ].map((x) => (
                        <button
                          key={x.k}
                          type="button"
                          onClick={() => {
                            setSort(x.k as any);
                            setSortOpen(false);
                          }}
                          className={cx(
                            'w-full px-4 py-3 text-left text-[12px] transition',
                            sort === x.k ? 'bg-zinc-50 text-zinc-900' : 'bg-white text-zinc-700 hover:bg-zinc-50',
                          )}
                        >
                          {x.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                >
                  <X className="h-4 w-4 text-zinc-500" />
                  <span>reset</span>
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <IconPill icon={<Sparkles className="h-4 w-4" />} label={mode} />
              {summaryBits.length ? (
                summaryBits.map((b) => <TagPill key={b}>{b}</TagPill>)
              ) : (
                <TagPill>type a city + wishline like “sea view villa under €5m”</TagPill>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        {/* query bar */}
        <div className="rounded-[24px] bg-white p-4 ring-1 ring-inset ring-zinc-200">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-5">
              <label className="text-[11px] font-semibold text-zinc-500">query</label>
              <div className="mt-1 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-inset ring-zinc-200">
                <Search className="h-4 w-4 text-zinc-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="marbella villa for sale under €5m"
                  className="w-full bg-transparent text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="text-[11px] font-semibold text-zinc-500">place</label>
              <div className="mt-1 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-inset ring-zinc-200">
                <MapPin className="h-4 w-4 text-zinc-500" />
                <input
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="marbella"
                  className="w-full bg-transparent text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="md:col-span-4">
              <label className="text-[11px] font-semibold text-zinc-500">keywords</label>
              <div className="mt-1 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-inset ring-zinc-200">
                <Sparkles className="h-4 w-4 text-zinc-500" />
                <input
                  value={kw}
                  onChange={(e) => setKw(e.target.value)}
                  placeholder="sea view, modern, gated"
                  className="w-full bg-transparent text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {(['buy', 'rent', 'sell'] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cx(
                    'rounded-full px-3 py-2 text-[12px] ring-1 ring-inset transition',
                    mode === m
                      ? 'bg-white text-zinc-900 ring-zinc-300'
                      : 'bg-white text-zinc-700 ring-zinc-200 hover:ring-zinc-300',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="rounded-full bg-white px-4 py-2 text-[12px] text-zinc-800 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
              >
                refine
              </button>

              <button
                type="button"
                onClick={applyToUrl}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-[12px] text-white hover:bg-zinc-800"
              >
                apply
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* results grid */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3">
              <div className="rounded-[24px] bg-white p-8 ring-1 ring-inset ring-zinc-200">
                <div className="text-[18px] font-semibold text-zinc-900">no matches</div>
                <div className="mt-2 text-[13px] text-zinc-600">loosen one filter. try removing max price or needs.</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setMax(undefined)}
                    className="rounded-full bg-white px-4 py-2 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                  >
                    remove max
                  </button>
                  <button
                    type="button"
                    onClick={() => setNeeds([])}
                    className="rounded-full bg-white px-4 py-2 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                  >
                    clear needs
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-full bg-zinc-900 px-4 py-2 text-[12px] text-white hover:bg-zinc-800"
                  >
                    reset all
                  </button>
                </div>
              </div>
            </div>
          ) : (
            results.map((l) => (
              <div key={l.id} className="rounded-[26px] bg-white p-3 ring-1 ring-inset ring-zinc-200">
                <CardImage seed={l.imageSeed} />

                <div className="mt-3 px-1 pb-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold text-zinc-900">{l.title}</div>
                      <div className="mt-1 truncate text-[12px] text-zinc-600">{l.locationLine}</div>
                    </div>

                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                      aria-label="save"
                      title="save"
                    >
                      <Heart className="h-4 w-4 text-zinc-500" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <TagPill>{shortMoneyEUR(l.priceEUR)}</TagPill>
                    {l.beds ? (
                      <IconPill icon={<BedDouble className="h-4 w-4" />} label={`${l.beds} beds`} />
                    ) : (
                      <IconPill icon={<Home className="h-4 w-4" />} label="plot" />
                    )}
                    <TagPill>{l.sqm} sqm</TagPill>
                    <TagPill>{l.type}</TagPill>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {l.tags.slice(0, 3).map((t) => (
                      <TagPill key={t}>{t}</TagPill>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <Link
                      href={l.href}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] text-zinc-800 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                    >
                      open
                      <ArrowRight className="h-4 w-4 text-zinc-500" />
                    </Link>

                    <span className="text-[11px] text-zinc-500">vantera verified soon</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* filters drawer */}
      {filtersOpen ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.18)]" onClick={() => setFiltersOpen(false)} />

          <div className="absolute right-0 top-0 h-full w-full max-w-[520px] bg-white shadow-[0_40px_140px_rgba(0,0,0,0.18)]">
            <div className="relative border-b border-zinc-200 px-5 py-4">
              <GoldHairline />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[12px] font-semibold text-zinc-900">filters</div>
                  <div className="mt-1 text-[12px] text-zinc-600">tight, clean, forgiving</div>
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                >
                  <X className="h-4 w-4 text-zinc-500" />
                  <span>close</span>
                </button>
              </div>
            </div>

            <div className="h-[calc(100%-72px)] overflow-auto p-5">
              <div className="grid gap-4">
                <div className="rounded-[22px] bg-white p-4 ring-1 ring-inset ring-zinc-200">
                  <div className="text-[11px] font-semibold text-zinc-500">type</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {['any', 'villa', 'apartment', 'penthouse', 'house', 'plot'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={cx(
                          'rounded-2xl px-3 py-3 text-left text-[12px] ring-1 ring-inset transition',
                          normalize(type) === normalize(t)
                            ? 'bg-white text-zinc-900 ring-zinc-300'
                            : 'bg-white text-zinc-700 ring-zinc-200 hover:ring-zinc-300',
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] bg-white p-4 ring-1 ring-inset ring-zinc-200">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold text-zinc-500">max budget</div>
                      <div className="mt-1 text-[12px] text-zinc-600">{max ? shortMoneyEUR(max) : 'no max'}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMax(undefined)}
                      className="rounded-full bg-white px-3 py-2 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                    >
                      clear
                    </button>
                  </div>

                  <input
                    type="range"
                    min={250000}
                    max={25000000}
                    step={250000}
                    value={max ?? 25000000}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setMax(v >= 25000000 ? undefined : v);
                    }}
                    className="mt-3 w-full"
                  />

                  <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>€250k</span>
                    <span>€25m+</span>
                  </div>
                </div>

                <div className="rounded-[22px] bg-white p-4 ring-1 ring-inset ring-zinc-200">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold text-zinc-500">beds</div>
                      <div className="mt-1 text-[12px] text-zinc-600">{beds ? `${beds}+ beds` : 'any'}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBeds(undefined)}
                      className="rounded-full bg-white px-3 py-2 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                    >
                      clear
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[undefined, 1, 2, 3, 4, 5, 6].map((b) => {
                      const active = (beds ?? undefined) === (b as any);
                      return (
                        <button
                          key={String(b)}
                          type="button"
                          onClick={() => setBeds(b as any)}
                          className={cx(
                            'rounded-full px-3 py-2 text-[12px] ring-1 ring-inset transition',
                            active
                              ? 'bg-white text-zinc-900 ring-zinc-300'
                              : 'bg-white text-zinc-700 ring-zinc-200 hover:ring-zinc-300',
                          )}
                        >
                          {typeof b === 'number' ? `${b}+` : 'any'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[22px] bg-white p-4 ring-1 ring-inset ring-zinc-200">
                  <div className="text-[11px] font-semibold text-zinc-500">needs</div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <NeedChip
                      active={activeNeeds.has('sea view') || activeNeeds.has('sea_view')}
                      label="sea view"
                      icon={<Waves className="h-4 w-4" />}
                      onClick={() => toggleNeed('sea view')}
                    />
                    <NeedChip
                      active={activeNeeds.has('waterfront')}
                      label="waterfront"
                      icon={<Waves className="h-4 w-4" />}
                      onClick={() => toggleNeed('waterfront')}
                    />
                    <NeedChip
                      active={activeNeeds.has('gated')}
                      label="gated"
                      icon={<ShieldCheck className="h-4 w-4" />}
                      onClick={() => toggleNeed('gated')}
                    />
                    <NeedChip
                      active={activeNeeds.has('privacy')}
                      label="privacy"
                      icon={<ShieldCheck className="h-4 w-4" />}
                      onClick={() => toggleNeed('privacy')}
                    />
                    <NeedChip
                      active={activeNeeds.has('quiet')}
                      label="quiet"
                      icon={<Sparkles className="h-4 w-4" />}
                      onClick={() => toggleNeed('quiet')}
                    />
                    <NeedChip
                      active={activeNeeds.has('new build') || activeNeeds.has('new_build')}
                      label="new build"
                      icon={<Sparkles className="h-4 w-4" />}
                      onClick={() => toggleNeed('new build')}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setNeeds([])}
                      className="rounded-full bg-white px-4 py-2 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                    >
                      clear needs
                    </button>
                    <span className="text-[11px] text-zinc-500">
                      {needs.length ? `${needs.length} selected` : 'none selected'}
                    </span>
                  </div>
                </div>

                <div className="rounded-[22px] bg-white p-4 ring-1 ring-inset ring-zinc-200">
                  <div className="text-[11px] font-semibold text-zinc-500">apply</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        applyToUrl();
                        setFiltersOpen(false);
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-[12px] text-white hover:bg-zinc-800"
                    >
                      apply filters
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={clearAll}
                      className="rounded-full bg-white px-5 py-2.5 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                    >
                      reset all
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-[11px] text-zinc-500">
                note: listings are mocked right now. once you plug real data in, this ui stays.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
