// src/components/layout/TopBar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronDown, Command, Search, X } from 'lucide-react';

import { CITIES } from '@/components/home/cities';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function isEditableTarget(el: Element | null) {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

/**
 * Unified city tab bridge (kept for compatibility).
 */
function dispatchTab(tab: 'truth' | 'supply') {
  window.dispatchEvent(new CustomEvent('vantera:tab', { detail: { tab } }));
  window.dispatchEvent(new CustomEvent('locus:tab', { detail: { tab } }));
}

type CityLite = {
  name: string;
  slug: string;
  country: string;
  region?: string | null;
  priority?: number;
};

function uniqBy<T>(arr: T[], key: (t: T) => string) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const a of arr) {
    const k = key(a);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(a);
  }
  return out;
}

function useHotkeys(pathname: string | null, router: ReturnType<typeof useRouter>) {
  const lastKeyAt = useRef<number>(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Element | null;
      if (isEditableTarget(target)) return;

      const now = Date.now();
      if (now - lastKeyAt.current < 120) return;
      lastKeyAt.current = now;

      const isK = e.key.toLowerCase() === 'k';
      const wantsSearch = e.key === '/' || (isK && (e.metaKey || e.ctrlKey));

      if (wantsSearch) {
        e.preventDefault();
        if (pathname !== '/search') router.push('/search');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pathname, router]);
}

function buildSearchHref(params: Record<string, string | number | boolean | undefined | null>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const s = String(v).trim();
    if (!s) continue;
    sp.set(k, s);
  }
  const qs = sp.toString();
  return qs ? `/search?${qs}` : '/search';
}

