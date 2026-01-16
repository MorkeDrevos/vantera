// src/components/layout/TopBar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronDown, Command, Globe, Search, X, Sparkles } from 'lucide-react';

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

function MonogramCoin() {
  return (
    <div
      className={cx(
        'relative grid h-9 w-9 place-items-center',
        'rounded-full',
        'border border-[rgba(10,10,12,0.12)]',
        'bg-[radial-gradient(16px_16px_at_35%_28%,rgba(255,255,255,0.85),rgba(255,255,255,0.50))]',
        'shadow-[0_10px_30px_rgba(10,10,12,0.10)]',
      )}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,rgba(231,201,130,0.18),transparent,rgba(231,201,130,0.10),transparent)] opacity-70" />
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(16px_16px_at_30%_25%,rgba(231,201,130,0.22),transparent_65%)]" />
      <div className="relative h-[14px] w-[14px] rotate-45 border border-[rgba(10,10,12,0.22)] bg-white" />
    </div>
  );
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

  const topCities = useMemo(() => cityList.slice(0, 12), [cityList]);

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

  // routes
  const sellLabel = 'List privately';
  const sellHref = '/coming-soon?flow=sell';
  const marketplaceHref = '/marketplace';
  const listingsHref = '/listings';

  // layout
  const BAR_INNER = 'mx-auto flex w-full max-w-[1760px] items-center px-5 sm:px-8 lg:px-14 2xl:px-20';
  const STRIP_INNER = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';

  const activeCountry = (searchParams?.get('country') ?? '').trim();

  // editorial nav
  const navLink =
    'relative inline-flex h-10 items-center px-1 text-[13px] font-medium text-[color:var(--ink-2)] transition ' +
    'hover:text-[color:var(--ink)]';
  const navActive =
    'text-[color:var(--ink)] after:absolute after:left-1 after:right-1 after:bottom-1 after:h-px after:bg-[color:var(--ink)] after:opacity-[0.55]';

  const signatureSearch =
    'group inline-flex h-10 items-center gap-2 rounded-full px-4 transition ' +
    'border border-[rgba(10,10,12,0.12)] bg-white/80 hover:bg-white hover:border-[rgba(10,10,12,0.22)] ' +
    'shadow-[0_12px_40px_rgba(10,10,12,0.08)]';

  const primaryCta =
    'inline-flex h-10 items-center justify-between gap-3 rounded-full px-5 text-sm font-semibold transition ' +
    'border border-[rgba(10,10,12,0.16)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)] ' +
    'shadow-[0_16px_46px_rgba(10,10,12,0.16)]';

  const dnaPill =
    'inline-flex h-9 items-center gap-2 rounded-full px-3 text-[11px] font-semibold tracking-[0.22em] uppercase transition ' +
    'border border-[rgba(10,10,12,0.12)] bg-white/80 hover:bg-white hover:border-[rgba(10,10,12,0.22)] ' +
    'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]';

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Premium aura rail (subtle gold + ink) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[60] h-[2px] bg-[linear-gradient(90deg,transparent,rgba(231,201,130,0.55),rgba(10,10,12,0.22),rgba(231,201,130,0.45),transparent)] opacity-70" />

      <div
        className={cx(
          'relative w-full',
          'backdrop-blur-[18px]',
          scrolled
            ? 'bg-white/92 shadow-[0_18px_70px_rgba(10,10,12,0.10)]'
            : 'bg-white/82 shadow-[0_14px_60px_rgba(10,10,12,0.08)]',
        )}
      >
        {/* Glass depth + paper grain */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-[color:var(--hairline)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
          <div className="absolute inset-0 opacity-[0.030] [background-image:radial-gradient(circle_at_1px_1px,rgba(10,10,12,0.26)_1px,transparent_0)] [background-size:28px_28px]" />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_360px_at_50%_0%,rgba(231,201,130,0.10),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.70),rgba(255,255,255,0.35),rgba(255,255,255,0.72))]" />
        </div>

        {/* Row 1 */}
        <div className={cx('relative', BAR_INNER, 'py-3')}>
          {/* Brand */}
          <Link href="/" prefetch aria-label="Vantera home" className="group flex shrink-0 items-center gap-3">
            <MonogramCoin />
            <div className="flex flex-col">
              <Image
                src="/brand/vantera-logo-dark.svg"
                alt="Vantera"
                width={520}
                height={160}
                priority={false}
                className={cx(
                  'h-[26px] w-auto sm:h-[30px] md:h-[32px]',
                  'contrast-[1.08] brightness-[0.98]',
                )}
              />
              <div className="mt-0.5 hidden sm:block text-[10px] tracking-[0.26em] text-[color:var(--ink-3)]">
                PRIVATE INTELLIGENCE
              </div>
            </div>

            {/* DNA pill - always visible, this is "Vantera Truth Layer" presence */}
            <span className="ml-1 hidden lg:inline-flex">
              <Link href="/coming-soon?section=truth-layer" className={dnaPill} prefetch>
                <span className="h-1.5 w-1.5 rounded-full bg-[rgba(231,201,130,0.70)]" />
                Truth Layer
                <Sparkles className="h-3.5 w-3.5 text-[rgba(231,201,130,0.65)]" />
              </Link>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center lg:flex" aria-label="Primary">
            <div className="flex items-center gap-7">
              {/* Places (mega) */}
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
                  <Globe className="h-4 w-4 text-[color:var(--ink-3)]" />
                  <span>Places</span>
                  <ChevronDown className={cx('h-4 w-4 transition text-[color:var(--ink-3)]', megaOpen && 'rotate-180')} />
                  <span
                    className={cx(
                      'absolute left-1 right-1 bottom-1 h-px bg-[linear-gradient(90deg,transparent,rgba(10,10,12,0.55),transparent)] opacity-0',
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
                      'bg-[rgba(10,10,12,0.20)]',
                    )}
                  />
                  <div
                    className={cx(
                      'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200',
                      megaOpen && 'opacity-100',
                      '[background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.10)_1px,transparent_0)] [background-size:28px_28px]',
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
                    'fixed left-1/2 top-[74px] z-[80] w-[1240px] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 origin-top',
                    'overflow-hidden rounded-[24px]',
                    'border border-[rgba(10,10,12,0.12)] bg-white/92 backdrop-blur-[22px]',
                    'shadow-[0_70px_220px_rgba(10,10,12,0.20)]',
                    'transition-[transform,opacity] duration-200',
                    megaOpen
                      ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                      : 'pointer-events-none -translate-y-2 scale-[0.99] opacity-0',
                  )}
                  role="menu"
                  aria-label="Places menu"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_0%,rgba(231,201,130,0.10),transparent_62%)]" />
                    <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(231,201,130,0.40),rgba(10,10,12,0.16),rgba(231,201,130,0.35),transparent)] opacity-70" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
                  </div>

                  {/* Header */}
                  <div className="relative flex items-start justify-between gap-6 px-8 py-7">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                        PLACES
                      </div>
                      <div className="mt-3 max-w-[74ch] text-[28px] leading-[1.05] font-semibold text-[color:var(--ink)]">
                        Enter the marketplace by destination.
                      </div>
                      <div className="mt-2 max-w-[74ch] text-[13px] leading-relaxed text-[color:var(--ink-2)]">
                        Clean entry points now. Intelligence and verification deepen city by city under the Truth Layer.
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {countries.map((c) => (
                          <Link
                            key={c}
                            href={countryHref(c)}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className={cx(
                              'rounded-full px-3.5 py-2 text-[12px] transition',
                              'border border-[rgba(10,10,12,0.12)] bg-white/85 hover:bg-white hover:border-[rgba(10,10,12,0.22)]',
                              'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                              'shadow-[0_10px_26px_rgba(10,10,12,0.06)]',
                            )}
                            role="menuitem"
                          >
                            {c}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href="/coming-soon?section=truth-layer"
                        prefetch
                        onClick={() => setMegaOpen(false)}
                        className={cx(
                          'hidden xl:inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                          'border border-[rgba(231,201,130,0.35)] bg-white/85 hover:bg-white',
                          'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                          'shadow-[0_14px_34px_rgba(231,201,130,0.12)]',
                        )}
                      >
                        <Sparkles className="h-4 w-4 text-[rgba(231,201,130,0.70)]" />
                        Truth Layer
                      </Link>

                      <Link
                        href="/search"
                        prefetch
                        onClick={() => setMegaOpen(false)}
                        className={cx(
                          'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                          'border border-[rgba(10,10,12,0.12)] bg-white/85 hover:bg-white hover:border-[rgba(10,10,12,0.22)]',
                          'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                        )}
                      >
                        <Command className="h-4 w-4 text-[color:var(--ink-3)]" />
                        Search <span className="ml-1 font-mono text-[11px] text-[color:var(--ink-3)]">/</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setMegaOpen(false)}
                        className={cx(
                          'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                          'border border-[rgba(10,10,12,0.12)] bg-white/85 hover:bg-white hover:border-[rgba(10,10,12,0.22)]',
                          'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                        )}
                      >
                        <X className="h-4 w-4 text-[color:var(--ink-3)]" />
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="relative grid grid-cols-12 gap-7 px-8 pb-8">
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
                              'group rounded-[16px] px-4 py-3 transition',
                              'border border-[rgba(10,10,12,0.12)] bg-white/85 hover:bg-white hover:border-[rgba(10,10,12,0.22)]',
                              'shadow-[0_12px_34px_rgba(10,10,12,0.06)]',
                            )}
                            role="menuitem"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="truncate text-[14px] font-semibold text-[color:var(--ink)]">
                                  {c.name}
                                </div>
                                <div className="mt-0.5 truncate text-[11px] tracking-[0.18em] text-[color:var(--ink-3)]">
                                  {c.country}
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 opacity-55 transition group-hover:translate-x-0.5 group-hover:opacity-90 text-[color:var(--ink)]" />
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-[16px] border border-[rgba(10,10,12,0.12)] bg-[rgba(10,10,12,0.02)] px-4 py-3">
                        <div className="text-xs text-[color:var(--ink-2)]">
                          Fast entry. Catalogue-first. Truth Layer underneath.
                        </div>
                        <Link
                          href="/search"
                          prefetch
                          onClick={() => setMegaOpen(false)}
                          className="inline-flex items-center gap-2 text-xs text-[color:var(--ink-2)] hover:text-[color:var(--ink)] transition"
                        >
                          Search instead <ArrowRight className="h-4 w-4 opacity-70" />
                        </Link>
                      </div>
                    </div>

                    <div className="col-span-4 space-y-3">
                      <div className="rounded-[18px] border border-[rgba(10,10,12,0.12)] bg-white/85 p-4 shadow-[0_14px_40px_rgba(10,10,12,0.06)]">
                        <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                          SEARCH ATELIER
                        </div>
                        <div className="mt-2 text-xs text-[color:var(--ink-2)]">The fastest way to a €2M+ property.</div>

                        <button
                          type="button"
                          onClick={() => {
                            setMegaOpen(false);
                            router.push('/search');
                          }}
                          className={cx(
                            'mt-4 inline-flex w-full items-center justify-between rounded-full px-4 py-3 text-sm transition',
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

                      <div className="rounded-[18px] border border-[rgba(10,10,12,0.12)] bg-white/85 p-4 shadow-[0_14px_40px_rgba(10,10,12,0.06)]">
                        <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                          SUBMISSIONS
                        </div>
                        <div className="mt-1 text-xs text-[color:var(--ink-2)]">Private by default. €2M+ only.</div>

                        <Link
                          href={sellHref}
                          prefetch
                          onClick={() => setMegaOpen(false)}
                          className={cx('mt-4 inline-flex w-full', primaryCta)}
                        >
                          <span>{sellLabel}</span>
                          <ArrowRight className="h-4 w-4 opacity-85" />
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
                <Search className="h-4 w-4 text-[color:var(--ink-3)]" />
                <span className="text-[13px] text-[color:var(--ink-2)] group-hover:text-[color:var(--ink)] transition">
                  Search
                </span>
                <span className="text-[color:var(--ink-3)]/40">·</span>
                <span className="font-mono text-xs text-[color:var(--ink-3)]">/</span>
              </button>

              <Link href={sellHref} prefetch className={primaryCta} aria-label={sellLabel}>
                <span>{sellLabel}</span>
                <ArrowRight className="h-4 w-4 opacity-80" />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={cx(
                'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm transition lg:hidden',
                'border border-[rgba(10,10,12,0.12)] bg-white/80 hover:bg-white hover:border-[rgba(10,10,12,0.22)]',
                'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                'shadow-[0_12px_36px_rgba(10,10,12,0.08)]',
              )}
              aria-expanded={mobileOpen}
              aria-controls="vantera-mobile-menu"
            >
              Menu
              <ChevronDown className={cx('h-4 w-4 transition text-[color:var(--ink-3)]', mobileOpen && 'rotate-180')} />
            </button>
          </div>
        </div>

        {/* Row 2: countries strip (now richer, with gold filament + “rail” feel) */}
        <div className="relative hidden lg:block">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:var(--hairline)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(231,201,130,0.22),transparent)] opacity-70" />

          <div className={cx('relative flex h-10 items-center', STRIP_INNER)}>
            <div className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto pr-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {countries.map((c) => {
                const active = activeCountry && c.toLowerCase() === activeCountry.toLowerCase();
                return (
                  <Link
                    key={c}
                    href={countryHref(c)}
                    prefetch
                    className={cx(
                      'relative inline-flex h-8 items-center rounded-full px-3 text-[12px] transition',
                      active
                        ? 'border border-[rgba(231,201,130,0.35)] bg-white text-[color:var(--ink)] shadow-[0_10px_26px_rgba(231,201,130,0.10)]'
                        : 'border border-transparent text-[color:var(--ink-2)] hover:text-[color:var(--ink)] hover:border-[rgba(10,10,12,0.14)] hover:bg-white/75',
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {c}
                    {active ? (
                      <span className="pointer-events-none absolute inset-x-2 -bottom-1 h-px bg-[linear-gradient(90deg,transparent,rgba(231,201,130,0.65),transparent)]" />
                    ) : null}
                  </Link>
                );
              })}
            </div>

            <div className="hidden xl:flex shrink-0 items-center gap-2 pl-3 text-[11px] tracking-[0.22em] text-[color:var(--ink-3)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(231,201,130,0.55)]" />
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
            'bg-white/92 backdrop-blur-[18px]',
            'border-l border-[rgba(10,10,12,0.12)]',
            'shadow-[-30px_0_140px_rgba(10,10,12,0.16)]',
            'transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_26%_0%,rgba(231,201,130,0.10),transparent_62%)]" />
            <div className="absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(231,201,130,0.45),transparent)] opacity-70" />
          </div>

          <div className="relative flex items-center justify-between px-5 py-5">
            <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">Menu</div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={cx(
                'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                'border border-[rgba(10,10,12,0.12)] bg-white/85 hover:bg-white hover:border-[rgba(10,10,12,0.22)]',
                'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
              )}
            >
              <X className="h-4 w-4 text-[color:var(--ink-3)]" />
              Close
            </button>
          </div>

          <div className="relative space-y-4 px-5 pb-6">
            <div className="rounded-[18px] border border-[rgba(10,10,12,0.12)] bg-white/85 p-4">
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">Vantera DNA</div>
              <div className="mt-1 text-xs text-[color:var(--ink-2)]">
                Marketplace powered by the Truth Layer.
              </div>

              <div className="mt-3 grid gap-2">
                <Link
                  href="/coming-soon?section=truth-layer"
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-full px-4 py-3 text-sm transition',
                    'border border-[rgba(231,201,130,0.35)] bg-white hover:bg-white',
                    'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[rgba(231,201,130,0.70)]" />
                    Truth Layer
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Link>
              </div>
            </div>

            <div className="rounded-[18px] border border-[rgba(10,10,12,0.12)] bg-white/85 p-4">
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
                    'inline-flex w-full items-center justify-between rounded-full px-4 py-3 text-sm transition',
                    'border border-[rgba(10,10,12,0.12)] bg-white hover:border-[rgba(10,10,12,0.22)]',
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
                    'inline-flex w-full items-center justify-between rounded-full px-4 py-3 text-sm font-semibold transition',
                    'border border-[rgba(10,10,12,0.16)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                  )}
                >
                  <span>{sellLabel}</span>
                  <ArrowRight className="h-4 w-4 opacity-85" />
                </Link>
              </div>
            </div>

            <div className="rounded-[18px] border border-[rgba(10,10,12,0.12)] bg-white/85 p-4">
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">Navigation</div>

              <div className="mt-3 grid gap-2">
                <Link
                  href={marketplaceHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-full px-4 py-3 text-sm transition',
                    'border border-[rgba(10,10,12,0.12)] bg-white hover:border-[rgba(10,10,12,0.22)]',
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
                    'inline-flex w-full items-center justify-between rounded-full px-4 py-3 text-sm transition',
                    'border border-[rgba(10,10,12,0.12)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                    'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                  )}
                >
                  <span>Listings</span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Link>
              </div>
            </div>

            <div className="rounded-[18px] border border-[rgba(10,10,12,0.12)] bg-white/85 p-4">
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">Places</div>

              <div className="mt-3 flex flex-wrap gap-2">
                {countries.map((c) => (
                  <Link
                    key={c}
                    href={countryHref(c)}
                    prefetch
                    onClick={() => setMobileOpen(false)}
                    className={cx(
                      'rounded-full px-3 py-1.5 text-[12px] transition',
                      'border border-[rgba(10,10,12,0.12)] bg-white hover:border-[rgba(10,10,12,0.22)]',
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
                      'rounded-[16px] px-3.5 py-3 transition',
                      'border border-[rgba(10,10,12,0.12)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[color:var(--ink)]">{c.name}</div>
                        <div className="truncate text-[11px] tracking-[0.18em] text-[color:var(--ink-3)]">
                          {c.country}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-70 text-[color:var(--ink)]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {onCityPage ? (
              <div className="rounded-[18px] border border-[rgba(10,10,12,0.12)] bg-white/85 p-4">
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
                      'flex-1 rounded-full px-3 py-2 text-sm transition',
                      'border border-[rgba(10,10,12,0.12)]',
                      activeTab === 'truth'
                        ? 'bg-white text-[color:var(--ink)]'
                        : 'bg-white/80 hover:bg-white hover:border-[rgba(10,10,12,0.22)] text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
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
                      'flex-1 rounded-full px-3 py-2 text-sm transition',
                      'border border-[rgba(10,10,12,0.12)]',
                      activeTab === 'supply'
                        ? 'bg-white text-[color:var(--ink)]'
                        : 'bg-white/80 hover:bg-white hover:border-[rgba(10,10,12,0.22)] text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                    )}
                  >
                    Live market <span className="ml-1 font-mono text-[11px] text-[color:var(--ink-3)]">L</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="pt-1 text-[11px] text-[color:var(--ink-3)]">White, editorial, quiet. Gold is the signal.</div>
          </div>
        </div>
      </div>
    </header>
  );
}
