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
 * Unified search focus:
 * - OmniSearch / CitySearch can listen to "vantera:focus-search".
 * - Keep legacy bridge event in one place so removal is trivial later.
 */
function dispatchFocusSearch() {
  window.dispatchEvent(new CustomEvent('vantera:focus-search'));
  window.dispatchEvent(new CustomEvent('locus:focus-search'));
}

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

        if (pathname !== '/search') {
          router.push('/search');
          return;
        }

        // If you ever want to focus an inline search (home hero etc), swap:
        // dispatchFocusSearch();
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
    if (pathname !== '/search') {
      router.push('/search');
      return;
    }
    // dispatchFocusSearch();
  }

  // routes
  const sellLabel = 'List privately';
  const sellHref = '/coming-soon?flow=sell';
  const intelligenceHref = '/coming-soon?section=intelligence';
  const journalHref = '/coming-soon?section=journal';

  // Layout
  const BAR_INNER =
    'mx-auto flex w-full max-w-[1760px] items-center px-5 py-3 sm:px-8 sm:py-3.5 lg:px-12 2xl:px-16';

  // Royal, hairline, no rounded corners
  const barShell = cx(
    'relative w-full',
    'backdrop-blur-[18px]',
    'ring-1 ring-inset ring-[color:var(--hairline)]',
    scrolled ? 'bg-[rgba(255,255,255,0.94)]' : 'bg-[rgba(255,255,255,0.86)]',
    scrolled ? 'shadow-[0_18px_70px_rgba(11,12,16,0.10)]' : 'shadow-[0_10px_50px_rgba(11,12,16,0.06)]',
  );

  const goldText =
    'bg-clip-text text-transparent bg-[linear-gradient(180deg,#b98533_0%,#d9b35f_48%,#8a5b12_100%)]';

  const navItemBase =
    'inline-flex h-10 items-center gap-2 px-4 text-[13px] font-medium transition select-none ' +
    'ring-1 ring-inset ring-[color:var(--hairline)] bg-transparent hover:bg-black/[0.035] ' +
    'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]';

  const navItemActive =
    'inline-flex h-10 items-center gap-2 px-4 text-[13px] font-medium transition select-none ' +
    'ring-1 ring-inset ring-[rgba(11,12,16,0.18)] bg-black/[0.03] text-[color:var(--ink)]';

  const signatureSearch =
    'inline-flex h-10 items-center gap-2 px-4 transition ' +
    'ring-1 ring-inset ring-[color:var(--hairline)] ' +
    'bg-white/70 hover:bg-white ' +
    'shadow-[0_16px_46px_rgba(11,12,16,0.08)]';

  const primaryCta =
    'inline-flex h-10 items-center gap-2 px-5 text-sm font-semibold transition ' +
    'ring-1 ring-inset ring-[rgba(185,133,51,0.35)] ' +
    'bg-[linear-gradient(180deg,rgba(185,133,51,0.18),rgba(185,133,51,0.10))] ' +
    'hover:bg-[linear-gradient(180deg,rgba(185,133,51,0.22),rgba(185,133,51,0.12))] ' +
    'shadow-[0_18px_55px_rgba(11,12,16,0.10)]';

  const iconMuted = 'text-[color:var(--ink-3)]';

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className={barShell}>
        {/* Royal hairlines + warm crown wash */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-16 bg-[radial-gradient(1200px_240px_at_50%_0%,rgba(231,201,130,0.18),transparent_62%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,12,16,0.012),transparent_42%,rgba(11,12,16,0.030))]" />
        </div>

        <div className={cx('relative', BAR_INNER)}>
          {/* Brand */}
          <Link href="/" prefetch aria-label="Vantera home" className="group flex shrink-0 items-center">
            <Image
              src="/brand/vantera-logo-dark.svg"
              alt="Vantera"
              width={520}
              height={160}
              priority={false}
              className={cx('h-[28px] w-auto sm:h-[32px] md:h-[34px]', 'contrast-[1.06]')}
            />
          </Link>

          {/* Desktop center nav */}
          <nav className="hidden flex-1 items-center justify-center lg:flex" aria-label="Primary">
            <div className="flex items-center gap-2">
              {/* Gateway mega */}
              <div ref={wrapRef} className="relative" onPointerEnter={openMegaSoon} onPointerLeave={closeMegaSoon}>
                <button
                  type="button"
                  onClick={toggleMega}
                  onFocus={() => setMegaOpen(true)}
                  className={cx(megaOpen ? navItemActive : navItemBase)}
                  aria-expanded={megaOpen}
                  aria-haspopup="menu"
                >
                  <Globe className={cx('h-4 w-4', iconMuted)} />
                  <span>Gateway</span>
                  <ChevronDown className={cx('h-4 w-4 transition', megaOpen && 'rotate-180', iconMuted)} />
                </button>

                {/* Mega panel - editorial, no rounding, hairlines */}
                <div
                  ref={panelRef}
                  onPointerEnter={() => {
                    cancelTimers();
                    setMegaOpen(true);
                  }}
                  onPointerLeave={closeMegaSoon}
                  className={cx(
                    'fixed left-1/2 top-[74px] z-[80] w-[1240px] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 origin-top',
                    'overflow-hidden',
                    'bg-[rgba(255,255,255,0.96)] backdrop-blur-[22px]',
                    'ring-1 ring-inset ring-[color:var(--hairline)]',
                    'shadow-[0_60px_180px_rgba(11,12,16,0.16)]',
                    'transition-[transform,opacity] duration-200',
                    megaOpen
                      ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                      : 'pointer-events-none -translate-y-1 scale-[0.99] opacity-0',
                  )}
                  role="menu"
                  aria-label="Places menu"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(1200px_380px_at_50%_0%,rgba(231,201,130,0.16),transparent_62%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(1100px_420px_at_86%_0%,rgba(139,92,246,0.08),transparent_64%)]" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.14)] to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--hairline)]" />
                  </div>

                  {/* Header */}
                  <div className="relative flex items-start justify-between gap-6 px-7 py-6">
                    <div className="min-w-0">
                      <div className={cx('text-[11px] font-semibold tracking-[0.26em] uppercase', goldText)}>
                        gateway
                      </div>
                      <div className="mt-2 max-w-[72ch] text-[13px] leading-relaxed text-[color:var(--ink-2)]">
                        Curated entry points into the index. Search remains the primary interface.
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
                              'ring-1 ring-inset ring-[color:var(--hairline)]',
                              'bg-black/[0.02] hover:bg-black/[0.045]',
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
                          'ring-1 ring-inset ring-[color:var(--hairline)]',
                          'bg-white/70 hover:bg-white',
                          'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                        )}
                      >
                        <Command className={cx('h-4 w-4', iconMuted)} />
                        Open search <span className="ml-1 font-mono text-[11px] text-[color:var(--ink-3)]">/</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setMegaOpen(false)}
                        className={cx(
                          'inline-flex items-center gap-2 px-3.5 py-2 text-[12px] transition',
                          'ring-1 ring-inset ring-[color:var(--hairline)]',
                          'bg-black/[0.02] hover:bg-black/[0.04]',
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
                      <div className={cx('mb-3 text-[11px] font-semibold tracking-[0.26em] uppercase', goldText)}>
                        Featured cities
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
                              'ring-1 ring-inset ring-[color:var(--hairline)]',
                              'bg-black/[0.02] hover:bg-black/[0.045]',
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

                      <div className="mt-4 flex items-center justify-between px-4 py-3 ring-1 ring-inset ring-[color:var(--hairline)] bg-black/[0.015]">
                        <div className="text-xs text-[color:var(--ink-2)]">Editorial gateway. Search is the product.</div>
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
                      <div className="relative overflow-hidden ring-1 ring-inset ring-[color:var(--hairline)] bg-white/72 p-4 shadow-[0_18px_60px_rgba(11,12,16,0.08)]">
                        <div className="pointer-events-none absolute inset-0">
                          <div className="absolute inset-0 bg-[radial-gradient(720px_220px_at_18%_0%,rgba(231,201,130,0.18),transparent_62%)]" />
                          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(11,12,16,0.12)] to-transparent" />
                        </div>

                        <div className="relative">
                          <div className={cx('text-[11px] font-semibold tracking-[0.26em] uppercase', goldText)}>
                            Submissions
                          </div>
                          <div className="mt-1 text-xs text-[color:var(--ink-2)]">
                            Private by default. Signal over noise.
                          </div>

                          <Link
                            href={sellHref}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className={cx(
                              'mt-4 inline-flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition',
                              'ring-1 ring-inset ring-[rgba(185,133,51,0.35)]',
                              'bg-[linear-gradient(180deg,rgba(185,133,51,0.16),rgba(185,133,51,0.10))]',
                              'hover:bg-[linear-gradient(180deg,rgba(185,133,51,0.20),rgba(185,133,51,0.12))]',
                            )}
                          >
                            <span className={goldText}>{sellLabel}</span>
                            <ArrowRight className="h-4 w-4 opacity-80 text-[color:var(--ink)]" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Minimal nav links (no caps) */}
              <Link href={intelligenceHref} prefetch className={navItemBase}>
                Intelligence
              </Link>
              <Link href={journalHref} prefetch className={navItemBase}>
                Journal
              </Link>
            </div>
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex shrink-0 items-center gap-2.5">
            <div className="hidden items-center gap-2.5 sm:flex">
              <button
                type="button"
                onClick={openSearchResultsFromAnywhere}
                className={signatureSearch}
                aria-label="Search"
              >
                <Command className="h-4 w-4 text-[color:var(--ink-3)]" />
                <span className="text-[13px] tracking-[0.04em] text-[color:var(--ink-2)]">Search</span>
                <span className="text-[color:var(--ink-3)]/40">·</span>
                <span className="font-mono text-xs text-[color:var(--ink-3)]">/</span>
              </button>

              <Link href={sellHref} prefetch className={primaryCta} aria-label={sellLabel}>
                <span className={goldText}>{sellLabel}</span>
                <ArrowRight className="h-4 w-4 opacity-80 text-[color:var(--ink)]" />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={cx(
                'inline-flex h-10 items-center gap-2 px-4 text-sm transition lg:hidden',
                'ring-1 ring-inset ring-[color:var(--hairline)]',
                'bg-black/[0.02] hover:bg-black/[0.05]',
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
      </div>

      {/* Mobile sheet - editorial, no rounding */}
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
            'bg-[rgba(255,255,255,0.98)] backdrop-blur-[18px]',
            'ring-1 ring-inset ring-[color:var(--hairline)]',
            'shadow-[-40px_0_160px_rgba(11,12,16,0.16)]',
            'transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(980px_360px_at_26%_0%,rgba(231,201,130,0.16),transparent_62%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,12,16,0.010),transparent_45%,rgba(11,12,16,0.030))]" />
          </div>

          <div className="relative flex items-center justify-between px-5 py-5">
            <div className={cx('text-[11px] font-semibold tracking-[0.26em] uppercase', goldText)}>Menu</div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={cx(
                'inline-flex items-center gap-2 px-3.5 py-2 text-[12px] transition',
                'ring-1 ring-inset ring-[color:var(--hairline)]',
                'bg-black/[0.02] hover:bg-black/[0.04]',
                'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
              )}
            >
              <X className="h-4 w-4 text-[color:var(--ink-3)]" />
              Close
            </button>
          </div>

          <div className="relative space-y-4 px-5 pb-6">
            {/* Search */}
            <div className="ring-1 ring-inset ring-[color:var(--hairline)] bg-black/[0.015] p-4">
              <div className={cx('text-[11px] font-semibold tracking-[0.26em] uppercase', goldText)}>Search</div>
              <div className="mt-1 text-xs text-[color:var(--ink-2)]">One box. Keywords allowed.</div>

              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => {
                    router.push('/search');
                    setMobileOpen(false);
                  }}
                  className={cx(
                    'inline-flex w-full items-center justify-between px-4 py-3 text-sm transition',
                    'ring-1 ring-inset ring-[color:var(--hairline)]',
                    'bg-white/70 hover:bg-white',
                    'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Command className="h-4 w-4 text-[color:var(--ink-3)]" />
                    Open search <span className="ml-1 font-mono text-xs text-[color:var(--ink-3)]">/</span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </button>

                <Link
                  href={sellHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition',
                    'ring-1 ring-inset ring-[rgba(185,133,51,0.35)]',
                    'bg-[linear-gradient(180deg,rgba(185,133,51,0.16),rgba(185,133,51,0.10))]',
                    'hover:bg-[linear-gradient(180deg,rgba(185,133,51,0.20),rgba(185,133,51,0.12))]',
                    'text-[color:var(--ink)]',
                  )}
                >
                  <span className={goldText}>{sellLabel}</span>
                  <ArrowRight className="h-4 w-4 opacity-85" />
                </Link>
              </div>
            </div>

            {/* Gateway */}
            <div className="ring-1 ring-inset ring-[color:var(--hairline)] bg-black/[0.015] p-4">
              <div className={cx('text-[11px] font-semibold tracking-[0.26em] uppercase', goldText)}>Gateway</div>
              <div className="mt-1 text-xs text-[color:var(--ink-2)]">Countries and featured cities.</div>

              <div className="mt-3 flex flex-wrap gap-2">
                {countries.map((c) => (
                  <Link
                    key={c}
                    href={countryHref(c)}
                    prefetch
                    onClick={() => setMobileOpen(false)}
                    className={cx(
                      'px-3 py-1.5 text-[12px] transition',
                      'ring-1 ring-inset ring-[color:var(--hairline)]',
                      'bg-white/60 hover:bg-white',
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
                      'ring-1 ring-inset ring-[color:var(--hairline)]',
                      'bg-white/60 hover:bg-white',
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

            {/* Navigation */}
            <div className="ring-1 ring-inset ring-[color:var(--hairline)] bg-black/[0.015] p-4">
              <div className={cx('text-[11px] font-semibold tracking-[0.26em] uppercase', goldText)}>Navigation</div>
              <div className="mt-1 text-xs text-[color:var(--ink-2)]">Public entry points.</div>

              <div className="mt-3 grid gap-2">
                <Link
                  href={intelligenceHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between px-4 py-3 text-sm transition',
                    'ring-1 ring-inset ring-[color:var(--hairline)]',
                    'bg-white/60 hover:bg-white',
                    'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                  )}
                >
                  <span>Intelligence</span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Link>

                <Link
                  href={journalHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between px-4 py-3 text-sm transition',
                    'ring-1 ring-inset ring-[color:var(--hairline)]',
                    'bg-white/60 hover:bg-white',
                    'text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                  )}
                >
                  <span>Journal</span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Link>
              </div>
            </div>

            {/* City page switch */}
            {onCityPage ? (
              <div className="ring-1 ring-inset ring-[color:var(--hairline)] bg-black/[0.015] p-4">
                <div className={cx('text-[11px] font-semibold tracking-[0.26em] uppercase', goldText)}>City view</div>
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
                      'ring-1 ring-inset ring-[color:var(--hairline)]',
                      activeTab === 'truth'
                        ? 'bg-white text-[color:var(--ink)]'
                        : 'bg-white/60 hover:bg-white text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
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
                      'ring-1 ring-inset ring-[color:var(--hairline)]',
                      activeTab === 'supply'
                        ? 'bg-white text-[color:var(--ink)]'
                        : 'bg-white/60 hover:bg-white text-[color:var(--ink-2)] hover:text-[color:var(--ink)]',
                    )}
                  >
                    Live market <span className="ml-1 font-mono text-[11px] text-[color:var(--ink-3)]">L</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="pt-1 text-[11px] text-[color:var(--ink-3)]">Editorial entrance. Search is the product.</div>
          </div>
        </div>
      </div>
    </header>
  );
}