function pickGroupTitle(country: string) {
  const s = country.toLowerCase();
  if (s.includes('united')) return 'United';
  if (s.includes('arab')) return 'Middle East';
  return 'Countries';
}

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useHotkeys(pathname, router);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openT = useRef<number | null>(null);
  const closeT = useRef<number | null>(null);

  const onCityPage = useMemo(() => pathname?.startsWith('/city/'), [pathname]);

  const activeTab = useMemo(() => {
    const t = (searchParams?.get('tab') ?? '').toLowerCase();
    if (t === 'truth' || t === 'supply') return t;
    return 'truth';
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!megaOpen) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node | null;
      if (!t) return;

      const wrap = wrapRef.current;
      const panel = panelRef.current;

      if (wrap && wrap.contains(t)) return;
      if (panel && panel.contains(t)) return;

      setMegaOpen(false);
    };

    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('touchstart', onDown, { passive: true });
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('touchstart', onDown);
    };
  }, [megaOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Element | null;
      if (isEditableTarget(target)) return;

      if (e.key === 'Escape') {
        setMobileOpen(false);
        setMegaOpen(false);
        return;
      }

      if (!onCityPage) return;

      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'truth');
        router.replace(url.pathname + '?' + url.searchParams.toString());
        dispatchTab('truth');
        return;
      }

      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'supply');
        router.replace(url.pathname + '?' + url.searchParams.toString());
        dispatchTab('supply');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCityPage, router]);

  const cityList = useMemo<CityLite[]>(() => {
    const raw = Array.isArray(CITIES) ? (CITIES as unknown[]) : [];
    const mapped: CityLite[] = [];

    for (const item of raw) {
      const c = item as any;
      if (!c) continue;

      const name = typeof c.name === 'string' ? c.name.trim() : '';
      const slug = typeof c.slug === 'string' ? c.slug.trim() : '';
      const country = typeof c.country === 'string' ? c.country.trim() : '';
      const region = typeof c.region === 'string' ? c.region.trim() : c.region ?? null;
      const priority = typeof c.priority === 'number' ? c.priority : 0;

      if (!name || !slug || !country) continue;
      mapped.push({ name, slug, country, region, priority });
    }

    mapped.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    return mapped;
  }, []);

  const countries = useMemo(() => {
    const preferred = [
      'Spain',
      'France',
      'United Arab Emirates',
      'United States',
      'United Kingdom',
      'Monaco',
      'Portugal',
      'Italy',
      'Switzerland',
      'Greece',
      'Germany',
      'Netherlands',
    ];

    const present = uniqBy(
      cityList
        .map((c) => c.country)
        .filter(Boolean)
        .map((c) => String(c)),
      (x) => x.toLowerCase(),
    );

    const ordered = [
      ...preferred.filter((p) => present.some((x) => x.toLowerCase() === p.toLowerCase())),
      ...present.filter((x) => !preferred.some((p) => p.toLowerCase() === x.toLowerCase())),
    ];

    return ordered.slice(0, 12);
  }, [cityList]);

  // 8 flagship cities in Explore mega panel
  const topCities = useMemo(() => cityList.slice(0, 8), [cityList]);

  function countryHref(country: string) {
    return buildSearchHref({ country });
  }

  function cancelTimers() {
    if (openT.current) window.clearTimeout(openT.current);
    if (closeT.current) window.clearTimeout(closeT.current);
    openT.current = null;
    closeT.current = null;
  }

  function openMegaSoon() {
    cancelTimers();
    openT.current = window.setTimeout(() => setMegaOpen(true), 70);
  }

  function closeMegaSoon() {
    cancelTimers();
    closeT.current = window.setTimeout(() => setMegaOpen(false), 140);
  }

  function toggleMega() {
    cancelTimers();
    setMegaOpen((v) => !v);
  }

  function openSearchResultsFromAnywhere() {
    if (pathname !== '/search') router.push('/search');
  }

  // routes (marketplace-first)
  const sellLabel = 'List privately';
  const sellHref = '/coming-soon?flow=sell';

  const marketplaceHref = '/marketplace';
  const listingsHref = '/listings';

  // layout
  const BAR_INNER = 'mx-auto flex w-full max-w-[1760px] items-center px-5 sm:px-8 lg:px-14 2xl:px-20';
  const STRIP_INNER = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';

  // royal header shell (white editorial + visible gold)
  const barShell = cx(
    'relative w-full',
    'bg-white/78 backdrop-blur-[22px]',
    'shadow-[0_1px_0_rgba(10,10,12,0.06)]',
    scrolled && 'bg-white/88 shadow-[0_1px_0_rgba(10,10,12,0.08)]',
  );

  // editorial nav
  const navLink =
    'relative inline-flex h-10 items-center px-1 text-[13px] font-medium text-[color:var(--ink-2)] transition ' +
    'hover:text-[color:var(--ink)]';
  const navActive =
    'text-[color:var(--ink)] after:absolute after:left-1 after:right-1 after:bottom-1 after:h-px after:bg-[rgba(206,160,74,0.88)] after:opacity-100';

  const iconMuted = 'text-[color:var(--ink-3)]';

  // right side actions (royal treatment)
  const signatureSearch =
    'group relative inline-flex h-10 items-center gap-2 px-4 transition select-none ' +
    'border border-[rgba(10,10,12,0.12)] bg-white/92 hover:border-[rgba(10,10,12,0.22)]';

  const primaryCta =
    'relative inline-flex h-10 items-center justify-between gap-3 px-5 text-sm font-semibold transition ' +
    'border border-[rgba(10,10,12,0.16)] text-white ' +
    'bg-[linear-gradient(180deg,rgba(10,10,12,0.96),rgba(10,10,12,0.88))] hover:bg-[linear-gradient(180deg,rgba(10,10,12,1.0),rgba(10,10,12,0.92))]';

  // country strip
  const stripItem =
    'relative inline-flex h-8 items-center px-2 text-[12px] text-[color:var(--ink-2)] transition ' +
    'hover:text-[color:var(--ink)]';
  const stripActive =
    'text-[color:var(--ink)] after:absolute after:left-2 after:right-2 after:bottom-1 after:h-px after:bg-[rgba(206,160,74,0.80)] after:opacity-100';

  const activeCountry = (searchParams?.get('country') ?? '').trim();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className={barShell}>
        {/* Royal crown stack + gilded edges */}
        <div className="pointer-events-none absolute inset-0">
          {/* top/bottom hairlines */}
          <div className="absolute inset-x-0 top-0 h-px bg-[rgba(10,10,12,0.10)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-[rgba(10,10,12,0.10)]" />

          {/* crown lines */}
          <div className="absolute inset-x-0 top-0">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.95)] to-transparent opacity-90" />
            <div className="h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.62)] to-transparent opacity-80" />
          </div>

          {/* subtle gold wash so it reads premium everywhere, not only hero */}
          <div className="absolute inset-0 bg-[radial-gradient(900px_220px_at_18%_0%,rgba(206,160,74,0.10),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_220px_at_82%_0%,rgba(231,201,130,0.08),transparent_58%)]" />

          {/* micro grain */}
          <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.22)_1px,transparent_0)] [background-size:28px_28px]" />
        </div>

        {/* Row 1 */}
        <div className={cx('relative', BAR_INNER, 'py-3')}>
          {/* Brand */}
          <Link href="/" prefetch aria-label="Vantera home" className="group relative flex shrink-0 items-center">
            {/* gold halo behind mark */}
            <span className="pointer-events-none absolute -inset-x-3 -inset-y-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(120px_36px_at_35%_50%,rgba(206,160,74,0.22),transparent_70%)]" />
            <Image
  src="/brand/vantera-landscape-black.svg"
  alt="Vantera"
  width={420}
  height={120}
  priority
  className={cx(
    'relative h-[22px] w-auto sm:h-[26px] md:h-[28px]'
  )}
