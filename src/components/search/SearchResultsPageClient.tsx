// src/components/search/SearchResultsPageClient.tsx
'use client';

import Image from 'next/image';
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
type SortKey = 'price_high' | 'price_low' | 'beds' | 'sqm' | 'newest';

type ListingCard = {
  id: string;
  slug: string;

  title: string;
  headline?: string | null;

  price: number | null;
  currency: string;

  bedrooms: number | null;
  bathrooms: number | null;

  builtM2: number | null;
  plotM2: number | null;

  propertyType: string | null;

  city: {
    name: string;
    slug: string;
    country: string;
    region?: string | null;
  };

  cover: {
    url: string;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;

  updatedAtISO: string;
};

type Props = {
  searchParams?: SearchParams;

  listings: ListingCard[];
  total: number;

  page: number;
  pageCount: number;
  take: number;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function firstString(v: string | string[] | undefined) {
  if (!v) return '';
  return Array.isArray(v) ? v[0] ?? '' : v;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function shortMoney(currency: string, n: number) {
  const sym = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '';
  if (n >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
  if (n >= 1_000) return `${sym}${Math.round(n / 1_000)}k`;
  return `${sym}${n}`;
}

function buildUrl(next: Record<string, string | number | undefined>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(next)) {
    if (v === undefined) continue;
    const s = String(v).trim();
    if (!s) continue;
    p.set(k, s);
  }
  const qs = p.toString();
  return qs ? `/search?${qs}` : '/search';
}

function GoldHairline() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(185,133,51,0.55)] to-transparent opacity-70" />
    </div>
  );
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] text-zinc-700 ring-1 ring-inset ring-zinc-200">
      {children}
    </span>
  );
}

function IconPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1 text-[11px] text-zinc-700 ring-1 ring-inset ring-zinc-200">
      <span className="text-zinc-500">{icon}</span>
      <span>{label}</span>
    </span>
  );
}

function useClickOutside(
  refs: Array<React.RefObject<HTMLElement>>,
  onOutside: () => void,
  when = true,
) {
  useEffect(() => {
    if (!when) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node | null;
      if (!t) return;

      for (const r of refs) {
        const el = r.current;
        if (el && el.contains(t)) return;
      }

      onOutside();
    };

    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('touchstart', onDown, { passive: true });

    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('touchstart', onDown);
    };
  }, [refs, onOutside, when]);
}

function needsToString(needs: string[]) {
  return needs
    .map((n) => n.trim())
    .filter(Boolean)
    .slice(0, 12)
    .join(',');
}

