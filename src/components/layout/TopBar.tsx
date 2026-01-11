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
  Radar,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

import { CITIES } from '@/components/home/cities';

function isEditableTarget(el: Element | null) {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
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
  const [citiesOpen, setCitiesOpen] = useState(false);

  const citiesWrapRef = useRef<HTMLDivElement>(null);
  const citiesPanelRef = useRef<HTMLDivElement>(null);

  // Hover intent timers (noticeably improves "JE" feel)
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
    setCitiesOpen(false);
  }, [pathname]);

  // Escape + city shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Element | null;
      if (isEditableTarget(target)) return;

      if (e.key === 'Escape') {
        setMobileOpen(false);
        setCitiesOpen(false);
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

  // Lock scroll ONLY for mobile menu (do not lock for mega menu)
  useEffect(() => {
    if (!mobileOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Robust click outside (only when mega is open)
  useEffect(() => {
    if (!citiesOpen) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node | null;
      if (!t) return;

      const wrap = citiesWrapRef.current;
      const panel = citiesPanelRef.current;

      if (wrap && wrap.contains(t)) return;
      if (panel && panel.contains(t)) return;

      setCitiesOpen(false);
    };

    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('touchstart', onDown, { passive: true });
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('touchstart', onDown);
    };
  }, [citiesOpen]);

  // --- Mega menu data ---
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

  const topCities = useMemo(() => cityList.slice(0, 12), [cityList]);

  const topRegions = useMemo(() => {
    const raw = cityList
      .map((c) => (c.region ? String(c.region) : ''))
      .filter(Boolean);

    const uniq = uniqBy(raw, (r) => r.toLowerCase()).slice(0, 7);
    if (uniq.length > 0) return uniq;

    return countries.slice(0, 7).map((c) => `${c}`);
  }, [cityList, countries]);

  const propertyTypes = useMemo(
    () => [
      { label: 'Luxury villas', href: '/coming-soon?type=villas' },
      { label: 'New developments', href: '/coming-soon?type=new-dev' },
      { label: 'Off-market', href: '/coming-soon?type=off-market' },
      { label: 'Penthouses', href: '/coming-soon?type=penthouses' },
      { label: 'Waterfront', href: '/coming-soon?type=waterfront' },
      { label: 'Branded residences', href: '/coming-soon?type=branded' },
    ],
    [],
  );

  const topSearches = useMemo(
    () => [
      { label: 'Sea view homes', href: '/coming-soon?q=sea%20view' },
      { label: 'Gated communities', href: '/coming-soon?q=gated%20community' },
      { label: 'Walk to beach', href: '/coming-soon?q=walk%20to%20beach' },
      { label: 'Golf frontline', href: '/coming-soon?q=golf%20frontline' },
      { label: 'Investment signal', href: '/coming-soon?q=investment%20signal' },
      { label: 'New build', href: '/coming-soon?q=new%20build' },
    ],
    [],
  );

  function countryHref(country: string) {
    return `/coming-soon?country=${encodeURIComponent(country)}`;
  }

  // ---- Styling (JE-like, calmer borders, solid bar) ----
  const barBg = scrolled ? 'bg-[#07080B]/96' : 'bg-[#07080B]/88';
  const barBorder = 'border-b border-white/5';

  const navLink =
    'inline-flex items-center gap-2 px-2 py-2 text-[15px] font-medium text-zinc-200/85 hover:text-white transition';
  const navLinkActive = 'text-white';

  const pill =
    'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm text-zinc-200/90 bg-white/[0.03] hover:bg-white/[0.05] ring-1 ring-inset ring-white/8 hover:ring-white/10 transition';

  const goldText =
    'bg-clip-text text-transparent bg-gradient-to-b from-[#F7E7B8] via-[#E7C982] to-[#B8893B]';

  // ---- Hover open/close (this is the part you are missing right now) ----
  function cancelTimers() {
    if (openT.current) window.clearTimeout(openT.current);
    if (closeT.current) window.clearTimeout(closeT.current);
    openT.current = null;
    closeT.current = null;
  }

  function openCitiesSoon() {
    cancelTimers();
    openT.current = window.setTimeout(() => setCitiesOpen(true), 60);
  }

  function closeCitiesSoon() {
    cancelTimers();
    closeT.current = window.setTimeout(() => setCitiesOpen(false), 140);
  }

  function toggleCities() {
    cancelTimers();
    setCitiesOpen((v) => !v);
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className={cx('relative w-full backdrop-blur-[16px]', barBg, barBorder)}>
        {/* subtle ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/18 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_220px_at_50%_0%,rgba(231,201,130,0.10),transparent_62%)]" />
        </div>

        {/* Taller bar so logo can be bigger */}
        <div className="relative mx-auto flex w-full max-w-7xl items-center gap-4 px-5 py-6 sm:px-8 sm:py-7">
          {/* Left: Bigger logo, no box */}
          <Link href="/" prefetch aria-label="Vantera home" className="flex items-center shrink-0">
            <Image
              src="/brand/vantera-logo-dark.png"
              alt="Vantera"
              width={420}
              height={96}
              priority={false}
              className="h-16 w-auto sm:h-18 md:h-20 drop-shadow-[0_22px_90px_rgba(0,0,0,0.70)]"
            />
          </Link>

          {/* Center: one-line menu */}
          <nav
            className={cx(
              'hidden lg:flex items-center gap-6',
              'flex-1 min-w-0',
              'whitespace-nowrap',
              'overflow-hidden',
            )}
            aria-label="Primary"
          >
            {/* Destinations (hover + click) */}
            <div
              className="relative shrink-0"
              ref={citiesWrapRef}
              onMouseEnter={openCitiesSoon}
              onMouseLeave={closeCitiesSoon}
            >
              <button
                type="button"
                onClick={toggleCities}
                onFocus={() => setCitiesOpen(true)}
                className={cx(navLink, citiesOpen && navLinkActive)}
                aria-expanded={citiesOpen}
                aria-haspopup="menu"
              >
                <Globe className="h-4 w-4 opacity-85" />
                Destinations
                <ChevronDown className={cx('h-4 w-4 transition', citiesOpen && 'rotate-180')} />
              </button>

              {/* Mega panel */}
              <div
                ref={citiesPanelRef}
                // Keep open when cursor moves into panel
                onMouseEnter={() => {
                  cancelTimers();
                  setCitiesOpen(true);
                }}
                onMouseLeave={closeCitiesSoon}
                className={cx(
                  'absolute left-1/2 z-[80] mt-4 w-[1120px] max-w-[calc(100vw-2rem)] -translate-x-1/2 origin-top',
                  'rounded-[26px] bg-[#05060A]',
                  'shadow-[0_70px_220px_rgba(0,0,0,0.90)]',
                  'ring-1 ring-inset ring-white/10',
                  'max-h-[74vh] overflow-auto',
                  'transition-[transform,opacity] duration-200',
                  citiesOpen
                    ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                    : 'pointer-events-none -translate-y-1 scale-[0.99] opacity-0',
                )}
                role="menu"
                aria-label="Destinations menu"
              >
                <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-[radial-gradient(900px_260px_at_50%_0%,rgba(231,201,130,0.12),transparent_62%)]" />

                {/* Header */}
                <div className="relative border-b border-white/8 px-6 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-200/85">
                      Explore by country
                    </div>

                    <button
                      type="button"
                      onClick={() => setCitiesOpen(false)}
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] bg-white/[0.03] text-zinc-200/90 ring-1 ring-inset ring-white/10 hover:bg-white/[0.05] hover:ring-white/12 transition"
                    >
                      <X className="h-4 w-4 opacity-80" />
                      Close
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {countries.map((c) => (
                      <Link
                        key={c}
                        href={countryHref(c)}
                        prefetch
                        onClick={() => setCitiesOpen(false)}
                        className="rounded-full px-3.5 py-1.5 text-[12px] text-zinc-200/95 bg-white/[0.03] ring-1 ring-inset ring-white/10 hover:bg-white/[0.05] hover:ring-white/12 hover:text-white transition"
                        role="menuitem"
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Columns */}
                <div className="relative grid grid-cols-12 gap-6 px-6 py-6">
                  <div className="col-span-3">
                    <div className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-200/80">
                      Top regions
                    </div>
                    <div className="grid gap-2">
                      {topRegions.map((r) => (
                        <Link
                          key={r}
                          href={`/coming-soon?region=${encodeURIComponent(r)}`}
                          prefetch
                          onClick={() => setCitiesOpen(false)}
                          className="rounded-2xl px-3 py-2.5 text-sm text-zinc-200/90 bg-white/[0.02] ring-1 ring-inset ring-white/8 hover:bg-white/[0.04] hover:ring-white/10 hover:text-white transition"
                          role="menuitem"
                        >
                          {r}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-4">
                    <div className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-200/80">
                      Top cities
                    </div>
                    <div className="grid gap-2">
                      {topCities.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/city/${c.slug}`}
                          prefetch
                          onClick={() => setCitiesOpen(false)}
                          className="group rounded-2xl px-3 py-2.5 bg-white/[0.02] ring-1 ring-inset ring-white/8 hover:bg-white/[0.04] hover:ring-white/10 transition"
                          role="menuitem"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-zinc-100/90 group-hover:text-white">
                                {c.name}
                              </div>
                              <div className="truncate text-[11px] text-zinc-400">{c.country}</div>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-85" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-200/80">
                      For sale
                    </div>
                    <div className="grid gap-2">
                      {propertyTypes.map((t) => (
                        <Link
                          key={t.href}
                          href={t.href}
                          prefetch
                          onClick={() => setCitiesOpen(false)}
                          className="rounded-2xl px-3 py-2.5 text-sm text-zinc-200/90 bg-white/[0.02] ring-1 ring-inset ring-white/8 hover:bg-white/[0.04] hover:ring-white/10 hover:text-white transition"
                          role="menuitem"
                        >
                          {t.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-3">
                    <div className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-200/80">
                      Market intel
                    </div>
                    <div className="grid gap-2">
                      {topSearches.map((t) => (
                        <Link
                          key={t.href}
                          href={t.href}
                          prefetch
                          onClick={() => setCitiesOpen(false)}
                          className="rounded-2xl px-3 py-2.5 text-sm text-zinc-200/90 bg-white/[0.02] ring-1 ring-inset ring-white/8 hover:bg-white/[0.04] hover:ring-white/10 hover:text-white transition"
                          role="menuitem"
                        >
                          {t.label}
                        </Link>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/10">
                      <div className={cx('text-xs font-semibold tracking-[0.18em] uppercase', goldText)}>
                        Quick search
                      </div>
                      <div className="mt-1 text-xs text-zinc-400">Press / anywhere to jump into search</div>

                      <button
                        type="button"
                        onClick={() => {
                          setCitiesOpen(false);
                          if (pathname !== '/') {
                            router.push('/');
                            window.setTimeout(() => focusGlobalSearch(), 350);
                            return;
                          }
                          focusGlobalSearch();
                        }}
                        className="mt-3 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200 bg-white/[0.03] ring-1 ring-inset ring-white/10 hover:bg-white/[0.05] hover:ring-white/12 transition"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Command className="h-4 w-4 opacity-90" />
                          Search
                          <span className="ml-2 rounded-md px-2 py-0.5 font-mono text-[11px] text-zinc-200 ring-1 ring-inset ring-white/10 bg-white/[0.02]">
                            /
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 opacity-70" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none relative h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

                <div className="relative flex items-center justify-between gap-3 px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Sparkles className="h-4 w-4 opacity-70" />
                    Coverage expands city by city
                  </div>

                  <Link
                    href="/"
                    prefetch
                    onClick={() => setCitiesOpen(false)}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-zinc-100/90 bg-white/[0.03] ring-1 ring-inset ring-white/10 hover:bg-white/[0.05] hover:ring-white/12 hover:text-white transition"
                  >
                    View all cities <ArrowRight className="h-4 w-4 opacity-80" />
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/coming-soon?section=for-sale" prefetch className={navLink}>
              For sale
            </Link>

            <Link href="/coming-soon?section=new-developments" prefetch className={navLink}>
              New developments
            </Link>

            <Link href="/coming-soon?section=off-market" prefetch className={navLink}>
              Off-market
            </Link>

            <Link href="/coming-soon?section=market-intel" prefetch className={navLink}>
              Market intel
            </Link>
          </nav>

          {/* Right */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
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
              className={cx(pill, 'hidden sm:inline-flex')}
              aria-label="Search"
            >
              <Command className="h-4 w-4 opacity-85" />
              <span>Search</span>
              <span className="text-white/15">•</span>
              <span className="font-mono text-xs text-zinc-200">/</span>
            </button>

            <Link
              href="/"
              prefetch
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  focusGlobalSearch();
                }
              }}
              className={cx(
                'hidden sm:inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold',
                'bg-white/[0.03] ring-1 ring-inset ring-white/10 hover:bg-white/[0.05] hover:ring-white/12 transition',
                'shadow-[0_22px_90px_rgba(0,0,0,0.55)]',
              )}
              aria-label="Search homes"
            >
              <span className={cx('tracking-[0.06em]', goldText)}>Search homes</span>
              <ArrowRight className="ml-2 h-4 w-4 opacity-85" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={cx(pill, 'lg:hidden')}
              aria-expanded={mobileOpen}
              aria-controls="vantera-mobile-menu"
            >
              Menu
              <ChevronDown className={cx('h-4 w-4 transition', mobileOpen && 'rotate-180')} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        id="vantera-mobile-menu"
        className={cx(
          'lg:hidden',
          'overflow-hidden transition-[max-height,opacity] duration-300',
          mobileOpen ? 'max-h-[720px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="mx-auto max-w-7xl px-5 pb-5 sm:px-8">
          <div className="rounded-3xl bg-[#05060A] p-3 shadow-[0_40px_140px_rgba(0,0,0,0.88)] ring-1 ring-inset ring-white/10">
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => {
                  focusGlobalSearch();
                  setMobileOpen(false);
                }}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200 bg-white/[0.02] ring-1 ring-inset ring-white/10 hover:bg-white/[0.04] hover:ring-white/12 transition"
              >
                <span className="inline-flex items-center gap-2">
                  <Command className="h-4 w-4 opacity-90" />
                  Search
                  <span className="ml-2 rounded-md px-2 py-0.5 font-mono text-[11px] text-zinc-200 ring-1 ring-inset ring-white/10 bg-white/[0.02]">
                    /
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCitiesOpen(true);
                  setMobileOpen(false);
                }}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200 bg-white/[0.02] ring-1 ring-inset ring-white/10 hover:bg-white/[0.04] hover:ring-white/12 transition"
              >
                <span className="inline-flex items-center gap-2">
                  <Globe className="h-4 w-4 opacity-90" />
                  Destinations
                </span>
                <ChevronDown className="h-4 w-4 opacity-80" />
              </button>

              <Link
                href="/coming-soon?section=for-sale"
                prefetch
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200 bg-white/[0.02] ring-1 ring-inset ring-white/10 hover:bg-white/[0.04] hover:ring-white/12 transition"
              >
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 opacity-90" />
                  For sale
                </span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </Link>

              <Link
                href="/coming-soon?section=new-developments"
                prefetch
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200 bg-white/[0.02] ring-1 ring-inset ring-white/10 hover:bg-white/[0.04] hover:ring-white/12 transition"
              >
                <span className="inline-flex items-center gap-2">
                  <Radar className="h-4 w-4 opacity-90" />
                  New developments
                </span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </Link>

              <Link
                href="/coming-soon?section=off-market"
                prefetch
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200 bg-white/[0.02] ring-1 ring-inset ring-white/10 hover:bg-white/[0.04] hover:ring-white/12 transition"
              >
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 opacity-90" />
                  Off-market
                </span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </Link>

              <Link
                href="/coming-soon?section=market-intel"
                prefetch
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200 bg-white/[0.02] ring-1 ring-inset ring-white/10 hover:bg-white/[0.04] hover:ring-white/12 transition"
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 opacity-90" />
                  Market intel
                </span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </Link>

              {/* City page mode pills */}
              {onCityPage ? (
                <div className="mt-2 rounded-3xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/10">
                  <div className="mb-2 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-200/80">
                    City mode
                  </div>
                  <div className="flex items-center gap-2">
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
                          ? 'bg-white/[0.06] text-white ring-white/12'
                          : 'bg-white/[0.02] text-zinc-300 ring-white/8 hover:bg-white/[0.04] hover:ring-white/10',
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
                          ? 'bg-white/[0.06] text-white ring-white/12'
                          : 'bg-white/[0.02] text-zinc-300 ring-white/8 hover:bg-white/[0.04] hover:ring-white/10',
                      )}
                    >
                      Live supply <span className="ml-1 font-mono text-[11px] opacity-80">L</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="pointer-events-none mt-3 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>
      </div>
    </header>
  );
}