/>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center lg:flex" aria-label="Primary">
            <div className="flex items-center gap-7">
              {/* Explore (mega) */}
              <div ref={wrapRef} className="relative" onPointerEnter={openMegaSoon} onPointerLeave={closeMegaSoon}>
                <button
                  type="button"
                  onClick={toggleMega}
                  onFocus={() => setMegaOpen(true)}
                  className={cx(
                    'relative inline-flex h-10 items-center gap-2 px-1 text-[13px] font-medium transition select-none',
                    'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                    megaOpen && 'text-[color:var(--ink)]',
                  )}
                  aria-expanded={megaOpen}
                  aria-haspopup="menu"
                >
                  <span>Explore</span>
                  <ChevronDown className={cx('h-4 w-4 transition', megaOpen && 'rotate-180', iconMuted)} />
                  <span
                    className={cx(
                      'absolute left-1 right-1 bottom-1 h-px bg-[rgba(206,160,74,0.88)] opacity-0 transition-opacity',
                      megaOpen && 'opacity-100',
                    )}
                  />
                </button>

                {/* Mega backdrop */}
                <div
                  className={cx('fixed inset-0 z-[70]', megaOpen ? 'pointer-events-auto' : 'pointer-events-none')}
                  aria-hidden={!megaOpen}
                >
                  <div
                    className={cx(
                      'absolute inset-0 transition-opacity duration-200',
                      megaOpen ? 'opacity-100' : 'opacity-0',
                      'bg-[rgba(10,10,12,0.28)]',
                    )}
                  />
                  <div
                    className={cx(
                      'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200',
                      megaOpen && 'opacity-100',
                      '[background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] [background-size:28px_28px]',
                    )}
                  />
                </div>

                {/* Mega panel */}
                <div
                  ref={panelRef}
                  onPointerEnter={() => {
                    cancelTimers();
                    setMegaOpen(true);
                  }}
                  onPointerLeave={closeMegaSoon}
                  className={cx(
                    'fixed left-1/2 top-[72px] z-[80] w-[1220px] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 origin-top',
                    'overflow-hidden border border-[rgba(10,10,12,0.14)]',
                    'bg-[rgba(255,255,255,0.985)]',
                    'backdrop-blur-[12px]',
                    'shadow-[0_60px_210px_rgba(10,10,12,0.26)]',
                    'transition-[transform,opacity] duration-200',
                    megaOpen
                      ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                      : 'pointer-events-none -translate-y-2 scale-[0.99] opacity-0',
                  )}
                  role="menu"
                  aria-label="Explore menu"
                >
                  {/* crown + depth */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-x-0 top-0">
                      <div className="h-[2px] bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.95)] to-transparent opacity-90" />
                      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.62)] to-transparent opacity-85" />
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(206,160,74,0.12),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.68),rgba(255,255,255,0.92))]" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-[rgba(10,10,12,0.10)]" />
                  </div>

                  {/* Header */}
                  <div className="relative flex items-start justify-between gap-6 px-8 py-7">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">EXPLORE</div>
                      <div className="mt-3 max-w-[74ch] text-[28px] leading-[1.05] font-semibold text-[color:var(--ink)]">
                        A global luxury marketplace built city by city.
                      </div>
                      <div className="mt-2 max-w-[74ch] text-[13px] leading-relaxed text-[color:var(--ink-2)]">
                        Countries and flagship cities. Clean entry points.
                      </div>

                      <div className="mt-4 h-px w-24 bg-gradient-to-r from-[rgba(206,160,74,0.95)] to-transparent" />

                      {/* quick country tabs */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {countries.map((c) => (
                          <Link
                            key={c}
                            href={countryHref(c)}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className={cx(
                              'relative px-3.5 py-2 text-[12px] transition',
                              'border border-[rgba(10,10,12,0.12)] bg-white',
                              'hover:border-[rgba(10,10,12,0.22)]',
                              'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                            )}
                            role="menuitem"
                          >
                            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.38)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            {c}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href="/search"
                        prefetch
                        onClick={() => setMegaOpen(false)}
                        className={cx(
                          'relative inline-flex items-center gap-2 px-3.5 py-2 text-[12px] transition',
                          'border border-[rgba(10,10,12,0.12)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                          'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                        )}
                      >
                        <Command className={cx('h-4 w-4', iconMuted)} />
                        Search <span className="ml-1 font-mono text-[11px] text-[color:var(--ink-3)]">/</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setMegaOpen(false)}
                        className={cx(
                          'relative inline-flex items-center gap-2 px-3.5 py-2 text-[12px] transition',
                          'border border-[rgba(10,10,12,0.12)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                          'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                        )}
                      >
                        <X className={cx('h-4 w-4', iconMuted)} />
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="relative grid grid-cols-12 gap-7 px-8 pb-8">
                    {/* Left: flagship cities */}
                    <div className="col-span-8">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                          FLAGSHIP CITIES
                        </div>
                        <div className="text-[11px] tracking-[0.22em] text-[color:var(--ink-3)]">
                          {pickGroupTitle(activeCountry || 'Countries')}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {topCities.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/city/${c.slug}`}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className={cx(
                              'group relative px-4 py-3 transition',
                              'border border-[rgba(10,10,12,0.12)] bg-white',
                              'hover:border-[rgba(10,10,12,0.22)]',
                            )}
                            role="menuitem"
                          >
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.40)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="truncate text-[14px] font-semibold text-[color:var(--ink)]">{c.name}</div>
                                <div className="mt-0.5 truncate text-[11px] tracking-[0.18em] text-[color:var(--ink-3)]">
                                  {c.country}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between border border-[rgba(10,10,12,0.12)] bg-[rgba(10,10,12,0.03)] px-4 py-3">
                        <div className="text-xs text-[color:var(--ink-2)]">Fast entry. Clean navigation.</div>
                        <Link
                          href="/search"
                          prefetch
                          onClick={() => setMegaOpen(false)}
                          className="inline-flex items-center gap-2 text-xs text-[color:var(--ink-2)] hover:text-[color:var(--ink)] transition"
                        >
                          Browse all
                        </Link>
                      </div>
                    </div>

                    {/* Right: Search Atelier + submissions */}
                    <div className="col-span-4 space-y-3">
                      <div className="relative border border-[rgba(10,10,12,0.12)] bg-white p-4">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.55)] to-transparent" />
                        <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                          SEARCH ATELIER
                        </div>
                        <div className="mt-1 text-xs text-[color:var(--ink-2)]">
                          The fastest way to serious property intelligence.
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setMegaOpen(false);
                            router.push('/search');
                          }}
                          className={cx(
                            'mt-4 inline-flex w-full items-center justify-between px-4 py-3 text-sm transition',
                            'border border-[rgba(10,10,12,0.12)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                            'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                          )}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Search className="h-4 w-4 text-[color:var(--ink-3)]" />
                            Search
                            <span className="ml-1 font-mono text-xs text-[color:var(--ink-3)]">/</span>
                          </span>
                          <ArrowRight className="h-4 w-4 opacity-70" />
                        </button>

                        <div className="mt-3 text-[11px] text-[color:var(--ink-3)]">
                          Tip: press <span className="font-mono text-[color:var(--ink-2)]">/</span> anywhere.
                        </div>
                      </div>

                      <div className="relative border border-[rgba(10,10,12,0.12)] bg-white p-4">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.55)] to-transparent" />
                        <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                          SUBMISSIONS
                        </div>
                        <div className="mt-1 text-xs text-[color:var(--ink-2)]">Private by architecture.</div>

                        <Link
                          href={sellHref}
                          prefetch
                          onClick={() => setMegaOpen(false)}
                          className={cx('mt-4 inline-flex w-full', primaryCta)}
                        >
                          {/* gold edge + sheen */}
                          <span className="pointer-events-none absolute inset-0">
                            <span className="absolute inset-0 ring-1 ring-inset ring-[rgba(206,160,74,0.18)]" />
                            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.75)] to-transparent opacity-90" />
                            <span className="absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-[linear-gradient(90deg,transparent,rgba(231,201,130,0.16),transparent)] opacity-60" />
                          </span>

                          <span className="relative">{sellLabel}</span>
                          <ArrowRight className="relative h-4 w-4 opacity-85" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link href={marketplaceHref} prefetch className={cx(navLink, pathname === '/marketplace' && navActive)}>
                Marketplace
              </Link>
              <Link href={listingsHref} prefetch className={cx(navLink, pathname?.startsWith('/listings') && navActive)}>
                Listings
              </Link>
            </div>
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex shrink-0 items-center gap-2.5">
            <div className="hidden items-center gap-2.5 sm:flex">
              <button type="button" onClick={openSearchResultsFromAnywhere} className={signatureSearch} aria-label="Search">
                {/* crown microline */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.40)] to-transparent opacity-70" />

                <Search className="h-4 w-4 text-[color:var(--ink-3)]" />
                <span className="text-[13px] text-[color:var(--ink-2)] group-hover:text-[color:var(--ink)] transition">
                  Search
                </span>
                <span className="text-[color:var(--ink-3)]/40">·</span>
                <span className="font-mono text-xs text-[color:var(--ink-3)]">/</span>
              </button>

              <Link href={sellHref} prefetch className={primaryCta} aria-label={sellLabel}>
                {/* gold edge + sheen */}
                <span className="pointer-events-none absolute inset-0">
                  <span className="absolute inset-0 ring-1 ring-inset ring-[rgba(206,160,74,0.18)]" />
                  <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.75)] to-transparent opacity-90" />
                  <span className="absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-[linear-gradient(90deg,transparent,rgba(231,201,130,0.16),transparent)] opacity-60" />
                </span>

                <span className="relative">{sellLabel}</span>
                <ArrowRight className="relative h-4 w-4 opacity-80" />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={cx(
                'relative inline-flex h-10 items-center gap-2 px-4 text-sm transition lg:hidden',
                'border border-[rgba(10,10,12,0.12)] bg-white/92 hover:border-[rgba(10,10,12,0.22)]',
                'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
              )}
              aria-expanded={mobileOpen}
              aria-controls="vantera-mobile-menu"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.40)] to-transparent opacity-70" />
              Menu
              <ChevronDown className={cx('h-4 w-4 transition text-[color:var(--ink-3)]', mobileOpen && 'rotate-180')} />
            </button>
          </div>
        </div>

        {/* Row 2: countries strip (thin, quiet) */}
        <div className="relative hidden lg:block">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[rgba(10,10,12,0.10)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[rgba(10,10,12,0.10)]" />

          {/* extra crown line in strip */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.35)] to-transparent opacity-80" />

          <div className={cx('relative flex h-9 items-center', STRIP_INNER)}>
            <div className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto pr-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {countries.map((c) => {
                const active = activeCountry && c.toLowerCase() === activeCountry.toLowerCase();
                return (
                  <Link
                    key={c}
                    href={countryHref(c)}
                    prefetch
                    className={cx(stripItem, active && stripActive)}
                    aria-current={active ? 'page' : undefined}
                  >
                    {c}
                  </Link>
                );
              })}
            </div>

            <div className="hidden xl:flex shrink-0 items-center gap-2 pl-3 text-[11px] tracking-[0.22em] text-[color:var(--ink-3)]">
              <span className="h-1.5 w-1.5 bg-[rgba(206,160,74,0.70)]" />
              Countries
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="vantera-mobile-menu"
        className={cx('fixed inset-0 z-[90] lg:hidden', mobileOpen ? 'pointer-events-auto' : 'pointer-events-none')}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className={cx('absolute inset-0 bg-black/20 transition-opacity', mobileOpen ? 'opacity-100' : 'opacity-0')}
        />

        <div
          className={cx(
            'absolute right-0 top-0 h-full w-[92vw] max-w-[480px]',
            'bg-white backdrop-blur-[20px]',
            'border-l border-[rgba(10,10,12,0.10)]',
            'shadow-[-30px_0_140px_rgba(10,10,12,0.16)]',
            'transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_26%_0%,rgba(10,10,12,0.05),transparent_62%)]" />
            <div className="absolute inset-x-0 top-0">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.90)] to-transparent opacity-85" />
              <div className="h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.55)] to-transparent opacity-80" />
            </div>
          </div>

          <div className="relative flex items-center justify-between px-5 py-5">
            <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">Menu</div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={cx(
                'relative inline-flex items-center gap-2 px-3.5 py-2 text-[12px] transition',
                'border border-[rgba(10,10,12,0.12)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
              )}
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.40)] to-transparent opacity-70" />
              <X className="h-4 w-4 text-[color:var(--ink-3)]" />
              Close
            </button>
          </div>

          {/* rest of mobile panel exactly as you had it */}
          <div className="relative space-y-4 px-5 pb-6">
            {/* Actions */}
            <div className="border border-[color:var(--hairline)] bg-[rgba(10,10,12,0.02)] p-4">
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">Actions</div>
              <div className="mt-1 text-xs text-[color:var(--ink-2)]">Search and submissions.</div>

              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => {
                    router.push('/search');
                    setMobileOpen(false);
                  }}
                  className={cx(
                    'inline-flex w-full items-center justify-between px-4 py-3 text-sm transition',
                    'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                    'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Search className="h-4 w-4 text-[color:var(--ink-3)]" />
                    Search <span className="ml-1 font-mono text-xs text-[color:var(--ink-3)]">/</span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </button>

                <Link
                  href={sellHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'relative inline-flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition',
                    'border border-[rgba(10,10,12,0.16)] text-white',
                    'bg-[linear-gradient(180deg,rgba(10,10,12,0.96),rgba(10,10,12,0.88))] hover:bg-[linear-gradient(180deg,rgba(10,10,12,1.0),rgba(10,10,12,0.92))]',
                  )}
                >
                  <span className="pointer-events-none absolute inset-0">
                    <span className="absolute inset-0 ring-1 ring-inset ring-[rgba(206,160,74,0.18)]" />
                    <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.75)] to-transparent opacity-90" />
                    <span className="absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-[linear-gradient(90deg,transparent,rgba(231,201,130,0.16),transparent)] opacity-60" />
                  </span>

                  <span className="relative">{sellLabel}</span>
                  <ArrowRight className="relative h-4 w-4 opacity-85" />
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <div className="border border-[color:var(--hairline)] bg-[rgba(10,10,12,0.02)] p-4">
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">Navigation</div>

              <div className="mt-3 grid gap-2">
                <Link
                  href={marketplaceHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between px-4 py-3 text-sm transition',
                    'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                    'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                  )}
                >
                  <span>Marketplace</span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Link>

                <Link
                  href={listingsHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between px-4 py-3 text-sm transition',
                    'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                    'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                  )}
                >
                  <span>Listings</span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Link>
              </div>
            </div>

            {/* Explore */}
            <div className="border border-[color:var(--hairline)] bg-[rgba(10,10,12,0.02)] p-4">
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">Explore</div>

              <div className="mt-3 flex flex-wrap gap-2">
                {countries.map((c) => (
                  <Link
                    key={c}
                    href={countryHref(c)}
                    prefetch
                    onClick={() => setMobileOpen(false)}
                    className={cx(
                      'px-3 py-1.5 text-[12px] transition',
                      'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                      'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                    )}
                  >
                    {c}
                  </Link>
                ))}
              </div>

              <div className="mt-4 grid gap-2">
                {topCities.slice(0, 6).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/city/${c.slug}`}
                    prefetch
                    onClick={() => setMobileOpen(false)}
                    className={cx(
                      'relative px-3.5 py-3 transition',
                      'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                    )}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(206,160,74,0.35)] to-transparent opacity-70" />
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[color:var(--ink)]">{c.name}</div>
                        <div className="truncate text-[11px] tracking-[0.18em] text-[color:var(--ink-3)]">{c.country}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-70 text-[color:var(--ink)]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* City page switch (kept) */}
            {onCityPage ? (
              <div className="border border-[color:var(--hairline)] bg-[rgba(10,10,12,0.02)] p-4">
                <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">City view</div>
                <div className="mt-1 text-xs text-[color:var(--ink-2)]">Switch: facts (T) or live market (L).</div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set('tab', 'truth');
                      router.replace(url.pathname + '?' + url.searchParams.toString());
                      dispatchTab('truth');
                      setMobileOpen(false);
                    }}
                    className={cx(
                      'flex-1 px-3 py-2 text-sm transition',
                      'border border-[color:var(--hairline)]',
                      activeTab === 'truth'
                        ? 'bg-white text-[color:var(--ink)]'
                        : 'bg-white hover:border-[rgba(10,10,12,0.22)] text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                    )}
                  >
                    Facts <span className="ml-1 font-mono text-[11px] text-[color:var(--ink-3)]">T</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set('tab', 'supply');
                      router.replace(url.pathname + '?' + url.searchParams.toString());
                      dispatchTab('supply');
                      setMobileOpen(false);
                    }}
                    className={cx(
                      'flex-1 px-3 py-2 text-sm transition',
                      'border border-[color:var(--hairline)]',
                      activeTab === 'supply'
                        ? 'bg-white text-[color:var(--ink)]'
                        : 'bg-white hover:border-[rgba(10,10,12,0.22)] text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                    )}
                  >
                    Live market <span className="ml-1 font-mono text-[11px] text-[color:var(--ink-3)]">L</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="pt-1 text-[11px] text-[color:var(--ink-3)]">White, editorial, quiet. Gold crown.</div>
          </div>
        </div>
      </div>
    </header>
  );
}
