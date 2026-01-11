// src/components/layout/TopBar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronDown, Command, Globe, MapPin, X } from 'lucide-react';

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

function focusGlobalSearch() {
  const el =
    (document.getElementById('vantera-city-search') as HTMLInputElement | null) ||
    (document.getElementById('locus-city-search') as HTMLInputElement | null);
  el?.focus();
}

function useHotkeyFocusSearch(pathname: string | null, router: ReturnType<typeof useRouter>) {
  const lastKeyAt = useRef<number>(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Element | null;
      if (isEditableTarget(target)) return;

      const now = Date.now();
      if (now - lastKeyAt.current < 120) return;
      lastKeyAt.current = now;

      if (e.key === '/') {
        e.preventDefault();

        if (pathname !== '/') {
          router.push('/');
          window.setTimeout(() => focusGlobalSearch(), 350);
          return;
        }

        focusGlobalSearch();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pathname, router]);
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

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useHotkeyFocusSearch(pathname, router);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop mega
  const [megaOpen, setMegaOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Hover intent
  const openT = useRef<number | null>(null);
  const closeT = useRef<number | null>(null);

  const onCityPage = useMemo(() => pathname?.startsWith('/city/'), [pathname]);

  const activeTab = useMemo(() => {
    const t = (searchParams?.get('tab') ?? '').toLowerCase();
    if (t === 'truth' || t === 'supply') return t;
    return 'truth';
  }, [searchParams]);

  // Scroll style
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  // Escape + city shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Element | null;
      if (isEditableTarget(target)) return;

      if (e.key === 'Escape') {
        setMobileOpen(false);
        setMegaOpen(false);
      }

      if (onCityPage && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'truth');
        router.replace(url.pathname + '?' + url.searchParams.toString());
        dispatchTab('truth');
        return;
      }

      if (onCityPage && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'supply');
        router.replace(url.pathname + '?' + url.searchParams.toString());
        dispatchTab('supply');
        return;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCityPage, router]);

  // Lock scroll for mobile menu only
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Click outside closes mega
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

  // Data
  const cityList = useMemo<CityLite[]>(() => (CITIES as any) ?? [], []);
  const countries = useMemo(() => {
    const preferred = [
      'Spain',
      'United Arab Emirates',
      'United States',
      'United Kingdom',
      'France',
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

    return countries.slice(0, 6).map((c) => `${c}`);
  }, [cityList, countries]);

  function countryHref(country: string) {
    return `/coming-soon?country=${encodeURIComponent(country)}`;
  }

  // Hover intent helpers
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

  // Styling tokens
  const barBg = scrolled ? 'bg-[#07080B]/92' : 'bg-[#07080B]/72';
  const goldText =
    'bg-clip-text text-transparent bg-gradient-to-b from-[#F7E7B8] via-[#E7C982] to-[#B8893B]';
  const softBorder = 'ring-1 ring-inset ring-white/10';
  const softFill = 'bg-white/[0.03] hover:bg-white/[0.05]';

  // Consistent one-line nav items (fixes baseline drift + wrapping)
  const navItemBase =
    'inline-flex h-10 items-center gap-2 whitespace-nowrap leading-none text-[13px] uppercase tracking-[0.20em] text-zinc-200/75 hover:text-zinc-50 transition';

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className={cx('relative w-full backdrop-blur-[18px]', barBg)}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1000px_220px_at_50%_0%,rgba(231,201,130,0.12),transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/6" />
        </div>

        // src/components/layout/TopBar.tsx

<Link href="/" prefetch aria-label="Vantera home" className="relative flex shrink-0 items-center">
  {/* subtle “flash” behind the mark */}
  <span
    aria-hidden
    className="pointer-events-none absolute -left-6 -top-7 h-28 w-28 rounded-full
               bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.22),transparent_60%)]
               blur-md"
  />

  <Image
    src="/brand/vantera-logo-dark-transparent.svg"
    alt="Vantera"
    width={620}
    height={180}
    priority={false}
    className="relative h-[72px] w-auto drop-shadow-[0_30px_120px_rgba(0,0,0,0.70)] sm:h-[78px] md:h-[86px]"
  />
