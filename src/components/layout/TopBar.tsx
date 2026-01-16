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
        if (pathname !== '/') {
          router.push('/');
          window.setTimeout(() => dispatchFocusSearch(), 350);
          return;
        }
        dispatchFocusSearch();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pathname, router]);
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
        .Ultra
        ? []
        : cityList
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
    return `/coming-soon?country=${encodeURIComponent(country)}`;
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

  function openSearchFromAnywhere() {
    if (pathname !== '/') {
      router.push('/');
      window.setTimeout(() => dispatchFocusSearch(), 350);
      return;
    }
    dispatchFocusSearch();
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
    { label: 'Ultra Prime', q: 'ultra_prime' },
    { label: 'Waterfront', q: 'waterfront' },
    { label: 'Sea View', q: 'sea_view' },
    { label: 'Gated', q: 'gated' },
    { label: 'Golf', q: 'golf' },
    { label: 'New Build', q: 'new_build' },
    { label: 'Yield', q: 'yield' },
    { label: 'Walkable', q: 'walkable' },
  ];

  function collectionHref(key: string) {
    return `/coming-soon?collection=${encodeURIComponent(key)}`;
  }

  // Royal visual system (dark glass header + gold crown)
  const goldText =
    'bg-clip-text text-transparent bg-[linear-gradient(180deg,#fbf0d6_0%,#e9cc86_40%,#b98533_100%)]';

  const BAR_INNER =
    'mx-auto flex w-full max-w-[1720px] items-center px-5 py-3 sm:px-8 sm:py-3.5 lg:px-12 2xl:px-16';

  const barShell = cx(
    'relative w-full',
    'backdrop-blur-[18px]',
    scrolled ? 'bg-[rgba(9,11,15,0.74)]' : 'bg-[rgba(9,11,15,0.58)]',
  );

  const pillBase =
    'inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-[12px] tracking-[0.16em] uppercase transition select-none';

  const navPill = cx(
    pillBase,
    'text-white/76 hover:text-white',
    'bg-white/[0.06] hover:bg-white/[0.10]',
    'ring-1 ring-inset ring-white/[0.12] hover:ring-white/[0.18]',
  );

  const navPillActive = cx(
    pillBase,
    'text-white',
    'bg-white/[0.10]',
    'ring-1 ring-inset ring-[rgba(231,201,130,0.38)]',
  );

  const signatureSearch =
    'inline-flex h-10 items-center gap-2 rounded-full px-4 transition ' +
    'bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.06))] ' +
    'ring-1 ring-inset ring-white/[0.14] hover:ring-[rgba(231,201,130,0.42)] ' +
    'shadow-[0_22px_60px_rgba(0,0,0,0.35)]';

  const primaryCta =
    'inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition ' +
    'bg-[linear-gradient(180deg,rgba(251,240,214,0.18),rgba(231,201,130,0.10))] ' +
    'ring-1 ring-inset ring-[rgba(231,201,130,0.38)] hover:ring-[rgba(231,201,130,0.62)] ' +
    'shadow-[0_26px_74px_rgba(0,0,0,0.38)]';

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Royal crown rail */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[60] h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.72)] to-transparent opacity-80" />

      {/* Full-bleed bar */}
      <div className={barShell}>
        {/* Ambient depth + crown glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-16 bg-[radial-gradient(1100px_220px_at_50%_0%,rgba(231,201,130,0.16),transparent_62%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.10]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.10),transparent_36%,rgba(0,0,0,0.22))]" />
        </div>

        <div className={cx('relative', BAR_INNER)}>
          {/* Brand */}
          <Link href="/" prefetch aria-label="Vantera home" className="group flex shrink-0 items-center">
            <div
              className={cx(
                'relative flex items-center gap-3 rounded-full pl-3 pr-4 py-2',
                'bg-white/[0.06] ring-1 ring-inset ring-white/[0.12]',
                'shadow-[0_20px_60px_rgba(0,0,0,0.35)]',
              )}
            >
              <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(520px_120px_at_18%_0%,rgba(231,201,130,0.18),transparent_62%)] opacity-70" />
              <div className="relative flex items-center gap-2">
                <Crown className="h-4 w-4 text-[rgba(231,201,130,0.80)] opacity-90" />
                <Image
                  src="/brand/vantera-logo-dark.svg"
                  alt="Vantera"
                  width={620}
                  height={180}
                  priority={false}
                  className={cx(
                    'h-[30px] w-auto sm:h-[34px] md:h-[36px]',
                    'brightness-[1.18] contrast-[1.08]',
                  )}
                />
              </div>
              <div className="relative hidden sm:flex items-center gap-2 pl-2">
                <span className="h-4 w-px bg-white/[0.14]" />
                <span className={cx('text-[11px] tracking-[0.22em] uppercase', goldText)}>Private Intelligence</span>
              </div>
            </div>
          </Link>

          {/* Desktop center nav */}
          <nav className="hidden flex-1 items-center justify-center lg:flex" aria-label="Primary">
            <div className="flex items-center gap-2">
              {/* Places mega */}
              <div
                ref={wrapRef}
                className="relative"
                onPointerEnter={openMegaSoon}
                onPointerLeave={closeMegaSoon}
              >
                <button
                  type="button"
                  onClick={toggleMega}
                  onFocus={() => setMegaOpen(true)}
                  className={cx(megaOpen ? navPillActive : navPill)}
                  aria-expanded={megaOpen}
                  aria-haspopup="menu"
                >
                  <Globe className="h-4 w-4 opacity-80" />
                  <span>Places</span>
                  <ChevronDown className={cx('h-4 w-4 transition', megaOpen && 'rotate-180')} />
                </button>

                {/* Mega panel (dark gateway, not directory) */}
                <div
                  ref={panelRef}
                  onPointerEnter={() => {
                    cancelTimers();
                    setMegaOpen(true);
                  }}
                  onPointerLeave={closeMegaSoon}
                  className={cx(
                    'absolute left-1/2 z-[80] mt-4 w-[1320px] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 origin-top',
                    'rounded-[34px] overflow-hidden',
                    'bg-[rgba(9,11,15,0.92)] backdrop-blur-[18px]',
                    'shadow-[0_54px_160px_rgba(0,0,0,0.62)]',
                    'ring-1 ring-inset ring-white/[0.12]',
                    'transition-[transform,opacity] duration-200',
                    megaOpen
                      ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                      : 'pointer-events-none -translate-y-1 scale-[0.99] opacity-0',
                  )}
                  role="menu"
                  aria-label="Places menu"
                >
                  {/* Crown rail inside panel */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.72)] to-transparent opacity-80" />
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(1100px_340px_at_50%_0%,rgba(231,201,130,0.16),transparent_62%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),transparent_40%,rgba(0,0,0,0.42))]" />
                  </div>

                  {/* Header */}
                  <div className="relative flex items-center justify-between gap-4 border-b border-white/[0.10] px-7 py-6">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[rgba(231,201,130,0.85)] opacity-90" />
                        <div className={cx('text-[11px] font-semibold tracking-[0.30em] uppercase', goldText)}>
                          Gateway
                        </div>
                      </div>
                      <div className="mt-2 text-[14px] leading-snug text-white/86">
                        Enter by intent. Search is primary. Places are curated.
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
                              'bg-white/[0.06] hover:bg-white/[0.10]',
                              'ring-1 ring-inset ring-white/[0.12] hover:ring-white/[0.18]',
                              'text-white/78 hover:text-white',
                            )}
                            role="menuitem"
                          >
                            {c}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMegaOpen(false);
                          openSearchFromAnywhere();
                        }}
                        className={cx(
                          'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                          'bg-white/[0.06] hover:bg-white/[0.10]',
                          'ring-1 ring-inset ring-white/[0.12] hover:ring-[rgba(231,201,130,0.42)]',
                          'text-white/80 hover:text-white',
                        )}
                      >
                        <Command className="h-4 w-4 opacity-80" />
                        Open search
                        <span className="ml-1 font-mono text-[11px] text-white/70">/</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMegaOpen(false)}
                        className={cx(
                          'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                          'bg-white/[0.04] hover:bg-white/[0.08]',
                          'ring-1 ring-inset ring-white/[0.10] hover:ring-white/[0.16]',
                          'text-white/72 hover:text-white',
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
                      <div className={cx('mb-3 text-[11px] font-semibold tracking-[0.28em] uppercase', goldText)}>
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
                              'bg-white/[0.05] hover:bg-white/[0.10]',
                              'ring-1 ring-inset ring-white/[0.12] hover:ring-[rgba(231,201,130,0.34)]',
                              'text-white/80 hover:text-white',
                            )}
                            role="menuitem"
                          >
                            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              <div className="absolute inset-0 bg-[radial-gradient(540px_160px_at_12%_0%,rgba(231,201,130,0.18),transparent_62%)]" />
                            </div>
                            <div className="relative flex items-center justify-between gap-3">
                              <span className="truncate">{it.label}</span>
                              <ArrowRight className="h-4 w-4 opacity-55 transition group-hover:translate-x-0.5 group-hover:opacity-85" />
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 rounded-2xl bg-white/[0.04] ring-1 ring-inset ring-white/[0.10] p-4">
                        <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-white/60">
                          Regions
                        </div>
                        <div className="mt-2 grid gap-2">
                          {topRegions.map((r) => (
                            <Link
                              key={r}
                              href={`/coming-soon?region=${encodeURIComponent(r)}`}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'rounded-xl px-3 py-2 text-[13px] transition',
                                'bg-white/[0.05] hover:bg-white/[0.10]',
                                'ring-1 ring-inset ring-white/[0.10] hover:ring-white/[0.16]',
                                'text-white/76 hover:text-white',
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
                      <div className={cx('mb-3 text-[11px] font-semibold tracking-[0.28em] uppercase', goldText)}>
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
                              'bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.04))]',
                              'hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.06))]',
                              'ring-1 ring-inset ring-white/[0.12] hover:ring-[rgba(231,201,130,0.34)]',
                            )}
                            role="menuitem"
                          >
                            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              <div className="absolute inset-0 bg-[radial-gradient(620px_180px_at_18%_0%,rgba(231,201,130,0.16),transparent_62%)]" />
                            </div>

                            <div className="relative flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="truncate text-[14px] font-semibold text-white/92">{c.name}</div>
                                <div className="mt-0.5 truncate text-[11px] tracking-[0.18em] uppercase text-white/55">
                                  {c.country}
                                </div>
                              </div>

                              <ArrowRight className="h-4 w-4 opacity-55 transition group-hover:translate-x-0.5 group-hover:opacity-90 text-white" />
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/[0.04] ring-1 ring-inset ring-white/[0.10] px-4 py-3">
                        <div className="text-xs text-white/60">
                          Entry points only. Intelligence expands weekly.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setMegaOpen(false);
                            openSearchFromAnywhere();
                          }}
                          className="inline-flex items-center gap-2 text-xs text-white/76 hover:text-white transition"
                        >
                          Search instead <ArrowRight className="h-4 w-4 opacity-75" />
                        </button>
                      </div>
                    </div>

                    {/* Actions (commanding) */}
                    <div className="col-span-4">
                      <div className="grid gap-3">
                        <div className="overflow-hidden rounded-[24px] bg-white/[0.05] ring-1 ring-inset ring-white/[0.12]">
                          <div className="border-b border-white/[0.10] px-4 py-3">
                            <div className={cx('text-[11px] font-semibold tracking-[0.28em] uppercase', goldText)}>
                              Start
                            </div>
                            <div className="mt-1 text-xs text-white/60">One box. Typos allowed. Keywords included.</div>
                          </div>
                          <div className="grid gap-2 p-4">
                            <button
                              type="button"
                              onClick={() => {
                                setMegaOpen(false);
                                openSearchFromAnywhere();
                              }}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                                'bg-white/[0.06] hover:bg-white/[0.10]',
                                'ring-1 ring-inset ring-white/[0.12] hover:ring-[rgba(231,201,130,0.34)]',
                                'text-white/84 hover:text-white',
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Command className="h-4 w-4 opacity-85" />
                                Open search
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-70" />
                            </button>

                            <Link
                              href={intelligenceHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                                'bg-white/[0.05] hover:bg-white/[0.09]',
                                'ring-1 ring-inset ring-white/[0.10] hover:ring-white/[0.16]',
                                'text-white/76 hover:text-white',
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 opacity-80" />
                                Intelligence (coming soon)
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-65" />
                            </Link>
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-[24px] bg-white/[0.05] ring-1 ring-inset ring-white/[0.12]">
                          <div className="border-b border-white/[0.10] px-4 py-3">
                            <div className={cx('text-[11px] font-semibold tracking-[0.28em] uppercase', goldText)}>
                              Private network
                            </div>
                            <div className="mt-1 text-xs text-white/60">Verified sellers and advisors.</div>
                          </div>
                          <div className="grid gap-2 p-4">
                            <Link
                              href={sellersHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                                'bg-white/[0.06] hover:bg-white/[0.10]',
                                'ring-1 ring-inset ring-white/[0.12] hover:ring-white/[0.18]',
                                'text-white/84 hover:text-white',
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
                                'bg-white/[0.05] hover:bg-white/[0.09]',
                                'ring-1 ring-inset ring-white/[0.10] hover:ring-white/[0.16]',
                                'text-white/76 hover:text-white',
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Users className="h-4 w-4 opacity-80" />
                                Agents (coming soon)
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-65" />
                            </Link>
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-[24px] bg-white/[0.05] ring-1 ring-inset ring-[rgba(231,201,130,0.24)]">
                          <div className="border-b border-white/[0.10] px-4 py-3">
                            <div className={cx('text-[11px] font-semibold tracking-[0.28em] uppercase', goldText)}>
                              Submissions
                            </div>
                            <div className="mt-1 text-xs text-white/60">Private by default. Signal over noise.</div>
                          </div>
                          <div className="p-4">
                            <Link
                              href={sellHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'group inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition',
                                'bg-[linear-gradient(180deg,rgba(251,240,214,0.18),rgba(231,201,130,0.10))]',
                                'hover:bg-[linear-gradient(180deg,rgba(251,240,214,0.26),rgba(231,201,130,0.14))]',
                                'ring-1 ring-inset ring-[rgba(231,201,130,0.44)] hover:ring-[rgba(231,201,130,0.70)]',
                                'shadow-[0_26px_74px_rgba(0,0,0,0.45)]',
                              )}
                            >
                              <span className={goldText}>{sellLabel}</span>
                              <ArrowRight className="h-4 w-4 opacity-85 text-white transition group-hover:translate-x-0.5" />
                            </Link>
                            <div className="mt-2 text-[11px] text-white/55">Verification-first pipeline.</div>
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
              <button
                type="button"
                onClick={openSearchFromAnywhere}
                className={signatureSearch}
                aria-label="Search"
              >
                <Command className="h-4 w-4 text-white/80" />
                <span className="text-[12px] tracking-[0.12em] uppercase text-white/85">Search</span>
                <span className="text-white/30">·</span>
                <span className="font-mono text-xs text-white/70">/</span>
              </button>

              <Link href={sellHref} prefetch className={primaryCta} aria-label={sellLabel}>
                <span className={goldText}>{sellLabel}</span>
                <ArrowRight className="h-4 w-4 opacity-80 text-white" />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={cx(
                'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm transition lg:hidden',
                'bg-white/[0.06] hover:bg-white/[0.10]',
                'ring-1 ring-inset ring-white/[0.12] hover:ring-white/[0.18]',
                'text-white/80 hover:text-white',
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
          className={cx('absolute inset-0 bg-black/50 transition-opacity', mobileOpen ? 'opacity-100' : 'opacity-0')}
        />

        <div
          className={cx(
            'absolute right-0 top-0 h-full w-[92vw] max-w-[460px]',
            'bg-[rgba(9,11,15,0.96)] backdrop-blur-[18px]',
            'ring-1 ring-inset ring-white/[0.12]',
            'shadow-[-40px_0_160px_rgba(0,0,0,0.72)]',
            'transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.72)] to-transparent opacity-80" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(980px_360px_at_26%_0%,rgba(231,201,130,0.16),transparent_62%)]" />

          <div className="relative flex items-center justify-between border-b border-white/[0.10] px-5 py-5">
            <div className={cx('text-[11px] font-semibold tracking-[0.30em] uppercase', goldText)}>Menu</div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={cx(
                'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                'bg-white/[0.06] hover:bg-white/[0.10]',
                'ring-1 ring-inset ring-white/[0.12] hover:ring-white/[0.18]',
                'text-white/78 hover:text-white',
              )}
            >
              <X className="h-4 w-4 opacity-85" />
              Close
            </button>
          </div>

          <div className="relative space-y-4 px-5 py-5">
            {/* Search first */}
            <div className="overflow-hidden rounded-[24px] bg-white/[0.05] ring-1 ring-inset ring-white/[0.12]">
              <div className="border-b border-white/[0.10] px-4 py-3">
                <div className={cx('text-[11px] font-semibold tracking-[0.28em] uppercase', goldText)}>Search</div>
                <div className="mt-1 text-xs text-white/60">One box. Typos allowed. Keywords included.</div>
              </div>
              <div className="grid gap-2 p-4">
                <button
                  type="button"
                  onClick={() => {
                    openSearchFromAnywhere();
                    setMobileOpen(false);
                  }}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                    'bg-white/[0.06] hover:bg-white/[0.10]',
                    'ring-1 ring-inset ring-white/[0.12] hover:ring-[rgba(231,201,130,0.34)]',
                    'text-white/84 hover:text-white',
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Command className="h-4 w-4 opacity-85" />
                    Open search
                    <span className="ml-2 font-mono text-xs text-white/70">/</span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </button>

                <Link
                  href={sellHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    'bg-[linear-gradient(180deg,rgba(251,240,214,0.18),rgba(231,201,130,0.10))]',
                    'ring-1 ring-inset ring-[rgba(231,201,130,0.44)] hover:ring-[rgba(231,201,130,0.70)]',
                    'text-white',
                  )}
                >
                  <span className={goldText}>{sellLabel}</span>
                  <ArrowRight className="h-4 w-4 opacity-85 text-white" />
                </Link>

                <Link
                  href={agentHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                    'bg-white/[0.06] hover:bg-white/[0.10]',
                    'ring-1 ring-inset ring-white/[0.12] hover:ring-white/[0.18]',
                    'text-white/84 hover:text-white',
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
            <div className="overflow-hidden rounded-[24px] bg-white/[0.05] ring-1 ring-inset ring-white/[0.12]">
              <div className="border-b border-white/[0.10] px-4 py-3">
                <div className={cx('text-[11px] font-semibold tracking-[0.28em] uppercase', goldText)}>Places</div>
                <div className="mt-1 text-xs text-white/60">Countries and top cities.</div>
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
                        'bg-white/[0.06] hover:bg-white/[0.10]',
                        'ring-1 ring-inset ring-white/[0.12] hover:ring-white/[0.18]',
                        'text-white/78 hover:text-white',
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
                        'bg-white/[0.06] hover:bg-white/[0.10]',
                        'ring-1 ring-inset ring-white/[0.12] hover:ring-[rgba(231,201,130,0.34)]',
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-white/90">{c.name}</div>
                          <div className="truncate text-[11px] tracking-[0.16em] uppercase text-white/55">{c.country}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 opacity-70 text-white" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Minimal nav */}
            <div className="overflow-hidden rounded-[24px] bg-white/[0.05] ring-1 ring-inset ring-white/[0.12]">
              <div className="border-b border-white/[0.10] px-4 py-3">
                <div className={cx('text-[11px] font-semibold tracking-[0.28em] uppercase', goldText)}>Navigation</div>
                <div className="mt-1 text-xs text-white/60">Public entry points.</div>
              </div>
              <div className="grid gap-2 p-4">
                <Link
                  href={intelligenceHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                    'bg-white/[0.06] hover:bg-white/[0.10]',
                    'ring-1 ring-inset ring-white/[0.12] hover:ring-white/[0.18]',
                    'text-white/84 hover:text-white',
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
                    'bg-white/[0.06] hover:bg-white/[0.10]',
                    'ring-1 ring-inset ring-white/[0.12] hover:ring-white/[0.18]',
                    'text-white/84 hover:text-white',
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
                    'bg-white/[0.06] hover:bg-white/[0.10]',
                    'ring-1 ring-inset ring-white/[0.12] hover:ring-white/[0.18]',
                    'text-white/84 hover:text-white',
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
              <div className="overflow-hidden rounded-[24px] bg-white/[0.05] ring-1 ring-inset ring-white/[0.12]">
                <div className="border-b border-white/[0.10] px-4 py-3">
                  <div className={cx('text-[11px] font-semibold tracking-[0.28em] uppercase', goldText)}>City view</div>
                  <div className="mt-1 text-xs text-white/60">Switch: facts (T) or live market (L).</div>
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
                        ? 'bg-white/[0.12] text-white ring-[rgba(231,201,130,0.40)]'
                        : 'bg-white/[0.06] text-white/78 ring-white/[0.12] hover:bg-white/[0.10] hover:ring-white/[0.18]',
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
                        ? 'bg-white/[0.12] text-white ring-[rgba(231,201,130,0.40)]'
                        : 'bg-white/[0.06] text-white/78 ring-white/[0.12] hover:bg-white/[0.10] hover:ring-white/[0.18]',
                    )}
                  >
                    Live market <span className="ml-1 font-mono text-[11px] opacity-70">L</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="pt-2 text-[11px] text-white/50">Editorial entrance. Search is the product.</div>
          </div>
        </div>
      </div>
    </header>
  );
}
