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

  // Royal system (use your global CSS vars)
  const ink = 'text-[color:var(--ink)]';
  const ink2 = 'text-[color:var(--ink-2)]';
  const ink3 = 'text-[color:var(--ink-3)]';

  const hairline = 'ring-1 ring-inset ring-[color:var(--hairline)]';
  const hairlineHover = 'hover:ring-[rgba(11,12,16,0.18)]';

  const goldText =
    'bg-clip-text text-transparent bg-[linear-gradient(180deg,#f7edcf_0%,#e6c980_45%,#b7863a_100%)]';

  // Full-bleed header background + premium blur
  const barBg = scrolled ? 'bg-[rgba(251,251,250,0.88)]' : 'bg-[rgba(251,251,250,0.72)]';

  // IMPORTANT: match hero inner max width
  const BAR_INNER =
    'mx-auto flex w-full max-w-[1680px] items-center px-5 py-3 sm:px-8 sm:py-3.5 lg:px-12 2xl:px-16';

  const pill =
    'inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-[12px] tracking-[0.14em] uppercase transition';

  const soft = cx('bg-white/62 hover:bg-white/90', hairline, hairlineHover);
  const softTight = cx('bg-white/58 hover:bg-white/88', hairline, hairlineHover);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Full-bleed bar (does not constrain hero) */}
      <div className={cx('relative w-full backdrop-blur-[18px]', barBg)}>
        {/* Royal hairlines + subtle crown glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(231,201,130,0.62)] to-transparent opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[rgba(11,12,16,0.10)]" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_280px_at_50%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
        </div>

        <div className={cx('relative', BAR_INNER)}>
          {/* Brand */}
          <Link href="/" prefetch aria-label="Vantera home" className="flex shrink-0 items-center">
            <Image
              src="/brand/vantera-logo-dark.svg"
              alt="Vantera"
              width={620}
              height={180}
              priority={false}
              className={cx(
                'h-[34px] w-auto sm:h-[40px] md:h-[42px]',
                'drop-shadow-[0_18px_50px_rgba(11,12,16,0.08)]',
              )}
            />
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
                  className={cx(pill, softTight, ink3, megaOpen && ink)}
                  aria-expanded={megaOpen}
                  aria-haspopup="menu"
                >
                  <Globe className="h-4 w-4 opacity-70" />
                  <span>Places</span>
                  <ChevronDown className={cx('h-4 w-4 transition', megaOpen && 'rotate-180')} />
                </button>

                {/* Mega panel (wider, more premium, still safe on small screens) */}
                <div
                  ref={panelRef}
                  onPointerEnter={() => {
                    cancelTimers();
                    setMegaOpen(true);
                  }}
                  onPointerLeave={closeMegaSoon}
                  className={cx(
                    'absolute left-1/2 z-[80] mt-4 w-[1260px] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 origin-top',
                    'rounded-[32px] bg-[color:var(--paper)]',
                    'shadow-[0_44px_140px_rgba(11,12,16,0.14)]',
                    'ring-1 ring-inset ring-[color:var(--hairline)]',
                    'overflow-hidden',
                    'transition-[transform,opacity] duration-200',
                    megaOpen
                      ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                      : 'pointer-events-none -translate-y-1 scale-[0.99] opacity-0',
                  )}
                  role="menu"
                  aria-label="Places menu"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(980px_300px_at_50%_0%,rgba(231,201,130,0.18),transparent_60%)]" />

                  {/* Header */}
                  <div className="relative flex items-center justify-between gap-4 border-b border-[rgba(11,12,16,0.10)] px-7 py-5">
                    <div className="min-w-0">
                      <div className={cx('text-[11px] font-semibold tracking-[0.28em] uppercase', ink3)}>
                        Countries
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {countries.map((c) => (
                          <Link
                            key={c}
                            href={countryHref(c)}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className={cx(
                              'rounded-full px-3.5 py-1.5 text-[12px] transition',
                              'bg-white/75 hover:bg-white/95',
                              'ring-1 ring-inset ring-[color:var(--hairline)]',
                              'hover:ring-[rgba(11,12,16,0.16)]',
                              ink2,
                            )}
                            role="menuitem"
                          >
                            {c}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMegaOpen(false)}
                      className={cx(
                        'inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                        'bg-white/62 hover:bg-white/90',
                        'ring-1 ring-inset ring-[color:var(--hairline)]',
                        'hover:ring-[rgba(11,12,16,0.16)]',
                        ink2,
                      )}
                    >
                      <X className="h-4 w-4 opacity-70" />
                      Close
                    </button>
                  </div>

                  {/* Body */}
                  <div className="relative grid grid-cols-12 gap-7 px-7 py-7">
                    {/* Regions */}
                    <div className="col-span-3">
                      <div className={cx('mb-3 text-[11px] font-semibold tracking-[0.26em] uppercase', ink3)}>
                        Regions
                      </div>
                      <div className="grid gap-2">
                        {topRegions.map((r) => (
                          <Link
                            key={r}
                            href={`/coming-soon?region=${encodeURIComponent(r)}`}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className={cx(
                              'rounded-2xl px-3.5 py-3 text-sm transition',
                              'bg-white/75 hover:bg-white/95',
                              'ring-1 ring-inset ring-[color:var(--hairline)]',
                              'hover:ring-[rgba(11,12,16,0.16)]',
                              ink2,
                            )}
                            role="menuitem"
                          >
                            {r}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Cities */}
                    <div className="col-span-5">
                      <div className={cx('mb-3 text-[11px] font-semibold tracking-[0.26em] uppercase', ink3)}>
                        Cities
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {topCities.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/city/${c.slug}`}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className={cx(
                              'group rounded-2xl px-3.5 py-3 transition',
                              'bg-white/75 hover:bg-white/95',
                              'ring-1 ring-inset ring-[color:var(--hairline)]',
                              'hover:ring-[rgba(11,12,16,0.16)]',
                            )}
                            role="menuitem"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div
                                  className={cx(
                                    'truncate text-sm font-semibold',
                                    ink2,
                                    'group-hover:text-[color:var(--ink)]',
                                  )}
                                >
                                  {c.name}
                                </div>
                                <div className="truncate text-[11px] text-[color:var(--ink-3)]">{c.country}</div>
                              </div>
                              <ArrowRight className="h-4 w-4 opacity-45 transition group-hover:translate-x-0.5 group-hover:opacity-80" />
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/75 ring-1 ring-inset ring-[color:var(--hairline)] px-4 py-3">
                        <div className="text-xs text-[color:var(--ink-3)]">Entry points only. Intelligence expands weekly.</div>
                        <button
                          type="button"
                          onClick={() => {
                            setMegaOpen(false);
                            openSearchFromAnywhere();
                          }}
                          className="inline-flex items-center gap-2 text-xs text-[color:var(--ink-2)] hover:text-[color:var(--ink)] transition"
                        >
                          Search instead <ArrowRight className="h-4 w-4 opacity-70" />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-4">
                      <div className="grid gap-3">
                        <div className="overflow-hidden rounded-[22px] bg-white/80 ring-1 ring-inset ring-[color:var(--hairline)]">
                          <div className="border-b border-[rgba(11,12,16,0.10)] px-4 py-3">
                            <div className={cx('text-[11px] font-semibold tracking-[0.28em] uppercase', ink3)}>
                              Start with search
                            </div>
                            <div className="mt-1 text-xs text-[color:var(--ink-3)]">
                              One box. Typos allowed. Keywords included.
                            </div>
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
                                'bg-white/62 hover:bg-white/92',
                                'ring-1 ring-inset ring-[color:var(--hairline)]',
                                'hover:ring-[rgba(11,12,16,0.16)]',
                                ink2,
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Command className="h-4 w-4 opacity-75" />
                                Open search
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-60" />
                            </button>

                            <Link
                              href={intelligenceHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                                'bg-white/75 hover:bg-white/95',
                                'ring-1 ring-inset ring-[color:var(--hairline)]',
                                'hover:ring-[rgba(11,12,16,0.16)]',
                                ink2,
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 opacity-70" />
                                Intelligence (coming soon)
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-60" />
                            </Link>
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-[22px] bg-white/80 ring-1 ring-inset ring-[color:var(--hairline)]">
                          <div className="border-b border-[rgba(11,12,16,0.10)] px-4 py-3">
                            <div className={cx('text-[11px] font-semibold tracking-[0.28em] uppercase', ink3)}>
                              Private network
                            </div>
                            <div className="mt-1 text-xs text-[color:var(--ink-3)]">Verified sellers and advisors.</div>
                          </div>
                          <div className="grid gap-2 p-4">
                            <Link
                              href={sellersHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                                'bg-white/62 hover:bg-white/92',
                                'ring-1 ring-inset ring-[color:var(--hairline)]',
                                'hover:ring-[rgba(11,12,16,0.16)]',
                                ink2,
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Building2 className="h-4 w-4 opacity-75" />
                                Private sellers
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-60" />
                            </Link>

                            <Link
                              href={agentHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                                'bg-white/75 hover:bg-white/95',
                                'ring-1 ring-inset ring-[color:var(--hairline)]',
                                'hover:ring-[rgba(11,12,16,0.16)]',
                                ink2,
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Users className="h-4 w-4 opacity-70" />
                                Agents (coming soon)
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-60" />
                            </Link>
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-[22px] bg-white/80 ring-1 ring-inset ring-[color:var(--hairline)]">
                          <div className="border-b border-[rgba(11,12,16,0.10)] px-4 py-3">
                            <div className={cx('text-[11px] font-semibold tracking-[0.28em] uppercase', ink3)}>
                              Submissions
                            </div>
                            <div className="mt-1 text-xs text-[color:var(--ink-3)]">Private by default. Signal over noise.</div>
                          </div>
                          <div className="p-4">
                            <Link
                              href={sellHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition',
                                'bg-white/72 hover:bg-white/95',
                                'ring-1 ring-inset ring-[rgba(11,12,16,0.16)]',
                                'shadow-[0_18px_46px_rgba(11,12,16,0.10)]',
                              )}
                            >
                              <span className={goldText}>{sellLabel}</span>
                              <ArrowRight className="h-4 w-4 opacity-75 text-[color:var(--ink)]" />
                            </Link>
                            <div className="mt-2 text-[11px] text-[color:var(--ink-3)]">Verification-first pipeline.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Minimal nav links */}
              <Link href={intelligenceHref} prefetch className={cx(pill, softTight, ink3)}>
                <ShieldCheck className="h-4 w-4 opacity-70" />
                <span>Intelligence</span>
              </Link>

              <Link href={journalHref} prefetch className={cx(pill, softTight, ink3)}>
                <BookOpen className="h-4 w-4 opacity-70" />
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
                className={cx('inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm transition', soft, ink2)}
                aria-label="Search"
              >
                <Command className="h-4 w-4 opacity-70" />
                <span className="text-[12px] tracking-[0.10em] uppercase">Search</span>
                <span className="text-[color:var(--ink-3)]/40">·</span>
                <span className="font-mono text-xs text-[color:var(--ink-2)]">/</span>
              </button>

              <Link
                href={sellHref}
                prefetch
                className={cx(
                  'inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition',
                  'bg-white/72 hover:bg-white/95',
                  'ring-1 ring-inset ring-[rgba(11,12,16,0.16)]',
                  'shadow-[0_18px_46px_rgba(11,12,16,0.10)]',
                )}
                aria-label={sellLabel}
              >
                <span className={goldText}>{sellLabel}</span>
                <ArrowRight className="h-4 w-4 opacity-70 text-[color:var(--ink)]" />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={cx('inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm transition lg:hidden', soft, ink2)}
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
          className={cx('absolute inset-0 bg-black/30 transition-opacity', mobileOpen ? 'opacity-100' : 'opacity-0')}
        />

        <div
          className={cx(
            'absolute right-0 top-0 h-full w-[92vw] max-w-[440px]',
            'bg-[color:var(--paper)] ring-1 ring-inset ring-[color:var(--hairline)]',
            'shadow-[-30px_0_120px_rgba(11,12,16,0.16)]',
            'transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(980px_300px_at_26%_0%,rgba(231,201,130,0.16),transparent_60%)]" />

          <div className="relative flex items-center justify-between border-b border-[rgba(11,12,16,0.10)] px-5 py-5">
            <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[color:var(--ink-3)]">Menu</div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={cx(
                'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] transition',
                'bg-white/62 hover:bg-white/90',
                'ring-1 ring-inset ring-[color:var(--hairline)]',
                'hover:ring-[rgba(11,12,16,0.16)]',
                ink2,
              )}
            >
              <X className="h-4 w-4 opacity-70" />
              Close
            </button>
          </div>

          <div className="relative space-y-4 px-5 py-5">
            {/* Search first */}
            <div className="overflow-hidden rounded-[22px] bg-white/75 ring-1 ring-inset ring-[color:var(--hairline)]">
              <div className="border-b border-[rgba(11,12,16,0.10)] px-4 py-3">
                <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[color:var(--ink-3)]">
                  Search
                </div>
                <div className="mt-1 text-xs text-[color:var(--ink-3)]">One box. Typos allowed. Keywords included.</div>
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
                    'bg-white/62 hover:bg-white/92',
                    'ring-1 ring-inset ring-[color:var(--hairline)]',
                    'hover:ring-[rgba(11,12,16,0.16)]',
                    ink2,
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Command className="h-4 w-4 opacity-75" />
                    Open search
                    <span className="ml-2 font-mono text-xs text-[color:var(--ink-2)]">/</span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </button>

                <Link
                  href={sellHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    'bg-white/72 hover:bg-white/95',
                    'ring-1 ring-inset ring-[rgba(11,12,16,0.16)]',
                  )}
                >
                  <span className={goldText}>{sellLabel}</span>
                  <ArrowRight className="h-4 w-4 opacity-70 text-[color:var(--ink)]" />
                </Link>

                <Link
                  href={agentHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                    'bg-white/62 hover:bg-white/92',
                    'ring-1 ring-inset ring-[color:var(--hairline)]',
                    'hover:ring-[rgba(11,12,16,0.16)]',
                    ink2,
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 opacity-75" />
                    Agent login
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </Link>
              </div>
            </div>

            {/* Places */}
            <div className="overflow-hidden rounded-[22px] bg-white/75 ring-1 ring-inset ring-[color:var(--hairline)]">
              <div className="border-b border-[rgba(11,12,16,0.10)] px-4 py-3">
                <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[color:var(--ink-3)]">
                  Places
                </div>
                <div className="mt-1 text-xs text-[color:var(--ink-3)]">Countries and top cities.</div>
              </div>

              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {countries.map((c) => (
                    <Link
                      key={c}
                      href={countryHref(c)}
                      prefetch
                      onClick={() => setMobileOpen(false)}
                      className="rounded-full bg-white/80 px-3 py-1.5 text-[12px] text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)] hover:bg-white/95 hover:ring-[rgba(11,12,16,0.16)] transition"
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
                      className="rounded-2xl bg-white/75 px-3.5 py-3 ring-1 ring-inset ring-[color:var(--hairline)] hover:bg-white/95 hover:ring-[rgba(11,12,16,0.16)] transition"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-[color:var(--ink-2)]">{c.name}</div>
                          <div className="truncate text-[11px] text-[color:var(--ink-3)]">{c.country}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 opacity-55" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Minimal nav */}
            <div className="overflow-hidden rounded-[22px] bg-white/75 ring-1 ring-inset ring-[color:var(--hairline)]">
              <div className="border-b border-[rgba(11,12,16,0.10)] px-4 py-3">
                <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[color:var(--ink-3)]">
                  Navigation
                </div>
                <div className="mt-1 text-xs text-[color:var(--ink-3)]">Public entry points.</div>
              </div>
              <div className="grid gap-2 p-4">
                <Link
                  href={intelligenceHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-full items-center justify-between rounded-2xl bg-white/62 px-4 py-3 text-sm text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)] hover:bg-white/92 hover:ring-[rgba(11,12,16,0.16)] transition"
                >
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 opacity-75" />
                    Intelligence
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </Link>

                <Link
                  href={journalHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-full items-center justify-between rounded-2xl bg-white/62 px-4 py-3 text-sm text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)] hover:bg-white/92 hover:ring-[rgba(11,12,16,0.16)] transition"
                >
                  <span className="inline-flex items-center gap-2">
                    <BookOpen className="h-4 w-4 opacity-75" />
                    Journal
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </Link>

                <Link
                  href={sellersHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-full items-center justify-between rounded-2xl bg-white/62 px-4 py-3 text-sm text-[color:var(--ink-2)] ring-1 ring-inset ring-[color:var(--hairline)] hover:bg-white/92 hover:ring-[rgba(11,12,16,0.16)] transition"
                >
                  <span className="inline-flex items-center gap-2">
                    <Building2 className="h-4 w-4 opacity-75" />
                    Private sellers
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </Link>
              </div>
            </div>

            {/* City page switch */}
            {onCityPage ? (
              <div className="overflow-hidden rounded-[22px] bg-white/75 ring-1 ring-inset ring-[color:var(--hairline)]">
                <div className="border-b border-[rgba(11,12,16,0.10)] px-4 py-3">
                  <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[color:var(--ink-3)]">
                    City view
                  </div>
                  <div className="mt-1 text-xs text-[color:var(--ink-3)]">Switch: facts (T) or live market (L).</div>
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
                        ? 'bg-white/95 text-[color:var(--ink)] ring-[rgba(11,12,16,0.16)]'
                        : 'bg-white/80 text-[color:var(--ink-2)] ring-[color:var(--hairline)] hover:bg-white/95 hover:ring-[rgba(11,12,16,0.16)]',
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
                        ? 'bg-white/95 text-[color:var(--ink)] ring-[rgba(11,12,16,0.16)]'
                        : 'bg-white/80 text-[color:var(--ink-2)] ring-[color:var(--hairline)] hover:bg-white/95 hover:ring-[rgba(11,12,16,0.16)]',
                    )}
                  >
                    Live market <span className="ml-1 font-mono text-[11px] opacity-70">L</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="pt-2 text-[11px] text-[color:var(--ink-3)]">Editorial entrance. Search is the product.</div>
          </div>
        </div>
      </div>
    </header>
  );
}
