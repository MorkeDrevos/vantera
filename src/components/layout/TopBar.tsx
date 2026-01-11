// src/components/layout/TopBar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronDown, Command, Globe, Sparkles, X } from 'lucide-react';

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

function useClickOutside(
  refs: Array<React.RefObject<HTMLElement>>,
  onOutside: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node | null;
      if (!t) return;

      for (const r of refs) {
        const el = r.current;
        if (el && el.contains(t)) return;
      }

      onOutside();
    };

    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('touchstart', onDown, { passive: true });
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('touchstart', onDown);
    };
  }, [enabled, onOutside, refs]);
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

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
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

  const onCityPage = useMemo(() => pathname?.startsWith('/city/'), [pathname]);

  const activeTab = useMemo(() => {
    const t = (searchParams?.get('tab') ?? '').toLowerCase();
    if (t === 'truth' || t === 'supply') return t;
    return 'truth';
  }, [searchParams]);

  useClickOutside([citiesWrapRef, citiesPanelRef], () => setCitiesOpen(false), citiesOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCitiesOpen(false);
  }, [pathname]);

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

  useEffect(() => {
    const open = citiesOpen || mobileOpen;
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [citiesOpen, mobileOpen]);

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

  const topCities = useMemo(() => cityList.slice(0, 10), [cityList]);

  const topRegions = useMemo(() => {
    const raw = cityList
      .map((c) => (c.region ? String(c.region) : ''))
      .filter(Boolean);

    const uniq = uniqBy(raw, (r) => r.toLowerCase()).slice(0, 6);
    if (uniq.length > 0) return uniq;

    return countries.slice(0, 6).map((c) => `${c}`);
  }, [cityList, countries]);

  // Portal-friendly buckets
  const propertyTypes = useMemo(
    () => [
      { label: 'Villas', href: '/coming-soon?type=villas' },
      { label: 'Penthouses', href: '/coming-soon?type=penthouses' },
      { label: 'Waterfront', href: '/coming-soon?type=waterfront' },
      { label: 'New developments', href: '/coming-soon?type=new-dev' },
      { label: 'Land', href: '/coming-soon?type=land' },
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
      { label: 'Off-market', href: '/coming-soon?q=off%20market' },
      { label: 'New build', href: '/coming-soon?q=new%20build' },
    ],
    [],
  );

  function countryHref(country: string) {
    return `/coming-soon?country=${encodeURIComponent(country)}`;
  }

  // Luxury: less glass, more graphite, fewer borders, gold only as accent
  const barBg = scrolled ? 'bg-[#07080C]/96' : 'bg-[#07080C]/88';
  const barRing = 'ring-1 ring-inset ring-white/[0.04]';
  const hairline = 'via-white/[0.05]';
  const softBorder = 'ring-1 ring-inset ring-white/[0.06]';
  const softerBorder = 'ring-1 ring-inset ring-white/[0.05]';

  const goldText =
    'bg-clip-text text-transparent bg-gradient-to-b from-[#F7E7B8] via-[#E7C982] to-[#B8893B]';

  const linkBase =
    'relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/10';
  const linkIdle =
    'text-zinc-200/85 hover:text-white hover:bg-white/[0.03] ring-1 ring-inset ring-white/0 hover:ring-white/[0.06]';
  const linkActive = 'text-white bg-white/[0.04] ring-1 ring-inset ring-white/[0.07]';

  const actionBtn = cx(
    'relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold',
    'bg-white/[0.03] text-white',
    'ring-1 ring-inset ring-white/[0.06]',
    'shadow-[0_18px_70px_rgba(0,0,0,0.55)]',
    'hover:bg-white/[0.05] hover:ring-white/[0.08]',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/10',
  );

  const chip = cx(
    'rounded-full px-3.5 py-1.5 text-[12px] text-zinc-200/95',
    'bg-white/[0.025] ring-1 ring-inset ring-white/[0.06]',
    'hover:bg-white/[0.045] hover:ring-white/[0.075] hover:text-white transition',
  );

  // Desktop mega width scales slightly with viewport (feels more portal)
  const megaW = useMemo(() => {
    const base = 1120;
    const max = 1240;
    return clamp(base, base, max);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Luxury bar */}
      <div className={cx('relative w-full backdrop-blur-[12px]', barBg, barRing)}>
        {/* Minimal hairlines */}
        <div className={cx('pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent', hairline, 'to-transparent')} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/10 to-transparent" />

        {/* Controlled ambient (no foggy glass) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-[-160px] h-[220px] w-[520px] rounded-full bg-white/[0.035] blur-3xl" />
          <div className="absolute -top-24 right-[-200px] h-[240px] w-[620px] rounded-full bg-violet-400/[0.05] blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_220px_at_50%_0%,rgba(231,201,130,0.06),transparent_60%)]" />
        </div>

        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          {/* Left - Brand (full logo) */}
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              prefetch
              aria-label="Vantera home"
              className={cx(
                'group relative flex shrink-0 items-center',
                'rounded-2xl bg-[#05060A]/85 px-3 py-2',
                'ring-1 ring-inset ring-white/[0.06]',
                'hover:ring-white/[0.08] hover:bg-[#05060A]/92',
              )}
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-80" />
              <Image
                src="/brand/vantera-logo-dark.png"
                alt="Vantera"
                width={220}
                height={54}
                priority={false}
                className={cx(
                  'relative h-9 w-auto opacity-95',
                  'drop-shadow-[0_18px_56px_rgba(0,0,0,0.70)]',
                  'transition group-hover:opacity-100',
                  'sm:h-10',
                )}
              />
            </Link>

            <div className="hidden min-w-0 leading-tight xl:block">
              <div className="flex items-center gap-3">
                <span className={cx('truncate text-[11px] font-semibold tracking-[0.22em] uppercase', goldText)}>
                  Global Property Intelligence
                </span>
                <span className="text-[11px] text-zinc-400">Private index</span>
              </div>
              <div className="truncate text-xs text-zinc-400">
                A quiet intelligence surface for buyers, sellers and advisors
              </div>
            </div>
          </div>

          {/* Center - Portal nav */}
          <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary">
            {/* Destinations (cities mega) */}
            <div className="relative" ref={citiesWrapRef}>
              <button
                type="button"
                onClick={() => setCitiesOpen((v) => !v)}
                className={cx(linkBase, citiesOpen ? linkActive : linkIdle)}
                aria-expanded={citiesOpen}
                aria-haspopup="menu"
              >
                <span className="inline-flex items-center gap-2">
                  <Globe className="h-4 w-4 opacity-85" />
                  Destinations
                  <ChevronDown className={cx('h-4 w-4 transition', citiesOpen && 'rotate-180')} />
                </span>
              </button>

              {/* Mega panel (more solid, portal layout) */}
              <div
                ref={citiesPanelRef}
                className={cx(
                  'absolute left-1/2 z-[70] mt-4 max-w-[calc(100vw-2rem)] -translate-x-1/2 origin-top',
                  'rounded-[30px] bg-[#05060A]',
                  'shadow-[0_60px_220px_rgba(0,0,0,0.92)]',
                  'ring-1 ring-inset ring-white/[0.08]',
                  'max-h-[74vh] overflow-auto',
                  'transition-[transform,opacity] duration-200',
                  citiesOpen
                    ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                    : 'pointer-events-none -translate-y-1 scale-[0.99] opacity-0',
                )}
                style={{ width: megaW }}
                role="menu"
                aria-label="Destinations mega menu"
              >
                {/* Subtle inner wash */}
                <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[radial-gradient(980px_240px_at_50%_0%,rgba(231,201,130,0.08),transparent_60%)]" />

                {/* Header row */}
                <div className="relative flex items-start justify-between gap-6 border-b border-white/[0.06] px-6 py-5">
                  <div className="min-w-0">
                    <div className={cx('text-xs font-semibold tracking-[0.18em] uppercase', goldText)}>
                      Browse destinations
                    </div>
                    <div className="mt-1 text-xs text-zinc-400">
                      Explore by country, then jump into a city intelligence surface
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {countries.map((c) => (
                        <Link
                          key={c}
                          href={countryHref(c)}
                          prefetch
                          onClick={() => setCitiesOpen(false)}
                          className={chip}
                          role="menuitem"
                        >
                          {c}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCitiesOpen(false)}
                    className={cx(
                      'shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px]',
                      'bg-white/[0.03] text-zinc-200/90 ring-1 ring-inset ring-white/[0.07]',
                      'hover:bg-white/[0.05] hover:ring-white/[0.09]',
                    )}
                  >
                    <X className="h-4 w-4 opacity-80" />
                    Close
                  </button>
                </div>

                {/* Columns */}
                <div className="relative grid grid-cols-12 gap-6 px-6 py-6">
                  {/* Regions */}
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
                          className={cx(
                            'rounded-2xl px-3 py-2.5 text-[13px] text-zinc-200/90',
                            'bg-white/[0.02] ring-1 ring-inset ring-white/[0.06]',
                            'hover:bg-white/[0.04] hover:ring-white/[0.08] hover:text-white',
                          )}
                          role="menuitem"
                        >
                          {r}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Cities */}
                  <div className="col-span-4">
                    <div className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-200/80">
                      Featured cities
                    </div>
                    <div className="grid gap-2">
                      {topCities.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/city/${c.slug}`}
                          prefetch
                          onClick={() => setCitiesOpen(false)}
                          className={cx(
                            'group rounded-2xl px-3 py-2.5',
                            'bg-white/[0.02] ring-1 ring-inset ring-white/[0.06]',
                            'hover:bg-white/[0.04] hover:ring-white/[0.08]',
                          )}
                          role="menuitem"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-[13px] font-semibold text-zinc-100/90 group-hover:text-white">
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

                  {/* Property types */}
                  <div className="col-span-2">
                    <div className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-200/80">
                      Property
                    </div>
                    <div className="grid gap-2">
                      {propertyTypes.map((t) => (
                        <Link
                          key={t.href}
                          href={t.href}
                          prefetch
                          onClick={() => setCitiesOpen(false)}
                          className={cx(
                            'rounded-2xl px-3 py-2.5 text-[13px] text-zinc-200/90',
                            'bg-white/[0.02] ring-1 ring-inset ring-white/[0.06]',
                            'hover:bg-white/[0.04] hover:ring-white/[0.08] hover:text-white',
                          )}
                          role="menuitem"
                        >
                          {t.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Searches + quick actions */}
                  <div className="col-span-3">
                    <div className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-200/80">
                      Popular searches
                    </div>
                    <div className="grid gap-2">
                      {topSearches.map((t) => (
                        <Link
                          key={t.href}
                          href={t.href}
                          prefetch
                          onClick={() => setCitiesOpen(false)}
                          className={cx(
                            'rounded-2xl px-3 py-2.5 text-[13px] text-zinc-200/90',
                            'bg-white/[0.02] ring-1 ring-inset ring-white/[0.06]',
                            'hover:bg-white/[0.04] hover:ring-white/[0.08] hover:text-white',
                          )}
                          role="menuitem"
                        >
                          {t.label}
                        </Link>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/[0.07]">
                      <div className={cx('text-xs font-semibold tracking-[0.18em] uppercase', goldText)}>
                        Search
                      </div>
                      <div className="mt-1 text-xs text-zinc-400">Press / anywhere to start</div>

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
                        className={cx(
                          'mt-3 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-[13px] text-zinc-200',
                          'bg-white/[0.03] ring-1 ring-inset ring-white/[0.07]',
                          'hover:bg-white/[0.05] hover:ring-white/[0.09]',
                        )}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Command className="h-4 w-4 opacity-90" />
                          Search homes
                          <span className="ml-2 rounded-md px-2 py-0.5 font-mono text-[11px] text-zinc-200 ring-1 ring-inset ring-white/[0.08] bg-white/[0.02]">
                            /
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 opacity-70" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom strip */}
                <div className="relative flex items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className={cx('inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/[0.03]', softBorder)}>
                      <Sparkles className="h-4 w-4 opacity-85" />
                    </span>
                    Quiet coverage expanding city by city
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/"
                      prefetch
                      onClick={() => setCitiesOpen(false)}
                      className={cx(
                        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] text-zinc-100/90',
                        'bg-white/[0.03] ring-1 ring-inset ring-white/[0.07]',
                        'hover:bg-white/[0.05] hover:ring-white/[0.09] hover:text-white',
                      )}
                    >
                      View all destinations <ArrowRight className="h-4 w-4 opacity-80" />
                    </Link>

                    <Link
                      href="/coming-soon?section=listings"
                      prefetch
                      onClick={() => setCitiesOpen(false)}
                      className={cx(
                        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] text-zinc-100/90',
                        'bg-white/[0.025] ring-1 ring-inset ring-white/[0.06]',
                        'hover:bg-white/[0.045] hover:ring-white/[0.08] hover:text-white',
                      )}
                    >
                      Browse listings <ArrowRight className="h-4 w-4 opacity-70" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Portal-friendly links (less icons, cleaner) */}
            <Link href="/coming-soon?section=for-sale" prefetch className={cx(linkBase, linkIdle)}>
              For sale
            </Link>

            <Link href="/coming-soon?section=new-developments" prefetch className={cx(linkBase, linkIdle)}>
              New developments
            </Link>

            <Link href="/coming-soon?section=off-market" prefetch className={cx(linkBase, linkIdle)}>
              Off-market
            </Link>

            <Link href="/coming-soon?section=market-intel" prefetch className={cx(linkBase, linkIdle)}>
              Market intel
            </Link>

            {onCityPage ? (
              <div className={cx('ml-2 inline-flex items-center gap-2 rounded-full px-3 py-2', 'bg-white/[0.02]', 'ring-1 ring-inset ring-white/[0.07]')}>
                <span className="inline-flex items-center gap-2 text-[13px] text-zinc-200/90">
                  <Sparkles className="h-4 w-4 text-white/70" />
                  Mode:
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('tab', 'truth');
                    router.replace(url.pathname + '?' + url.searchParams.toString());
                    dispatchTab('truth');
                  }}
                  className={cx(
                    'rounded-full px-2.5 py-1 text-xs transition ring-1 ring-inset',
                    activeTab === 'truth'
                      ? 'bg-white/[0.05] text-white ring-white/[0.08]'
                      : 'bg-white/[0.02] text-zinc-300 ring-white/[0.06] hover:bg-white/[0.04] hover:ring-white/[0.08]',
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
                  }}
                  className={cx(
                    'rounded-full px-2.5 py-1 text-xs transition ring-1 ring-inset',
                    activeTab === 'supply'
                      ? 'bg-white/[0.05] text-white ring-white/[0.08]'
                      : 'bg-white/[0.02] text-zinc-300 ring-white/[0.06] hover:bg-white/[0.04] hover:ring-white/[0.08]',
                  )}
                >
                  Live supply <span className="ml-1 font-mono text-[11px] opacity-80">L</span>
                </button>
              </div>
            ) : null}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <div className={cx('hidden items-center gap-2 rounded-full px-3 py-2 text-[13px] xl:flex', 'bg-white/[0.02]', 'ring-1 ring-inset ring-white/[0.07]')}>
              <span className="inline-flex items-center gap-2 text-zinc-200/90">
                <Command className="h-4 w-4 opacity-90" />
                Search
              </span>
              <span className="text-white/10">•</span>
              <span className="font-mono text-xs text-zinc-200">/</span>
            </div>

            <Link
              href="/"
              prefetch
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  focusGlobalSearch();
                }
              }}
              className={actionBtn}
              aria-label="Search homes"
            >
              <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute -left-1/3 top-0 h-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-[#E7C982]/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              </span>
              <span className={cx('tracking-[0.06em]', goldText)}>Search homes</span>
              <ArrowRight className="h-4 w-4 opacity-85 transition group-hover:translate-x-0.5" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className={cx(
                'relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] transition lg:hidden',
                'bg-white/[0.03] text-zinc-200/90 ring-1 ring-inset ring-white/[0.07]',
                'hover:bg-white/[0.05] hover:ring-white/[0.09]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/10',
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

      {/* Desktop scrim */}
      {citiesOpen ? (
        <button
          type="button"
          aria-label="Close destinations menu"
          onClick={() => setCitiesOpen(false)}
          className="fixed inset-0 z-[60] hidden bg-black/75 lg:block"
        />
      ) : null}

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
          <div className="rounded-3xl bg-[#05060A] p-3 shadow-[0_40px_140px_rgba(0,0,0,0.90)] ring-1 ring-inset ring-white/[0.08]">
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => {
                  focusGlobalSearch();
                  setMobileOpen(false);
                }}
                className={cx(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-[13px] text-zinc-200',
                  'bg-white/[0.02] ring-1 ring-inset ring-white/[0.07]',
                  'hover:bg-white/[0.04] hover:ring-white/[0.09]',
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <Command className="h-4 w-4 opacity-90" />
                  Search homes
                  <span className="ml-2 rounded-md px-2 py-0.5 font-mono text-[11px] text-zinc-200 ring-1 ring-inset ring-white/[0.08] bg-white/[0.02]">
                    /
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </button>

              <button
                type="button"
                onClick={() => setCitiesOpen(true)}
                className={cx(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-[13px] text-zinc-200',
                  'bg-white/[0.02] ring-1 ring-inset ring-white/[0.07]',
                  'hover:bg-white/[0.04] hover:ring-white/[0.09]',
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <Globe className="h-4 w-4 opacity-90" />
                  Destinations
                </span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </button>

              <Link
                href="/coming-soon?section=for-sale"
                prefetch
                className={cx(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-[13px] text-zinc-200',
                  'bg-white/[0.02] ring-1 ring-inset ring-white/[0.07]',
                  'hover:bg-white/[0.04] hover:ring-white/[0.09]',
                )}
              >
                <span>For sale</span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </Link>

              <Link
                href="/coming-soon?section=new-developments"
                prefetch
                className={cx(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-[13px] text-zinc-200',
                  'bg-white/[0.02] ring-1 ring-inset ring-white/[0.07]',
                  'hover:bg-white/[0.04] hover:ring-white/[0.09]',
                )}
              >
                <span>New developments</span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </Link>

              <Link
                href="/coming-soon?section=off-market"
                prefetch
                className={cx(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-[13px] text-zinc-200',
                  'bg-white/[0.02] ring-1 ring-inset ring-white/[0.07]',
                  'hover:bg-white/[0.04] hover:ring-white/[0.09]',
                )}
              >
                <span>Off-market</span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </Link>

              <Link
                href="/coming-soon?section=market-intel"
                prefetch
                className={cx(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-[13px] text-zinc-200',
                  'bg-white/[0.02] ring-1 ring-inset ring-white/[0.07]',
                  'hover:bg-white/[0.04] hover:ring-white/[0.09]',
                )}
              >
                <span>Market intel</span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </Link>

              <div className="mt-2 rounded-3xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/[0.07]">
                <div className={cx('mb-2 text-xs font-semibold tracking-[0.18em] uppercase', goldText)}>
                  Featured cities
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {topCities.slice(0, 8).map((c) => (
                    <Link
                      key={c.slug}
                      href={`/city/${c.slug}`}
                      prefetch
                      onClick={() => setMobileOpen(false)}
                      className={cx(
                        'rounded-2xl px-3 py-2 text-[13px] text-zinc-200',
                        'bg-white/[0.02] ring-1 ring-inset ring-white/[0.07]',
                        'hover:bg-white/[0.04] hover:ring-white/[0.09]',
                      )}
                    >
                      <div className="truncate font-semibold text-zinc-100/90">{c.name}</div>
                      <div className="truncate text-[11px] text-zinc-400">{c.country}</div>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/"
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    'mt-3 flex items-center justify-between rounded-2xl px-4 py-3 text-[13px] text-zinc-200',
                    'bg-white/[0.02] ring-1 ring-inset ring-white/[0.07]',
                    'hover:bg-white/[0.04] hover:ring-white/[0.09]',
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Globe className="h-4 w-4 opacity-90" />
                    View all destinations
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-75" />
                </Link>
              </div>
            </div>
          </div>

          <div className="pointer-events-none mt-3 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
        </div>
      </div>
    </header>
  );
}
