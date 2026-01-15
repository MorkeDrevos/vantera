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
  MapPin,
  ShieldCheck,
  Users,
  Building2,
  BookOpen,
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
 * - CitySearch listens to this event and will open + focus itself.
 * - Avoid direct DOM focusing from the TopBar (more robust across layouts).
 */
function dispatchFocusSearch() {
  window.dispatchEvent(new CustomEvent('vantera:focus-search'));
  window.dispatchEvent(new CustomEvent('locus:focus-search')); // legacy bridge
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

function dispatchTab(tab: 'truth' | 'supply') {
  window.dispatchEvent(new CustomEvent('vantera:tab', { detail: { tab } }));
  window.dispatchEvent(new CustomEvent('locus:tab', { detail: { tab } })); // legacy bridge
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

  function openSearchFromAnywhere() {
    if (pathname !== '/') {
      router.push('/');
      window.setTimeout(() => dispatchFocusSearch(), 350);
      return;
    }
    dispatchFocusSearch();
  }

  // Public top bar: JamesEdition-leaning (grand entrance)
  const barBg = scrolled ? 'bg-[#06070A]/88' : 'bg-[#06070A]/62';

  // Softer champagne gold, quiet and expensive
  const goldText =
    'bg-clip-text text-transparent bg-gradient-to-b from-[#F7E7BF] via-[#E6C980] to-[#B7863A]';

  const softBorder = 'ring-1 ring-inset ring-white/10';
  const softFill = 'bg-white/[0.028] hover:bg-white/[0.055]';
  const softFillStrong = 'bg-white/[0.038] hover:bg-white/[0.075]';

  const navItemBase =
    'inline-flex h-10 items-center gap-2 whitespace-nowrap leading-none text-[12px] tracking-[0.12em] text-zinc-200/70 hover:text-zinc-50 transition';

  const navDot = <span className="text-white/10">·</span>;

  // Copy
  const sellLabel = 'Submit an asset';
  const sellHref = '/coming-soon?flow=sell';

  const agentHref = '/coming-soon?flow=agents';
  const sellersHref = '/coming-soon?flow=private-sellers';
  const intelligenceHref = '/coming-soon?section=intelligence';
  const journalHref = '/coming-soon?section=journal';
  const aboutHref = '/coming-soon?section=about';

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className={cx('relative w-full backdrop-blur-[18px]', barBg)}>
        {/* Gold hairline + glass */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E6C980]/22 to-transparent" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1100px_260px_at_50%_0%,rgba(230,201,128,0.10),transparent_62%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/6" />
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl items-center px-4 py-3 sm:px-7 sm:py-3.5">
          {/* Brand */}
          <Link href="/" prefetch aria-label="Vantera home" className="flex shrink-0 items-center">
            <Image
              src="/brand/vantera-logo-dark.svg"
              alt="Vantera"
              width={620}
              height={180}
              priority={false}
              className={cx(
                // Keep compact even before your SVG update
                'h-[40px] w-auto',
                'drop-shadow-[0_28px_120px_rgba(0,0,0,0.72)]',
                'sm:h-[42px] md:h-[44px]',
              )}
            />
          </Link>

          {/* Desktop nav - richer, still restrained */}
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div className="flex items-center gap-8">
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
                  className={cx(navItemBase, megaOpen && 'text-zinc-50')}
                  aria-expanded={megaOpen}
                  aria-haspopup="menu"
                >
                  <Globe className="h-4 w-4 opacity-75" />
                  <span>Places</span>
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
                    'absolute left-1/2 z-[80] mt-4 w-[1120px] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 origin-top',
                    'rounded-[28px] bg-[#04050A]',
                    'shadow-[0_90px_240px_rgba(0,0,0,0.92)]',
                    'ring-1 ring-inset ring-white/12',
                    'overflow-hidden',
                    'transition-[transform,opacity] duration-200',
                    megaOpen
                      ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                      : 'pointer-events-none -translate-y-1 scale-[0.99] opacity-0',
                  )}
                  role="menu"
                  aria-label="Places menu"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_280px_at_50%_0%,rgba(230,201,128,0.12),transparent_60%)]" />

                  <div className="relative flex items-center justify-between gap-4 border-b border-white/10 px-7 py-5">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold tracking-[0.28em] text-zinc-200/80 uppercase">
                        Pick a country
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {countries.map((c) => (
                          <Link
                            key={c}
                            href={countryHref(c)}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className="rounded-full bg-white/[0.03] px-3.5 py-1.5 text-[12px] text-zinc-100/90 ring-1 ring-inset ring-white/10 hover:bg-white/[0.065] hover:ring-white/14 transition"
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
                    {/* Regions */}
                    <div className="col-span-3">
                      <div className="mb-3 text-[11px] font-semibold tracking-[0.26em] uppercase text-zinc-200/70">
                        Regions
                      </div>
                      <div className="grid gap-2">
                        {topRegions.map((r) => (
                          <Link
                            key={r}
                            href={`/coming-soon?region=${encodeURIComponent(r)}`}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className="rounded-2xl bg-white/[0.028] px-3.5 py-3 text-sm text-zinc-200/90 ring-1 ring-inset ring-white/10 hover:bg-white/[0.065] hover:ring-white/14 hover:text-white transition"
                            role="menuitem"
                          >
                            {r}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Cities */}
                    <div className="col-span-5">
                      <div className="mb-3 text-[11px] font-semibold tracking-[0.26em] uppercase text-zinc-200/70">
                        Cities
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {topCities.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/city/${c.slug}`}
                            prefetch
                            onClick={() => setMegaOpen(false)}
                            className="group rounded-2xl bg-white/[0.028] ring-1 ring-inset ring-white/10 hover:bg-white/[0.065] hover:ring-white/14 transition px-3.5 py-3"
                            role="menuitem"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-zinc-100/90 group-hover:text-white">
                                  {c.name}
                                </div>
                                <div className="truncate text-[11px] text-zinc-400">{c.country}</div>
                              </div>
                              <ArrowRight className="h-4 w-4 opacity-55 transition group-hover:translate-x-0.5 group-hover:opacity-90" />
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/[0.028] ring-1 ring-inset ring-white/10 px-4 py-3">
                        <div className="text-xs text-zinc-400">Entry points only. Intelligence expands weekly.</div>
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

                    {/* Actions */}
                    <div className="col-span-4">
                      <div className="grid gap-3">
                        <div className="overflow-hidden rounded-[22px] bg-white/[0.028] ring-1 ring-inset ring-white/10">
                          <div className="border-b border-white/10 px-4 py-3">
                            <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-zinc-200/70">
                              Intelligence
                            </div>
                            <div className="mt-1 text-xs text-zinc-400">
                              Start with a place. Open the truth surface.
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
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-100/90 transition',
                                softFill,
                                softBorder,
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Command className="h-4 w-4 opacity-85" />
                                Open search
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-75" />
                            </button>

                            <Link
                              href="/coming-soon?section=listings"
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className="inline-flex w-full items-center justify-between rounded-2xl bg-white/[0.028] px-4 py-3 text-sm text-zinc-200/90 ring-1 ring-inset ring-white/10 hover:bg-white/[0.065] hover:ring-white/14 transition"
                            >
                              <span className="inline-flex items-center gap-2">
                                <MapPin className="h-4 w-4 opacity-80" />
                                Listings (coming soon)
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-75" />
                            </Link>
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-[22px] bg-white/[0.028] ring-1 ring-inset ring-white/10">
                          <div className="border-b border-white/10 px-4 py-3">
                            <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-zinc-200/70">
                              Private network
                            </div>
                            <div className="mt-1 text-xs text-zinc-400">
                              Sellers and advisors. Verification-first.
                            </div>
                          </div>
                          <div className="grid gap-2 p-4">
                            <Link
                              href={sellersHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-100/90 transition',
                                softFill,
                                softBorder,
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Building2 className="h-4 w-4 opacity-85" />
                                Private sellers
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-75" />
                            </Link>

                            <Link
                              href={agentHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className="inline-flex w-full items-center justify-between rounded-2xl bg-white/[0.028] px-4 py-3 text-sm text-zinc-200/90 ring-1 ring-inset ring-white/10 hover:bg-white/[0.065] hover:ring-white/14 transition"
                            >
                              <span className="inline-flex items-center gap-2">
                                <Users className="h-4 w-4 opacity-80" />
                                Agents (coming soon)
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-75" />
                            </Link>
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-[22px] bg-white/[0.028] ring-1 ring-inset ring-white/10">
                          <div className="border-b border-white/10 px-4 py-3">
                            <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-zinc-200/70">
                              Submissions
                            </div>
                            <div className="mt-1 text-xs text-zinc-400">
                              Submit a property for verification and private matching.
                            </div>
                          </div>
                          <div className="p-4">
                            <Link
                              href={sellHref}
                              prefetch
                              onClick={() => setMegaOpen(false)}
                              className={cx(
                                'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition',
                                softFillStrong,
                                'ring-1 ring-inset ring-white/12 hover:ring-white/16',
                              )}
                            >
                              <span className={goldText}>{sellLabel}</span>
                              <ArrowRight className="h-4 w-4 opacity-90 text-zinc-100" />
                            </Link>

                            <div className="mt-2 text-[11px] text-zinc-500">Private by default. Signal over noise.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {navDot}

              <Link href={intelligenceHref} prefetch className={navItemBase}>
                <ShieldCheck className="h-4 w-4 opacity-75" />
                <span>Intelligence</span>
              </Link>

              {navDot}

              <Link href={sellersHref} prefetch className={navItemBase}>
                <Building2 className="h-4 w-4 opacity-75" />
                <span>Private sellers</span>
              </Link>

              {navDot}

              <Link href={agentHref} prefetch className={navItemBase}>
                <Users className="h-4 w-4 opacity-75" />
                <span>For agents</span>
              </Link>

              {navDot}

              <Link href={journalHref} prefetch className={navItemBase}>
                <BookOpen className="h-4 w-4 opacity-75" />
                <span>Journal</span>
              </Link>

              {navDot}

              <Link href={aboutHref} prefetch className={navItemBase}>
                <span>About</span>
              </Link>
            </div>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex shrink-0 items-center gap-2.5">
            <div className="hidden items-center gap-2.5 sm:flex">
              <button
                type="button"
                onClick={openSearchFromAnywhere}
                className={cx(
                  'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm text-zinc-200/90 transition',
                  softFill,
                  softBorder,
                )}
                aria-label="Search"
              >
                <Command className="h-4 w-4 opacity-80" />
                <span>Search</span>
                <span className="text-white/12">·</span>
                <span className="font-mono text-xs text-zinc-200">/</span>
              </button>

              <Link
                href={agentHref}
                prefetch
                className={cx(
                  'inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm text-zinc-200/90 transition',
                  'bg-white/[0.018] ring-1 ring-inset ring-white/10 hover:bg-white/[0.045] hover:ring-white/14',
                )}
                aria-label="Agent login"
              >
                <Users className="h-4 w-4 opacity-80" />
                <span>Agent login</span>
              </Link>

              <Link
                href={sellHref}
                prefetch
                className={cx(
                  'inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition',
                  softFillStrong,
                  'ring-1 ring-inset ring-white/12 hover:ring-white/16',
                  'shadow-[0_30px_140px_rgba(0,0,0,0.58)]',
                )}
                aria-label={sellLabel}
              >
                <span className={goldText}>{sellLabel}</span>
                <ArrowRight className="h-4 w-4 opacity-90 text-zinc-100" />
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
        className={cx('fixed inset-0 z-[70] lg:hidden', mobileOpen ? 'pointer-events-auto' : 'pointer-events-none')}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className={cx('absolute inset-0 bg-black/70 transition-opacity', mobileOpen ? 'opacity-100' : 'opacity-0')}
        />

        <div
          className={cx(
            'absolute right-0 top-0 h-full w-[92vw] max-w-[420px]',
            'bg-[#04050A] ring-1 ring-inset ring-white/12',
            'shadow-[-30px_0_120px_rgba(0,0,0,0.85)]',
            'transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_280px_at_30%_0%,rgba(230,201,128,0.12),transparent_60%)]" />

          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-zinc-200/70">Menu</div>
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
            {/* Grand entrance actions */}
            <div className="overflow-hidden rounded-[22px] bg-white/[0.028] ring-1 ring-inset ring-white/10">
              <div className="border-b border-white/10 px-4 py-3">
                <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-zinc-200/70">
                  Start here
                </div>
                <div className="mt-1 text-xs text-zinc-400">Search first. Verification and signal follows.</div>
              </div>
              <div className="grid gap-2 p-4">
                <button
                  type="button"
                  onClick={() => {
                    openSearchFromAnywhere();
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
                    Open search
                    <span className="ml-2 font-mono text-xs text-zinc-200/75">/</span>
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-75" />
                </button>

                <Link
                  href={sellHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    softFillStrong,
                    'ring-1 ring-inset ring-white/12 hover:ring-white/16',
                  )}
                >
                  <span className={goldText}>{sellLabel}</span>
                  <ArrowRight className="h-4 w-4 opacity-90 text-zinc-100" />
                </Link>

                <Link
                  href={agentHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-100/90 transition',
                    softFill,
                    softBorder,
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 opacity-85" />
                    Agent login
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-75" />
                </Link>
              </div>
            </div>

            {/* Public nav */}
            <div className="overflow-hidden rounded-[22px] bg-white/[0.028] ring-1 ring-inset ring-white/10">
              <div className="border-b border-white/10 px-4 py-3">
                <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-zinc-200/70">Navigation</div>
                <div className="mt-1 text-xs text-zinc-400">Public entry points.</div>
              </div>
              <div className="grid gap-2 p-4">
                <Link
                  href={intelligenceHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-100/90 transition',
                    softFill,
                    softBorder,
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 opacity-85" />
                    Intelligence
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-75" />
                </Link>

                <Link
                  href={sellersHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-100/90 transition',
                    softFill,
                    softBorder,
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Building2 className="h-4 w-4 opacity-85" />
                    Private sellers
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-75" />
                </Link>

                <Link
                  href={agentHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-100/90 transition',
                    softFill,
                    softBorder,
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 opacity-85" />
                    For agents
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-75" />
                </Link>

                <Link
                  href={journalHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-100/90 transition',
                    softFill,
                    softBorder,
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <BookOpen className="h-4 w-4 opacity-85" />
                    Journal
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-75" />
                </Link>

                <Link
                  href={aboutHref}
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-100/90 transition',
                    softFill,
                    softBorder,
                  )}
                >
                  <span>About</span>
                  <ArrowRight className="h-4 w-4 opacity-75" />
                </Link>
              </div>
            </div>

            {/* Places */}
            <div className="overflow-hidden rounded-[22px] bg-white/[0.028] ring-1 ring-inset ring-white/10">
              <div className="border-b border-white/10 px-4 py-3">
                <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-zinc-200/70">Places</div>
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
                      className="rounded-full bg-white/[0.038] px-3 py-1.5 text-[12px] text-zinc-100/90 ring-1 ring-inset ring-white/10 hover:bg-white/[0.075] hover:ring-white/14 transition"
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
                      className="rounded-2xl bg-white/[0.028] px-3.5 py-3 ring-1 ring-inset ring-white/10 hover:bg-white/[0.065] hover:ring-white/14 transition"
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

            {/* City page mode switch */}
            {onCityPage ? (
              <div className="overflow-hidden rounded-[22px] bg-white/[0.028] ring-1 ring-inset ring-white/10">
                <div className="border-b border-white/10 px-4 py-3">
                  <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-zinc-200/70">
                    City view
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">Switch: facts (T) or live market (L).</div>
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
                        ? 'bg-white/[0.07] text-white ring-white/14'
                        : 'bg-white/[0.03] text-zinc-300 ring-white/10 hover:bg-white/[0.07] hover:ring-white/14',
                    )}
                  >
                    Facts <span className="ml-1 font-mono text-[11px] opacity-80">T</span>
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
                        ? 'bg-white/[0.07] text-white ring-white/14'
                        : 'bg-white/[0.03] text-zinc-300 ring-white/10 hover:bg-white/[0.07] hover:ring-white/14',
                    )}
                  >
                    Live market <span className="ml-1 font-mono text-[11px] opacity-80">L</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="pt-2 text-[11px] text-zinc-500">Public pages: luxury entrance. Logged-in: Swiss calm.</div>
          </div>
        </div>
      </div>
    </header>
  );
}
