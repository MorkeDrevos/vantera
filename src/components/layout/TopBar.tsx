// src/components/layout/TopBar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  ChevronDown,
  Command,
  Globe,
  ShieldCheck,
  BookOpen,
  Building2,
  Users,
  X,
  Sparkles,
  Crown,
} from 'lucide-react';

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
  // legacy bridge (remove later when all listeners are migrated)
  window.dispatchEvent(new CustomEvent('locus:focus-search'));
}

function dispatchTab(tab: 'truth' | 'supply') {
  window.dispatchEvent(new CustomEvent('vantera:tab', { detail: { tab } }));
  // legacy bridge (remove later when all listeners are migrated)
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

        // Primary: go to results search page
        if (pathname !== '/search') {
          router.push('/search');
          return;
        }

        // Optional: if you still want the homepage omni modal behavior later,
        // swap to dispatchFocusSearch() here.
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

  const topRegions = useMemo(() => {
    const raw = cityList
      .map((c) => (c.region ? String(c.region) : ''))
      .filter(Boolean);

    const uniq = uniqBy(raw, (r) => r.toLowerCase()).slice(0, 6);
    if (uniq.length > 0) return uniq;

    return countries.slice(0, 6);
  }, [cityList, countries]);

  function countryHref(country: string) {
    return buildSearchHref({ country });
  }

  function regionHref(region: string) {
    return buildSearchHref({ region });
  }

  function cancelTimers() {
    if (openT.current) window.clearTimeout(openT.current);
    if (closeT.current) window.clearTimeout(closeT.current);
    openT.current = null;
    closeT.current = null;
  }

  function openMegaSoon() {
    cancelTimers();
    openT.current = window.setTimeout(() => setMegaOpen(true), 85);
  }

  function closeMegaSoon() {
    cancelTimers();
    closeT.current = window.setTimeout(() => setMegaOpen(false), 190);
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
  }

  // routes
  const sellLabel = 'List privately';
  const sellHref = '/coming-soon?flow=sell';
  const agentHref = '/coming-soon?flow=agents';
  const sellersHref = '/coming-soon?flow=private-sellers';
  const intelligenceHref = '/coming-soon?section=intelligence';
  const journalHref = '/coming-soon?section=journal';

  // collections (gateway, not directory)
  const collections = [
    { label: 'Ultra prime', q: 'ultra_prime' },
    { label: 'Waterfront', q: 'waterfront' },
    { label: 'Sea view', q: 'sea_view' },
    { label: 'Gated', q: 'gated' },
    { label: 'Golf', q: 'golf' },
    { label: 'New build', q: 'new_build' },
    { label: 'Yield', q: 'yield' },
    { label: 'Walkable', q: 'walkable' },
  ];

  function collectionHref(key: string) {
    return buildSearchHref({ collection: key });
  }

  // White royal visual system (pure white glass + gold accents)
  const goldText =
    'bg-clip-text text-transparent bg-[linear-gradient(180deg,#b98533_0%,#d9b35f_45%,#8a5b12_100%)]';

  const BAR_INNER =
    'mx-auto flex w-full max-w-[1720px] items-center px-5 py-3 sm:px-8 sm:py-3.5 lg:px-12 2xl:px-16';

  const barShell = cx(
    'relative w-full',
    'backdrop-blur-[18px]',
    scrolled ? 'bg-[rgba(255,255,255,0.86)]' : 'bg-[rgba(255,255,255,0.78)]',
  );

  // no uppercase for menu links
  const pillBase = 'inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-[13px] transition select-none';

  const navPill = cx(
    pillBase,
    'text-slate-900/78 hover:text-slate-900',
    'bg-black/[0.035] hover:bg-black/[0.055]',
    'ring-1 ring-inset ring-black/[0.08] hover:ring-black/[0.12]',
  );

  const navPillActive = cx(
    pillBase,
    'text-slate-900',
    'bg-black/[0.055]',
    'ring-1 ring-inset ring-[rgba(185,133,51,0.22)]',
  );

  const signatureSearch =
    'inline-flex h-10 items-center gap-2 rounded-full px-4 transition ' +
    'bg-[linear-gradient(180deg,rgba(0,0,0,0.040),rgba(0,0,0,0.028))] ' +
    'ring-1 ring-inset ring-black/[0.10] hover:ring-[rgba(185,133,51,0.22)] ' +
    'shadow-[0_18px_52px_rgba(0,0,0,0.10)]';

  const primaryCta =
    'inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition ' +
    'bg-[linear-gradient(180deg,rgba(185,133,51,0.16),rgba(185,133,51,0.10))] ' +
    'ring-1 ring-inset ring-[rgba(185,133,51,0.28)] hover:ring-[rgba(185,133,51,0.44)] ' +
    'shadow-[0_22px_64px_rgba(0,0,0,0.12)]';

  const subtleText = 'text-slate-700/80';
  const strongText = 'text-slate-900';
  const borderSoft = 'border-black/[0.08]';
  const ringSoft = 'ring-black/[0.10]';

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Royal crown rail */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[60] h-px bg-gradient-to-r from-transparent via-[rgba(185,133,51,0.55)] to-transparent opacity-90" />

      {/* Full-bleed bar */}
      <div className={barShell}>
        {/* Ambient depth + crown glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-16 bg-[radial-gradient(1100px_220px_at_50%_0%,rgba(185,133,51,0.10),transparent_62%)]" />
          <div className={cx('absolute inset-x-0 bottom-0 h-px', borderSoft)} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),transparent_40%,rgba(0,0,0,0.05))]" />
        </div>

        <div className={cx('relative', BAR_INNER)}>
          {/* Brand */}
          <Link href="/" prefetch aria-label="Vantera home" className="group flex shrink-0 items-center">
            <div
              className={cx(
                'relative flex items-center gap-3 rounded-full pl-3 pr-4 py-2',
                'bg-black/[0.035] ring-1 ring-inset ring-black/[0.10]',
                'shadow-[0_16px_48px_rgba(0,0,0,0.10)]',
              )}
            >
              <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(520px_120px_at_18%_0%,rgba(185,133,51,0.12),transparent_62%)] opacity-80" />
              <div className="relative flex items-center gap-2">
                <Crown className="h-4 w-4 text-[rgba(185,133,51,0.90)] opacity-90" />
                <Image
                  src="/brand/vantera-logo-dark.svg"
                  alt="Vantera"
                  width={620}
                  height={180}
                  priority={false}
                  className={cx('h-[30px] w-auto sm:h-[34px] md:h-[36px]', 'contrast-[1.06]')}
                />
              </div>
              <div className="relative hidden sm:flex items-center gap-2 pl-2">
                <span className="h-4 w-px bg-black/[0.10]" />
                <span className={cx('text-[12px] tracking-[0.06em]', goldText)}>Private intelligence</span>
              </div>
            </div>
          </Link>

          {/* Desktop center nav */}
          <nav className="hidden flex-1 items-center justify-center lg:flex" aria-label="Primary">
            <div className="flex items-center gap-2">
              {/* Getaway mega */}
              <div ref={wrapRef} className="relative" onPointerEnter={openMegaSoon} onPointerLeave={closeMegaSoon}>
                <button
                  type="button"
                  onClick={toggleMega}
                  onFocus={() => setMegaOpen(true)}
                  className={cx(megaOpen ? navPillActive : navPill)}
                  aria-expanded={megaOpen}
                  aria-haspopup="menu"
                >
                  <Globe className="h-4 w-4 opacity-80" />
                  <span>Getaway</span>
                  <ChevronDown className={cx('h-4 w-4 transition', megaOpen && 'rotate-180')} />
                </button>

                {/* Mega panel (white gateway, not directory) */}
                <div
                  ref={panelRef}
                  onPointerEnter={() => {
                    cancelTimers();
                    setMegaOpen(true);
                  }}
                  onPointerLeave={closeMegaSoon}
                  className={cx(
                    'fixed left-1/2 top-[78px] z-[80] mt-0 w-[1320px] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 origin-top',
                    'rounded-[34px] overflow-hidden',
'bg-[rgba(255,255,255,0.92)] backdrop-blur-[22px]',
'shadow-[0_60px_180px_rgba(0,0,0,0.22)]',
'ring-1 ring-inset ring-[rgba(185,133,51,0.18)]',
                    'transition-[transform,opacity] duration-200',
                    megaOpen
                      ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                      : 'pointer-events-none -translate-y-1 scale-[0.99] opacity-0',
                  )}
                  role="menu"
                  aria-label="Places menu"
                >
                  {/* Crown rail inside panel */}
