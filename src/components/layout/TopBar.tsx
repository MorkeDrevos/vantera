// src/components/layout/TopBar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronDown, Command, Globe, X } from 'lucide-react';

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
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  const topCities = useMemo(() => cityList.slice(0, 10), [cityList]);

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
    closeT.current = window.setTimeout(() => setMegaOpen(false), 160);
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
  const BAR_INNER = 'mx-auto flex w-full max-w-[1760px] items-center px-5 py-3 sm:px-8 lg:px-14 2xl:px-20';
  const STRIP_INNER = 'mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 2xl:px-20';

  const barShell = cx(
    'relative w-full',
    'bg-white/92 backdrop-blur-[18px]',
    scrolled && 'bg-white/96',
  );

  // Editorial nav (no uppercase, no gold gradients, no boxes)
  const navLink =
    'relative inline-flex h-10 items-center px-1 text-[13px] font-medium text-[color:var(--ink-2)] transition ' +
    'hover:text-[color:var(--ink)]';

  const navActive =
    'text-[color:var(--ink)] after:absolute after:left-1 after:right-1 after:bottom-1 after:h-px after:bg-[color:var(--ink)] after:opacity-[0.55]';

  const signatureSearch =
    'inline-flex h-10 items-center gap-2 px-4 transition ' +
    'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]';

  const primaryCta =
    'inline-flex h-10 items-center gap-2 px-5 text-sm font-semibold transition ' +
    'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]';

  const iconMuted = 'text-[color:var(--ink-3)]';

  // Second-row country strip (quiet)
  const stripItem =
    'relative inline-flex h-8 items-center px-2 text-[12px] text-[color:var(--ink-2)] transition ' +
    'hover:text-[color:var(--ink)]';
  const stripActive =
    'text-[color:var(--ink)] after:absolute after:left-2 after:right-2 after:bottom-1 after:h-px after:bg-[color:var(--ink)] after:opacity-[0.45]';

  const activeCountry = (searchParams?.get('country') ?? '').trim();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className={barShell}>
        {/* Hairlines only - super clean */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-[color:var(--hairline)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
        </div>

        {/* Row 1 */}
        <div className={cx('relative', BAR_INNER)}>
          {/* Brand */}
          <Link href="/" prefetch aria-label="Vantera home" className="group flex shrink-0 items-center">
            <Image
              src="/brand/vantera-logo-dark.svg"
              alt="Vantera"
              width={520}
              height={160}
              priority={false}
              className={cx('h-[26px] w-auto sm:h-[30px] md:h-[32px]', 'contrast-[1.06]')}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center lg:flex" aria-label="Primary">
            <div className="flex items-center gap-7">
              {/* Gateway mega (text trigger) */}
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
                  <Globe className={cx('h-4 w-4', iconMuted)} />
                  <span>Places</span>
                  <ChevronDown className={cx('h-4 w-4 transition', megaOpen && 'rotate-180', iconMuted)} />
                  <span className={cx('absolute left-1 right-1 bottom-1 h-px bg-[color:var(--ink)] opacity-0', megaOpen && 'opacity-[0.35]')} />
                </button>

                {/* Mega panel */}
                <div
                  ref={panelRef}
                  onPointerEnter={() => {
                    cancelTimers();
                    setMegaOpen(true);
                  }}
                  onPointerLeave={closeMegaSoon}
                  className={cx(
                    'fixed left-1/2 top-[72px] z-[80] w-[1160px] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 origin-top',
                    'overflow-hidden border border-[color:var(--hairline)] bg-white/96 backdrop-blur-[22px]',
                    'shadow-[0_40px_140px_rgba(10,10,12,0.14)]',
                    'transition-[transform,opacity] duration-200',
                    megaOpen
                      ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                      : 'pointer-events-none -translate-y-1 scale-[0.99] opacity-0',
                  )}
                  role="menu"
                  aria-label="Places menu"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-x-0 top-0 h-px bg-[color:var(--hairline)]" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(1200px_420px_at_50%_0%,rgba(0,0,0,0.04),transparent_62%)]" />
                  </div>

                  {/* Header */}
                  <div className="relative flex items-start justify-between gap-6 px-7 py-6">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                        PLACES
                      </div>
                      <div className="mt-2 max-w-[72ch] text-[13px] leading-relaxed text-[color:var(--ink-2)]">
                        Countries and flagship cities. Clean entry points.
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {countries.map((c) => (
                          <Link
                            key={c}
                            href={countryHref(c)}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className={cx(
                              'px-3.5 py-1.5 text-[12px] transition',
                              'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                              'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
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
                        href="/search"
                        prefetch
                        onClick={() => setMegaOpen(false)}
                        className={cx(
                          'inline-flex items-center gap-2 px-3.5 py-2 text-[12px] transition',
                          'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
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
                          'inline-flex items-center gap-2 px-3.5 py-2 text-[12px] transition',
                          'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                          'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                        )}
                      >
                        <X className={cx('h-4 w-4', iconMuted)} />
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="relative grid grid-cols-12 gap-6 px-7 pb-7">
                    <div className="col-span-8">
                      <div className="mb-3 text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                        FLAGSHIP CITIES
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {topCities.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/city/${c.slug}`}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className={cx(
                              'group px-4 py-3 transition',
                              'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
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

                      <div className="mt-4 flex items-center justify-between border border-[color:var(--hairline)] bg-[rgba(0,0,0,0.02)] px-4 py-3">
                        <div className="text-xs text-[color:var(--ink-2)]">Fast entry. Clean navigation.</div>
                        <Link
                          href="/search"
                          prefetch
                          onClick={() => setMegaOpen(false)}
                          className="inline-flex items-center gap-2 text-xs text-[color:var(--ink-2)] hover:text-[color:var(--ink)] transition"
                        >
                          Search <ArrowRight className="h-4 w-4 opacity-70" />
                        </Link>
                      </div>
                    </div>

                    <div className="col-span-4">
                      <div className="border border-[color:var(--hairline)] bg-white p-4">
                        <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">
                          SUBMISSIONS
                        </div>
                        <div className="mt-1 text-xs text-[color:var(--ink-2)]">
                          Private by default. €2M+ only.
                        </div>

                        <Link
                          href={sellHref}
                          prefetch
                          onClick={() => setMegaOpen(false)}
                          className={cx(
                            'mt-4 inline-flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition',
                            'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                          )}
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
                <Command className="h-4 w-4 text-[color:var(--ink-3)]" />
                <span className="text-[13px] text-[color:var(--ink-2)]">Search</span>
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
                'inline-flex h-10 items-center gap-2 px-4 text-sm transition lg:hidden',
                'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
              )}
              aria-expanded={mobileOpen}
              aria-controls="vantera-mobile-menu"
            >
              Menu
              <ChevronDown className={cx('h-4 w-4 transition text-[color:var(--ink-3)]', mobileOpen && 'rotate-180')} />
            </button>
          </div>
        </div>

        {/* Row 2: countries strip (thin, quiet) */}
        <div className="relative hidden lg:block">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:var(--hairline)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />

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
              <span className="h-1.5 w-1.5 bg-[rgba(10,10,12,0.30)]" />
              COUNTRIES
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="vantera-mobile-menu"
        className={cx('fixed inset-0 z-[70] lg:hidden', mobileOpen ? 'pointer-events-auto' : 'pointer-events-none')}
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
            'bg-white backdrop-blur-[18px]',
            'border-l border-[color:var(--hairline)]',
            'shadow-[-30px_0_120px_rgba(10,10,12,0.14)]',
            'transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(980px_360px_at_26%_0%,rgba(0,0,0,0.05),transparent_62%)]" />
          </div>

          <div className="relative flex items-center justify-between px-5 py-5">
            <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">MENU</div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={cx(
                'inline-flex items-center gap-2 px-3.5 py-2 text-[12px] transition',
                'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
                'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
              )}
            >
              <X className="h-4 w-4 text-[color:var(--ink-3)]" />
              Close
            </button>
          </div>

          <div className="relative space-y-4 px-5 pb-6">
            {/* Quick actions */}
            <div className="border border-[color:var(--hairline)] bg-[rgba(0,0,0,0.02)] p-4">
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">ACTIONS</div>
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
                    <Command className="h-4 w-4 text-[color:var(--ink-3)]" />
                    Search <span className="ml-1 font-mono text-xs text-[color:var(--ink-3)]">/</span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </button>

                <Link
                  href={sellHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition',
                    'border border-[rgba(10,10,12,0.18)] bg-[rgba(10,10,12,0.92)] text-white hover:bg-[rgba(10,10,12,1.0)]',
                  )}
                >
                  <span>{sellLabel}</span>
                  <ArrowRight className="h-4 w-4 opacity-85" />
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <div className="border border-[color:var(--hairline)] bg-[rgba(0,0,0,0.02)] p-4">
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">NAVIGATION</div>

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
                  <span>Search</span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </button>
              </div>
            </div>

            {/* Places */}
            <div className="border border-[color:var(--hairline)] bg-[rgba(0,0,0,0.02)] p-4">
              <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">PLACES</div>

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
                      'px-3.5 py-3 transition',
                      'border border-[color:var(--hairline)] bg-white hover:border-[rgba(10,10,12,0.22)]',
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

            {/* City page switch (kept) */}
            {onCityPage ? (
              <div className="border border-[color:var(--hairline)] bg-[rgba(0,0,0,0.02)] p-4">
                <div className="text-[11px] font-semibold tracking-[0.30em] text-[color:var(--ink-3)]">CITY VIEW</div>
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

            <div className="pt-1 text-[11px] text-[color:var(--ink-3)]">Vantera is white, editorial, and quiet.</div>
          </div>
        </div>
      </div>
    </header>
  );
}