export default function SearchResultsPageClient({ searchParams, listings, total, page, pageCount, take }: Props) {
  const router = useRouter();

  const boot = useMemo(() => {
    const sp = searchParams ?? {};
    const q = firstString(sp.q);
    const kw = firstString(sp.kw);
    const place = firstString(sp.place);
    const city = firstString(sp.city);
    const mode = (firstString(sp.mode) as Mode) || 'buy';
    const max = firstString(sp.max);
    const beds = firstString(sp.beds);
    const type = firstString(sp.type) || 'any';
    const needs = firstString(sp.needs)
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
    const sort = (firstString(sp.sort) as SortKey) || 'price_high';

    return {
      q,
      kw,
      place: city || place,
      mode: mode === 'rent' || mode === 'sell' ? mode : 'buy',
      max: max ? Number(max) : undefined,
      beds: beds ? Number(beds) : undefined,
      type,
      needs,
      sort,
    };
  }, [searchParams]);

  const [mode, setMode] = useState<Mode>(boot.mode);
  const [q, setQ] = useState(boot.q);
  const [place, setPlace] = useState(boot.place);
  const [kw, setKw] = useState(boot.kw);
  const [max, setMax] = useState<number | undefined>(Number.isFinite(boot.max as number) ? boot.max : undefined);
  const [beds, setBeds] = useState<number | undefined>(Number.isFinite(boot.beds as number) ? boot.beds : undefined);
  const [type, setType] = useState<string>(boot.type || 'any');
  const [needs, setNeeds] = useState<string[]>(boot.needs ?? []);
  const [sort, setSort] = useState<SortKey>(boot.sort);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [sortOpen, setSortOpen] = useState(false);
  const sortBtnRef = useRef<HTMLButtonElement | null>(null);
  const sortMenuRef = useRef<HTMLDivElement | null>(null);
  useClickOutside([sortBtnRef, sortMenuRef], () => setSortOpen(false), sortOpen);

  const activeNeeds = new Set(needs.map((x) => normalize(x)));

  function toggleNeed(n: string) {
    setNeeds((prev) => {
      const nn = normalize(n);
      const set = new Set(prev.map((x) => normalize(x)));
      if (set.has(nn)) return prev.filter((x) => normalize(x) !== nn);
      return [...prev, n];
    });
  }

  function applyToUrl(nextPage?: number) {
    router.push(
      buildUrl({
        q: q.trim() || undefined,
        place: place.trim() || undefined,
        kw: kw.trim() || undefined,
        mode: mode !== 'buy' ? mode : undefined,
        max: typeof max === 'number' && Number.isFinite(max) ? Math.round(max) : undefined,
        beds: typeof beds === 'number' && Number.isFinite(beds) ? Math.round(beds) : undefined,
        type: type && normalize(type) !== 'any' ? type : undefined,
        needs: needs.length ? needsToString(needs) : undefined,
        sort: sort !== 'price_high' ? sort : undefined,
        page: nextPage && nextPage !== 1 ? nextPage : undefined,
        take: take !== 24 ? take : undefined,
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
    if (max) bits.push(`under ${shortMoney('EUR', max)}`);
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
          : sort === 'newest'
            ? 'newest'
            : 'price: high to low';

  return (
    <div className="relative min-h-screen bg-white">
      {/* Top rail */}
      <div className="sticky top-0 z-30 bg-white/88 backdrop-blur">
        <div className="relative">
          <GoldHairline />
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[12px] text-zinc-500">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white ring-1 ring-inset ring-zinc-200">
                    <Search className="h-4 w-4" />
                  </span>
                  <span>Search</span>
                </div>

                <div className="mt-1 text-[20px] font-semibold text-zinc-900">
                  Results
                  <span className="ml-2 text-[13px] font-medium text-zinc-500">
                    {total ? `${total.toLocaleString()} available` : 'No matches'}
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
                  <span>Filters</span>
                </button>

                <div className="relative">
                  <button
                    ref={sortBtnRef}
                    type="button"
                    onClick={() => setSortOpen((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] text-zinc-800 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
                    <span>{sortLabel}</span>
                    <ChevronDown className={cx('h-4 w-4 text-zinc-500 transition', sortOpen && 'rotate-180')} />
                  </button>

                  {sortOpen ? (
                    <div
                      ref={sortMenuRef}
                      className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl bg-white shadow-[0_30px_90px_rgba(0,0,0,0.10)] ring-1 ring-inset ring-zinc-200"
                    >
                      {[
                        { k: 'price_high', label: 'price: high to low' },
                        { k: 'price_low', label: 'price: low to high' },
                        { k: 'beds', label: 'beds: most first' },
                        { k: 'sqm', label: 'size: largest first' },
                        { k: 'newest', label: 'newest' },
                      ].map((x) => (
                        <button
                          key={x.k}
                          type="button"
                          onClick={() => {
                            setSort(x.k as SortKey);
                            setSortOpen(false);
                            applyToUrl(1);
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
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <IconPill icon={<Sparkles className="h-4 w-4" />} label={mode} />
              {summaryBits.length ? summaryBits.map((b) => <TagPill key={b}>{b}</TagPill>) : <TagPill>Try “Marbella sea view villa under €5m”</TagPill>}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        {/* Query bar */}
        <div className="rounded-[26px] bg-white p-4 ring-1 ring-inset ring-zinc-200 shadow-[0_22px_70px_rgba(0,0,0,0.04)]">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-5">
              <label className="text-[11px] font-semibold text-zinc-500">Query</label>
              <div className="mt-1 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-inset ring-zinc-200">
                <Search className="h-4 w-4 text-zinc-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="marbella villa, sea view, gated"
                  className="w-full bg-transparent text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="text-[11px] font-semibold text-zinc-500">Place</label>
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
              <label className="text-[11px] font-semibold text-zinc-500">Keywords</label>
              <div className="mt-1 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-inset ring-zinc-200">
                <Sparkles className="h-4 w-4 text-zinc-500" />
                <input
                  value={kw}
                  onChange={(e) => setKw(e.target.value)}
                  placeholder="golden mile, modern, quiet"
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
                Refine
              </button>

              <button
                type="button"
                onClick={() => applyToUrl(1)}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-[12px] text-white hover:bg-zinc-800"
              >
                Apply
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3">
              <div className="rounded-[26px] bg-white p-8 ring-1 ring-inset ring-zinc-200 shadow-[0_28px_90px_rgba(0,0,0,0.05)]">
                <div className="text-[18px] font-semibold text-zinc-900">No results</div>
                <div className="mt-2 text-[13px] text-zinc-600">Try loosening budget, bedrooms, or removing one need.</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMax(undefined);
                      applyToUrl(1);
                    }}
                    className="rounded-full bg-white px-4 py-2 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                  >
                    Remove max
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNeeds([]);
                      applyToUrl(1);
                    }}
                    className="rounded-full bg-white px-4 py-2 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                  >
                    Clear needs
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-full bg-zinc-900 px-4 py-2 text-[12px] text-white hover:bg-zinc-800"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          ) : (
            listings.map((l) => {
              const href = `/property/${l.slug}`;
              const priceLabel = l.price ? shortMoney(l.currency, l.price) : 'Price on request';
              const locLine = `${l.city.name}${l.city.region ? `, ${l.city.region}` : ''}, ${l.city.country}`;

              return (
                <div
                  key={l.id}
                  className="group rounded-[28px] bg-white p-3 ring-1 ring-inset ring-zinc-200 shadow-[0_24px_80px_rgba(0,0,0,0.05)] transition hover:shadow-[0_38px_110px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-zinc-50 ring-1 ring-inset ring-zinc-200">
                    {l.cover?.url ? (
                      <Image
                        src={l.cover.url}
                        alt={l.cover.alt ?? l.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        priority={false}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-zinc-100" />
                    )}

                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.10)] to-transparent" />
                  </div>

                  <div className="mt-3 px-1 pb-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-semibold text-zinc-900">{l.title}</div>
                        <div className="mt-1 truncate text-[12px] text-zinc-600">{locLine}</div>
                        {l.headline ? <div className="mt-2 line-clamp-2 text-[12px] text-zinc-600">{l.headline}</div> : null}
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
                      <TagPill>{priceLabel}</TagPill>
                      {l.bedrooms ? (
                        <IconPill icon={<BedDouble className="h-4 w-4" />} label={`${l.bedrooms} beds`} />
                      ) : (
                        <IconPill icon={<Home className="h-4 w-4" />} label="residence" />
                      )}
                      {l.builtM2 ? <TagPill>{l.builtM2} m²</TagPill> : null}
                      {l.propertyType ? <TagPill>{l.propertyType}</TagPill> : null}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <Link
                        href={href}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] text-zinc-900 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                      >
                        View
                        <ArrowRight className="h-4 w-4 text-zinc-500" />
                      </Link>

                      <Link href={`/city/${l.city.slug}`} className="text-[11px] text-zinc-500 hover:text-zinc-900">
                        {l.city.name}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pageCount > 1 ? (
          <div className="mt-10 flex items-center justify-between gap-3">
            <div className="text-[12px] text-zinc-600">
              Page <span className="font-semibold text-zinc-900">{page}</span> of{' '}
              <span className="font-semibold text-zinc-900">{pageCount}</span> ·{' '}
              <span className="font-semibold text-zinc-900">{total.toLocaleString()}</span> total
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => applyToUrl(Math.max(1, page - 1))}
                className={cx(
                  'rounded-full px-4 py-2 text-[12px] ring-1 ring-inset transition',
                  page > 1
                    ? 'bg-white text-zinc-900 ring-zinc-200 hover:ring-zinc-300'
                    : 'bg-zinc-50 text-zinc-400 ring-zinc-200 cursor-not-allowed',
                )}
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= pageCount}
                onClick={() => applyToUrl(Math.min(pageCount, page + 1))}
                className={cx(
                  'rounded-full px-4 py-2 text-[12px] ring-1 ring-inset transition',
                  page < pageCount
                    ? 'bg-white text-zinc-900 ring-zinc-200 hover:ring-zinc-300'
                    : 'bg-zinc-50 text-zinc-400 ring-zinc-200 cursor-not-allowed',
                )}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Filters drawer */}
      {filtersOpen ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.18)]" onClick={() => setFiltersOpen(false)} />

          <div className="absolute right-0 top-0 h-full w-full max-w-[520px] bg-white shadow-[0_40px_140px_rgba(0,0,0,0.18)]">
            <div className="relative border-b border-zinc-200 px-5 py-4">
              <GoldHairline />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[12px] font-semibold text-zinc-900">Filters</div>
                  <div className="mt-1 text-[12px] text-zinc-600">Server-applied.</div>
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                >
                  <X className="h-4 w-4 text-zinc-500" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            <div className="h-[calc(100%-72px)] overflow-auto p-5">
              <div className="grid gap-4">
                <div className="rounded-[22px] bg-white p-4 ring-1 ring-inset ring-zinc-200">
                  <div className="text-[11px] font-semibold text-zinc-500">Property type</div>
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
                      <div className="text-[11px] font-semibold text-zinc-500">Max budget</div>
                      <div className="mt-1 text-[12px] text-zinc-600">{max ? shortMoney('EUR', max) : 'No max'}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMax(undefined)}
                      className="rounded-full bg-white px-3 py-2 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                    >
                      Clear
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
                      <div className="text-[11px] font-semibold text-zinc-500">Bedrooms</div>
                      <div className="mt-1 text-[12px] text-zinc-600">{beds ? `${beds}+ beds` : 'Any'}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBeds(undefined)}
                      className="rounded-full bg-white px-3 py-2 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                    >
                      Clear
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
                  <div className="text-[11px] font-semibold text-zinc-500">Needs</div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      { k: 'sea view', icon: <Waves className="h-4 w-4 text-zinc-500" /> },
                      { k: 'waterfront', icon: <Waves className="h-4 w-4 text-zinc-500" /> },
                      { k: 'gated', icon: <ShieldCheck className="h-4 w-4 text-zinc-500" /> },
                      { k: 'privacy', icon: <ShieldCheck className="h-4 w-4 text-zinc-500" /> },
                      { k: 'quiet', icon: <Sparkles className="h-4 w-4 text-zinc-500" /> },
                      { k: 'new build', icon: <Sparkles className="h-4 w-4 text-zinc-500" /> },
                    ].map((n) => (
                      <button
                        key={n.k}
                        type="button"
                        onClick={() => toggleNeed(n.k)}
                        className={cx(
                          'inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] ring-1 ring-inset transition',
                          activeNeeds.has(normalize(n.k)) || activeNeeds.has(normalize(n.k).replace(' ', '_'))
                            ? 'bg-white text-zinc-900 ring-zinc-300'
                            : 'bg-white text-zinc-700 ring-zinc-200 hover:ring-zinc-300',
                        )}
                      >
                        {n.icon}
                        {n.k}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setNeeds([])}
                      className="rounded-full bg-white px-4 py-2 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                    >
                      Clear
                    </button>
                    <span className="text-[11px] text-zinc-500">{needs.length ? `${needs.length} selected` : 'None selected'}</span>
                  </div>
                </div>

                <div className="rounded-[22px] bg-white p-4 ring-1 ring-inset ring-zinc-200">
                  <div className="text-[11px] font-semibold text-zinc-500">Apply</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        applyToUrl(1);
                        setFiltersOpen(false);
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-[12px] text-white hover:bg-zinc-800"
                    >
                      Apply filters
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={clearAll}
                      className="rounded-full bg-white px-5 py-2.5 text-[12px] text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:ring-zinc-300"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-[11px] text-zinc-500">Filters apply to live inventory on the server.</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