<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(185,133,51,0.62)] to-transparent opacity-95" />

{/* Rich aura + glass depth */}
<div className="pointer-events-none absolute inset-0">
  {/* warm crown halo */}
  <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(1100px_360px_at_50%_0%,rgba(185,133,51,0.14),transparent_62%)]" />

  {/* side auras (adds richness without going dark) */}
  <div className="absolute -left-28 top-10 h-80 w-80 rounded-full bg-[rgba(185,133,51,0.10)] blur-3xl" />
  <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-[rgba(185,133,51,0.08)] blur-3xl" />

  {/* subtle vignette for depth */}
  <div className="absolute inset-0 bg-[radial-gradient(1200px_520px_at_50%_20%,transparent_52%,rgba(0,0,0,0.06)_100%)]" />

  {/* micro-glass shading */}
  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.015),transparent_38%,rgba(0,0,0,0.05))]" />
</div>

                  {/* Header */}
                  <div className={cx('relative flex items-center justify-between gap-4 px-7 py-6 border-b', borderSoft)}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[rgba(185,133,51,0.92)] opacity-90" />
                        <div className={cx('text-[12px] font-semibold tracking-[0.08em]', goldText)}>Gateway</div>
                      </div>
                      <div className={cx('mt-2 text-[14px] leading-snug', subtleText)}>
                        Enter by intent. Search is primary. Curated entry points only.
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {countries.map((c) => (
                          <Link
                            key={c}
                            href={countryHref(c)}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className={cx(
                              'rounded-full px-3.5 py-1.5 text-[12px] transition',
                              'bg-black/[0.03] hover:bg-black/[0.05]',
                              'ring-1 ring-inset ring-black/[0.08] hover:ring-black/[0.12]',
                              'text-slate-900/80 hover:text-slate-900',
                            )}
                            role="menuitem"
                          >
                            {c}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/search"
                        prefetch
                        onClick={() => setMegaOpen(false)}
                        className={cx(
                          'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                          'bg-black/[0.03] hover:bg-black/[0.05]',
                          'ring-1 ring-inset ring-black/[0.08] hover:ring-[rgba(185,133,51,0.22)]',
                          'text-slate-900/80 hover:text-slate-900',
                        )}
                      >
                        <Command className="h-4 w-4 opacity-80" />
                        Open search
                        <span className="ml-1 font-mono text-[11px] text-slate-700/80">/</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setMegaOpen(false)}
                        className={cx(
                          'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                          'bg-black/[0.02] hover:bg-black/[0.04]',
                          'ring-1 ring-inset ring-black/[0.06] hover:ring-black/[0.10]',
                          'text-slate-900/70 hover:text-slate-900',
                        )}
                      >
                        <X className="h-4 w-4 opacity-80" />
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="relative grid grid-cols-12 gap-7 px-7 py-7">
                    {/* Collections */}
                    <div className="col-span-3">
                      <div className={cx('mb-3 text-[12px] font-semibold tracking-[0.08em]', goldText)}>
                        Collections
                      </div>

                      <div className="grid gap-2">
                        {collections.map((it) => (
                          <Link
                            key={it.q}
                            href={collectionHref(it.q)}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className={cx(
                              'group relative overflow-hidden rounded-2xl px-3.5 py-3 text-sm transition',
                              'bg-black/[0.03] hover:bg-black/[0.05]',
                              'ring-1 ring-inset ring-black/[0.08] hover:ring-[rgba(185,133,51,0.22)]',
                              'text-slate-900/80 hover:text-slate-900',
                            )}
                            role="menuitem"
                          >
                            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              <div className="absolute inset-0 bg-[radial-gradient(540px_160px_at_12%_0%,rgba(185,133,51,0.10),transparent_62%)]" />
                            </div>
                            <div className="relative flex items-center justify-between gap-3">
                              <span className="truncate">{it.label}</span>
                              <ArrowRight className="h-4 w-4 opacity-55 transition group-hover:translate-x-0.5 group-hover:opacity-85" />
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className={cx('mt-4 rounded-2xl p-4 ring-1 ring-inset', ringSoft, 'bg-black/[0.02]')}>
                        <div className="text-[12px] font-semibold tracking-[0.06em] text-slate-900/70">Regions</div>
                        <div className="mt-2 grid gap-2">
                          {topRegions.map((r) => (
                            <Link
                              key={r}
                              href={regionHref(r)}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'rounded-xl px-3 py-2 text-[13px] transition',
                                'bg-black/[0.03] hover:bg-black/[0.05]',
                                'ring-1 ring-inset ring-black/[0.08] hover:ring-black/[0.12]',
                                'text-slate-900/78 hover:text-slate-900',
                              )}
                              role="menuitem"
                            >
                              {r}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Featured cities */}
                    <div className="col-span-5">
                      <div className={cx('mb-3 text-[12px] font-semibold tracking-[0.08em]', goldText)}>
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
                              'group relative overflow-hidden rounded-2xl px-4 py-3.5 transition',
                              'bg-[linear-gradient(180deg,rgba(0,0,0,0.030),rgba(0,0,0,0.020))]',
                              'hover:bg-[linear-gradient(180deg,rgba(0,0,0,0.050),rgba(0,0,0,0.030))]',
                              'ring-1 ring-inset ring-black/[0.08] hover:ring-[rgba(185,133,51,0.22)]',
                            )}
                            role="menuitem"
                          >
                            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              <div className="absolute inset-0 bg-[radial-gradient(620px_180px_at_18%_0%,rgba(185,133,51,0.10),transparent_62%)]" />
                            </div>

                            <div className="relative flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="truncate text-[14px] font-semibold text-slate-900/92">{c.name}</div>
                                <div className="mt-0.5 truncate text-[11px] tracking-[0.14em] text-slate-700/70">
                                  {c.country}
                                </div>
                              </div>

                              <ArrowRight className="h-4 w-4 opacity-55 transition group-hover:translate-x-0.5 group-hover:opacity-90 text-slate-900" />
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div
                        className={cx(
                          'mt-4 flex items-center justify-between rounded-2xl px-4 py-3 ring-1 ring-inset',
                          ringSoft,
                          'bg-black/[0.02]',
                        )}
                      >
                        <div className="text-xs text-slate-700/80">Entry points only. Intelligence expands weekly.</div>
                        <Link
                          href="/search"
                          prefetch
                          onClick={() => setMegaOpen(false)}
                          className="inline-flex items-center gap-2 text-xs text-slate-900/70 hover:text-slate-900 transition"
                        >
                          Search instead <ArrowRight className="h-4 w-4 opacity-70" />
                        </Link>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-4">
                      <div className="grid gap-3">
                        <div className={cx('overflow-hidden rounded-[24px] ring-1 ring-inset', ringSoft, 'bg-black/[0.025]')}>
                          <div className={cx('px-4 py-3 border-b', borderSoft)}>
                            <div className={cx('text-[12px] font-semibold tracking-[0.08em]', goldText)}>Start</div>
                            <div className="mt-1 text-xs text-slate-700/80">One box. Typos allowed. Keywords included.</div>
                          </div>
                          <div className="grid gap-2 p-4">
                            <Link
                              href="/search"
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                                'bg-black/[0.03] hover:bg-black/[0.05]',
                                'ring-1 ring-inset ring-black/[0.08] hover:ring-[rgba(185,133,51,0.22)]',
                                'text-slate-900/86 hover:text-slate-900',
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Command className="h-4 w-4 opacity-85" />
                                Open search
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-70" />
                            </Link>

                            <Link
                              href={intelligenceHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                                'bg-black/[0.025] hover:bg-black/[0.045]',
                                'ring-1 ring-inset ring-black/[0.08] hover:ring-black/[0.12]',
                                'text-slate-900/76 hover:text-slate-900',
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 opacity-80" />
                                Intelligence (coming soon)
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-60" />
                            </Link>
                          </div>
                        </div>

                        <div className={cx('overflow-hidden rounded-[24px] ring-1 ring-inset', ringSoft, 'bg-black/[0.025]')}>
                          <div className={cx('px-4 py-3 border-b', borderSoft)}>
                            <div className={cx('text-[12px] font-semibold tracking-[0.08em]', goldText)}>
                              Private network
                            </div>
                            <div className="mt-1 text-xs text-slate-700/80">Verified sellers and advisors.</div>
                          </div>
                          <div className="grid gap-2 p-4">
                            <Link
                              href={sellersHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                                'bg-black/[0.03] hover:bg-black/[0.05]',
                                'ring-1 ring-inset ring-black/[0.08] hover:ring-black/[0.12]',
                                'text-slate-900/86 hover:text-slate-900',
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Building2 className="h-4 w-4 opacity-85" />
                                Private sellers
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-70" />
                            </Link>

                            <Link
                              href={agentHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                                'bg-black/[0.025] hover:bg-black/[0.045]',
                                'ring-1 ring-inset ring-black/[0.08] hover:ring-black/[0.12]',
                                'text-slate-900/76 hover:text-slate-900',
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Users className="h-4 w-4 opacity-80" />
                                Agents (coming soon)
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-60" />
                            </Link>
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,rgba(185,133,51,0.12),rgba(185,133,51,0.06))] ring-1 ring-inset ring-[rgba(185,133,51,0.22)]">
                          <div className={cx('px-4 py-3 border-b', borderSoft)}>
                            <div className={cx('text-[12px] font-semibold tracking-[0.08em]', goldText)}>
                              Submissions
                            </div>
                            <div className="mt-1 text-xs text-slate-700/80">Private by default. Signal over noise.</div>
                          </div>
                          <div className="p-4">
                            <Link
                              href={sellHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'group inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition',
                                'bg-[linear-gradient(180deg,rgba(185,133,51,0.18),rgba(185,133,51,0.12))]',
                                'hover:bg-[linear-gradient(180deg,rgba(185,133,51,0.24),rgba(185,133,51,0.14))]',
                                'ring-1 ring-inset ring-[rgba(185,133,51,0.32)] hover:ring-[rgba(185,133,51,0.48)]',
                                'shadow-[0_22px_70px_rgba(0,0,0,0.10)]',
                              )}
                            >
                              <span className={cx(goldText, 'text-[15px]')}>{sellLabel}</span>
                              <ArrowRight className="h-4 w-4 opacity-80 text-slate-900 transition group-hover:translate-x-0.5" />
                            </Link>
                            <div className="mt-2 text-[11px] text-slate-700/70">Verification-first pipeline.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Minimal nav links */}
              <Link href={intelligenceHref} prefetch className={navPill}>
                <ShieldCheck className="h-4 w-4 opacity-80" />
                <span>Intelligence</span>
              </Link>

              <Link href={journalHref} prefetch className={navPill}>
                <BookOpen className="h-4 w-4 opacity-80" />
                <span>Journal</span>
              </Link>
            </div>
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex shrink-0 items-center gap-2.5">
            <div className="hidden items-center gap-2.5 sm:flex">
              <button type="button" onClick={openSearchResultsFromAnywhere} className={signatureSearch} aria-label="Search">
                <Command className="h-4 w-4 text-slate-900/70" />
                <span className="text-[13px] tracking-[0.04em] text-slate-900/85">Search</span>
                <span className="text-slate-900/20">·</span>
                <span className="font-mono text-xs text-slate-700/80">/</span>
              </button>

              <Link href={sellHref} prefetch className={primaryCta} aria-label={sellLabel}>
                <span className={goldText}>{sellLabel}</span>
                <ArrowRight className="h-4 w-4 opacity-80 text-slate-900" />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={cx(
                'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm transition lg:hidden',
                'bg-black/[0.035] hover:bg-black/[0.055]',
                'ring-1 ring-inset ring-black/[0.10] hover:ring-black/[0.14]',
                'text-slate-900/80 hover:text-slate-900',
              )}
              aria-expanded={mobileOpen}
              aria-controls="vantera-mobile-menu"
            >
              Menu
              <ChevronDown className={cx('h-4 w-4 transition', mobileOpen && 'rotate-180')} />
            </button>
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
            'absolute right-0 top-0 h-full w-[92vw] max-w-[460px]',
            'bg-[rgba(255,255,255,0.96)] backdrop-blur-[18px]',
            'ring-1 ring-inset ring-black/[0.10]',
            'shadow-[-40px_0_160px_rgba(0,0,0,0.18)]',
            'transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(185,133,51,0.55)] to-transparent opacity-90" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(980px_360px_at_26%_0%,rgba(185,133,51,0.10),transparent_62%)]" />

          <div className={cx('relative flex items-center justify-between px-5 py-5 border-b', borderSoft)}>
            <div className={cx('text-[12px] font-semibold tracking-[0.08em]', goldText)}>Menu</div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={cx(
                'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                'bg-black/[0.03] hover:bg-black/[0.05]',
                'ring-1 ring-inset ring-black/[0.08] hover:ring-black/[0.12]',
                'text-slate-900/78 hover:text-slate-900',
              )}
            >
              <X className="h-4 w-4 opacity-85" />
              Close
            </button>
          </div>

          <div className="relative space-y-4 px-5 py-5">
            {/* Search first */}
            <div className={cx('overflow-hidden rounded-[24px] ring-1 ring-inset', ringSoft, 'bg-black/[0.025]')}>
              <div className={cx('px-4 py-3 border-b', borderSoft)}>
                <div className={cx('text-[12px] font-semibold tracking-[0.08em]', goldText)}>Search</div>
                <div className="mt-1 text-xs text-slate-700/80">One box. Typos allowed. Keywords included.</div>
              </div>
              <div className="grid gap-2 p-4">
                <button
                  type="button"
                  onClick={() => {
                    router.push('/search');
                    setMobileOpen(false);
                  }}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                    'bg-black/[0.03] hover:bg-black/[0.05]',
                    'ring-1 ring-inset ring-black/[0.08] hover:ring-[rgba(185,133,51,0.22)]',
                    'text-slate-900/86 hover:text-slate-900',
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Command className="h-4 w-4 opacity-85" />
                    Open search
                    <span className="ml-2 font-mono text-xs text-slate-700/80">/</span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </button>

                <Link
                  href={sellHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    'bg-[linear-gradient(180deg,rgba(185,133,51,0.18),rgba(185,133,51,0.12))]',
                    'ring-1 ring-inset ring-[rgba(185,133,51,0.32)] hover:ring-[rgba(185,133,51,0.48)]',
                    'text-slate-900',
                  )}
                >
                  <span className={goldText}>{sellLabel}</span>
                  <ArrowRight className="h-4 w-4 opacity-85 text-slate-900" />
                </Link>

                <Link
                  href={agentHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                    'bg-black/[0.03] hover:bg-black/[0.05]',
                    'ring-1 ring-inset ring-black/[0.08] hover:ring-black/[0.12]',
                    'text-slate-900/86 hover:text-slate-900',
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 opacity-85" />
                    Agent login
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Link>
              </div>
            </div>

            {/* Places */}
            <div className={cx('overflow-hidden rounded-[24px] ring-1 ring-inset', ringSoft, 'bg-black/[0.025]')}>
              <div className={cx('px-4 py-3 border-b', borderSoft)}>
                <div className={cx('text-[12px] font-semibold tracking-[0.08em]', goldText)}>Getaway</div>
                <div className="mt-1 text-xs text-slate-700/80">Countries and top cities.</div>
              </div>

              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {countries.map((c) => (
                    <Link
                      key={c}
                      href={countryHref(c)}
                      prefetch
                      onClick={() => setMobileOpen(false)}
                      className={cx(
                        'rounded-full px-3 py-1.5 text-[12px] transition',
                        'bg-black/[0.03] hover:bg-black/[0.05]',
                        'ring-1 ring-inset ring-black/[0.08] hover:ring-black/[0.12]',
                        'text-slate-900/80 hover:text-slate-900',
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
                        'rounded-2xl px-3.5 py-3 transition',
                        'bg-black/[0.03] hover:bg-black/[0.05]',
                        'ring-1 ring-inset ring-black/[0.08] hover:ring-[rgba(185,133,51,0.22)]',
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900/92">{c.name}</div>
                          <div className="truncate text-[11px] tracking-[0.14em] text-slate-700/70">{c.country}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 opacity-70 text-slate-900" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Minimal nav */}
            <div className={cx('overflow-hidden rounded-[24px] ring-1 ring-inset', ringSoft, 'bg-black/[0.025]')}>
              <div className={cx('px-4 py-3 border-b', borderSoft)}>
                <div className={cx('text-[12px] font-semibold tracking-[0.08em]', goldText)}>Navigation</div>
                <div className="mt-1 text-xs text-slate-700/80">Public entry points.</div>
              </div>
              <div className="grid gap-2 p-4">
                <Link
                  href={intelligenceHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                    'bg-black/[0.03] hover:bg-black/[0.05]',
                    'ring-1 ring-inset ring-black/[0.08] hover:ring-black/[0.12]',
                    'text-slate-900/86 hover:text-slate-900',
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 opacity-85" />
                    Intelligence
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Link>

                <Link
                  href={journalHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                    'bg-black/[0.03] hover:bg-black/[0.05]',
                    'ring-1 ring-inset ring-black/[0.08] hover:ring-black/[0.12]',
                    'text-slate-900/86 hover:text-slate-900',
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <BookOpen className="h-4 w-4 opacity-85" />
                    Journal
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Link>

                <Link
                  href={sellersHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                    'bg-black/[0.03] hover:bg-black/[0.05]',
                    'ring-1 ring-inset ring-black/[0.08] hover:ring-black/[0.12]',
                    'text-slate-900/86 hover:text-slate-900',
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Building2 className="h-4 w-4 opacity-85" />
                    Private sellers
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Link>
              </div>
            </div>

            {/* City page switch */}
            {onCityPage ? (
              <div className={cx('overflow-hidden rounded-[24px] ring-1 ring-inset', ringSoft, 'bg-black/[0.025]')}>
                <div className={cx('px-4 py-3 border-b', borderSoft)}>
                  <div className={cx('text-[12px] font-semibold tracking-[0.08em]', goldText)}>City view</div>
                  <div className="mt-1 text-xs text-slate-700/80">Switch: facts (T) or live market (L).</div>
                </div>
                <div className="flex items-center gap-2 p-4">
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
                      'flex-1 rounded-full px-3 py-2 text-sm ring-1 ring-inset transition',
                      activeTab === 'truth'
                        ? 'bg-black/[0.05] text-slate-900 ring-[rgba(185,133,51,0.28)]'
                        : 'bg-black/[0.03] text-slate-900/78 ring-black/[0.08] hover:bg-black/[0.05] hover:ring-black/[0.12]',
                    )}
                  >
                    Facts <span className="ml-1 font-mono text-[11px] opacity-70">T</span>
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
                      'flex-1 rounded-full px-3 py-2 text-sm ring-1 ring-inset transition',
                      activeTab === 'supply'
                        ? 'bg-black/[0.05] text-slate-900 ring-[rgba(185,133,51,0.28)]'
                        : 'bg-black/[0.03] text-slate-900/78 ring-black/[0.08] hover:bg-black/[0.05] hover:ring-black/[0.12]',
                    )}
                  >
                    Live market <span className="ml-1 font-mono text-[11px] opacity-70">L</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="pt-2 text-[11px] text-slate-700/70">Editorial entrance. Search is the product.</div>
          </div>
        </div>
      </div>
    </header>
  );
}