</Link>


          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-10">
              {/* Destinations */}
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
                  className={cx(navItemBase, megaOpen && 'text-zinc-50')}
                  aria-expanded={megaOpen}
                  aria-haspopup="menu"
                >
                  <Globe className="h-4 w-4 opacity-75" />
                  <span>Destinations</span>
                  <ChevronDown className={cx('h-4 w-4 transition', megaOpen && 'rotate-180')} />
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
                    'absolute left-1/2 z-[80] mt-5 w-[1120px] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 origin-top',
                    'rounded-[28px] bg-[#05060A]',
                    'shadow-[0_90px_240px_rgba(0,0,0,0.92)]',
                    'ring-1 ring-inset ring-white/12',
                    'overflow-hidden',
                    'transition-[transform,opacity] duration-200',
                    megaOpen
                      ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                      : 'pointer-events-none -translate-y-1 scale-[0.99] opacity-0',
                  )}
                  role="menu"
                  aria-label="Destinations menu"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_280px_at_50%_0%,rgba(231,201,130,0.13),transparent_60%)]" />

                  <div className="relative flex items-center justify-between gap-4 border-b border-white/10 px-7 py-5">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold tracking-[0.30em] text-zinc-200/80 uppercase">
                        Explore by country
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {countries.map((c) => (
                          <Link
                            key={c}
                            href={countryHref(c)}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className="rounded-full bg-white/[0.03] px-3.5 py-1.5 text-[12px] text-zinc-100/90 ring-1 ring-inset ring-white/10 hover:bg-white/[0.06] hover:ring-white/14 transition"
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
                        'inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[12px] text-zinc-200/90 transition',
                        softFill,
                        softBorder,
                      )}
                    >
                      <X className="h-4 w-4 opacity-80" />
                      Close
                    </button>
                  </div>

                  <div className="relative grid grid-cols-12 gap-7 px-7 py-7">
                    <div className="col-span-3">
                      <div className="mb-3 text-[11px] font-semibold tracking-[0.28em] uppercase text-zinc-200/70">
                        Regions
                      </div>
                      <div className="grid gap-2">
                        {topRegions.map((r) => (
                          <Link
                            key={r}
                            href={`/coming-soon?region=${encodeURIComponent(r)}`}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className="rounded-2xl bg-white/[0.02] px-3.5 py-3 text-sm text-zinc-200/90 ring-1 ring-inset ring-white/10 hover:bg-white/[0.05] hover:ring-white/14 hover:text-white transition"
                            role="menuitem"
                          >
                            {r}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-5">
                      <div className="mb-3 text-[11px] font-semibold tracking-[0.28em] uppercase text-zinc-200/70">
                        Cities
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {topCities.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/city/${c.slug}`}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className="group rounded-2xl bg-white/[0.02] ring-1 ring-inset ring-white/10 hover:bg-white/[0.05] hover:ring-white/14 transition px-3.5 py-3"
                            role="menuitem"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-zinc-100/90 group-hover:text-white">
                                  {c.name}
                                </div>
                                <div className="truncate text-[11px] text-zinc-400">{c.country}</div>
                              </div>
                              <ArrowRight className="h-4 w-4 opacity-55 transition group-hover:translate-x-0.5 group-hover:opacity-85" />
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/[0.02] ring-1 ring-inset ring-white/10 px-4 py-3">
                        <div className="text-xs text-zinc-400">Curated entry points, expanding.</div>
                        <Link
                          href="/"
                          prefetch
                          onClick={() => setMegaOpen(false)}
                          className="inline-flex items-center gap-2 text-xs text-zinc-200/85 hover:text-white transition"
                        >
                          View all <ArrowRight className="h-4 w-4 opacity-70" />
                        </Link>
                      </div>
                    </div>

                    {/* Explore / Private sellers inside mega */}
                    <div className="col-span-4">
                      <div className="grid gap-3">
                        <div className="overflow-hidden rounded-[22px] bg-white/[0.02] ring-1 ring-inset ring-white/10">
                          <div className="border-b border-white/10 px-4 py-3">
                            <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-zinc-200/70">
                              Explore
                            </div>
                            <div className="mt-1 text-xs text-zinc-400">
                              Browse homes, then open their intelligence.
                            </div>
                          </div>
                          <div className="grid gap-2 p-4">
                            <button
                              type="button"
                              onClick={() => {
                                setMegaOpen(false);
                                if (pathname !== '/') {
                                  router.push('/');
                                  window.setTimeout(() => focusGlobalSearch(), 350);
                                  return;
                                }
                                focusGlobalSearch();
                              }}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-100/90 transition',
                                softFill,
                                softBorder,
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Command className="h-4 w-4 opacity-85" />
                                Search homes
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-75" />
                            </button>

                            <Link
                              href="/coming-soon?section=for-sale"
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className="inline-flex w-full items-center justify-between rounded-2xl bg-white/[0.02] px-4 py-3 text-sm text-zinc-200/90 ring-1 ring-inset ring-white/10 hover:bg-white/[0.05] hover:ring-white/14 transition"
                            >
                              <span className="inline-flex items-center gap-2">
                                <MapPin className="h-4 w-4 opacity-80" />
                                Browse for sale
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-75" />
                            </Link>
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-[22px] bg-white/[0.02] ring-1 ring-inset ring-white/10">
                          <div className="border-b border-white/10 px-4 py-3">
                            <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-zinc-200/70">
                              Private sellers
                            </div>
                            <div className="mt-1 text-xs text-zinc-400">
                              One listing at a time. Pay by card. Direct enquiries.
                            </div>
                          </div>
                          <div className="p-4">
                            <Link
                              href="/coming-soon?flow=sell"
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className="inline-flex w-full items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3 text-sm font-semibold ring-1 ring-inset ring-white/12 hover:bg-white/[0.06] hover:ring-white/16 transition"
                            >
                              <span className={goldText}>List your home</span>
                              <ArrowRight className="h-4 w-4 opacity-85 text-zinc-100" />
                            </Link>

                            <div className="mt-2 text-[11px] text-zinc-500">No middle layer. Direct enquiries.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explore (desktop nav) */}
              <button
                type="button"
                onClick={() => {
                  if (pathname !== '/') {
                    router.push('/');
                    window.setTimeout(() => focusGlobalSearch(), 350);
                    return;
                  }
                  focusGlobalSearch();
                }}
                className={navItemBase}
              >
                <span>Explore</span>
              </button>

              <Link href="/coming-soon?flow=sell" prefetch className={navItemBase}>
                <span>Sell</span>
              </Link>
            </div>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={() => {
                  if (pathname !== '/') {
                    router.push('/');
                    window.setTimeout(() => focusGlobalSearch(), 350);
                    return;
                  }
                  focusGlobalSearch();
                }}
                className={cx(
                  'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm text-zinc-200/90 transition',
                  softFill,
                  softBorder,
                )}
                aria-label="Search"
              >
                <Command className="h-4 w-4 opacity-80" />
                <span>Search</span>
                <span className="text-white/15">·</span>
                <span className="font-mono text-xs text-zinc-200">/</span>
              </button>

              <Link
                href="/coming-soon?flow=sell"
                prefetch
                className={cx(
                  'inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition',
                  'bg-white/[0.03] ring-1 ring-inset ring-white/12 hover:bg-white/[0.06] hover:ring-white/16',
                  'shadow-[0_30px_140px_rgba(0,0,0,0.55)]',
                )}
                aria-label="List your home"
              >
                <span className={goldText}>List your home</span>
                <ArrowRight className="h-4 w-4 opacity-85 text-zinc-100" />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={cx(
                'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm text-zinc-200/90 transition lg:hidden',
                softFill,
                softBorder,
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
        className={cx(
          'fixed inset-0 z-[70] lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className={cx(
            'absolute inset-0 bg-black/70 transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
        />

        <div
          className={cx(
            'absolute right-0 top-0 h-full w-[92vw] max-w-[420px]',
            'bg-[#05060A] ring-1 ring-inset ring-white/12',
            'shadow-[-30px_0_120px_rgba(0,0,0,0.85)]',
            'transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_280px_at_30%_0%,rgba(231,201,130,0.12),transparent_60%)]" />

          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-zinc-200/70">Vantera</div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={cx(
                'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] text-zinc-200/90 transition',
                softFill,
                softBorder,
              )}
            >
              <X className="h-4 w-4 opacity-80" />
              Close
            </button>
          </div>

          <div className="relative space-y-4 px-5 py-5">
            {/* Explore */}
            <div className="overflow-hidden rounded-[22px] bg-white/[0.02] ring-1 ring-inset ring-white/10">
              <div className="border-b border-white/10 px-4 py-3">
                <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-zinc-200/70">Explore</div>
                <div className="mt-1 text-xs text-zinc-400">Browse homes, then open intelligence.</div>
              </div>
              <div className="grid gap-2 p-4">
                <button
                  type="button"
                  onClick={() => {
                    if (pathname !== '/') {
                      router.push('/');
                      window.setTimeout(() => focusGlobalSearch(), 350);
                    } else {
                      focusGlobalSearch();
                    }
                    setMobileOpen(false);
                  }}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-100/90 transition',
                    softFill,
                    softBorder,
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Command className="h-4 w-4 opacity-85" />
                    Search homes
                    <span className="ml-2 font-mono text-xs text-zinc-200/75">/</span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-75" />
                </button>

                <Link
                  href="/coming-soon?section=for-sale"
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-full items-center justify-between rounded-2xl bg-white/[0.02] px-4 py-3 text-sm text-zinc-200/90 ring-1 ring-inset ring-white/10 hover:bg-white/[0.05] hover:ring-white/14 transition"
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 opacity-80" />
                    Browse for sale
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-75" />
                </Link>
              </div>
            </div>

            {/* Private sellers */}
            <div className="overflow-hidden rounded-[22px] bg-white/[0.02] ring-1 ring-inset ring-white/10">
              <div className="border-b border-white/10 px-4 py-3">
                <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-zinc-200/70">
                  Private sellers
                </div>
                <div className="mt-1 text-xs text-zinc-400">One listing at a time. Pay by card. Direct enquiries.</div>
              </div>
              <div className="p-4">
                <Link
                  href="/coming-soon?flow=sell"
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-full items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3 text-sm font-semibold ring-1 ring-inset ring-white/12 hover:bg-white/[0.06] hover:ring-white/16 transition"
                >
                  <span className={goldText}>List your home</span>
                  <ArrowRight className="h-4 w-4 opacity-85 text-zinc-100" />
                </Link>

                <div className="mt-2 text-[11px] text-zinc-500">Direct enquiries. No middle layer.</div>
              </div>
            </div>

            {/* Destinations */}
            <div className="overflow-hidden rounded-[22px] bg-white/[0.02] ring-1 ring-inset ring-white/10">
              <div className="border-b border-white/10 px-4 py-3">
                <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-zinc-200/70">
                  Destinations
                </div>
                <div className="mt-1 text-xs text-zinc-400">Countries and top cities.</div>
              </div>

              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {countries.map((c) => (
                    <Link
                      key={c}
                      href={countryHref(c)}
                      prefetch
                      onClick={() => setMobileOpen(false)}
                      className="rounded-full bg-white/[0.03] px-3 py-1.5 text-[12px] text-zinc-100/90 ring-1 ring-inset ring-white/10 hover:bg-white/[0.06] hover:ring-white/14 transition"
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
                      className="rounded-2xl bg-white/[0.02] px-3.5 py-3 ring-1 ring-inset ring-white/10 hover:bg-white/[0.05] hover:ring-white/14 transition"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-zinc-100/90">{c.name}</div>
                          <div className="truncate text-[11px] text-zinc-400">{c.country}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 opacity-70" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {onCityPage ? (
              <div className="overflow-hidden rounded-[22px] bg-white/[0.02] ring-1 ring-inset ring-white/10">
                <div className="border-b border-white/10 px-4 py-3">
                  <div className="text-[11px] font-semibold tracking-[0.30em] uppercase text-zinc-200/70">City mode</div>
                  <div className="mt-1 text-xs text-zinc-400">Switch view (T or L).</div>
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
                        ? 'bg-white/[0.06] text-white ring-white/14'
                        : 'bg-white/[0.02] text-zinc-300 ring-white/10 hover:bg-white/[0.05] hover:ring-white/14',
                    )}
                  >
                    Insight <span className="ml-1 font-mono text-[11px] opacity-80">T</span>
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
                        ? 'bg-white/[0.06] text-white ring-white/14'
                        : 'bg-white/[0.02] text-zinc-300 ring-white/10 hover:bg-white/[0.05] hover:ring-white/14',
                    )}
                  >
                    Live supply <span className="ml-1 font-mono text-[11px] opacity-80">L</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="pt-2 text-[11px] text-zinc-500">
              Vantera is built for buyers, private sellers and advisors. Signal over noise.
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
