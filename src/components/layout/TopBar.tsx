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
  Crown,
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

  // lock scroll when either overlay menu is open
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
      'Canada',
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

  const propertyTypes = useMemo(
    () => [
      { label: 'Luxury villas', href: '/coming-soon?type=villas' },
      { label: 'Penthouses', href: '/coming-soon?type=penthouses' },
      { label: 'Waterfront', href: '/coming-soon?type=waterfront' },
      { label: 'New developments', href: '/coming-soon?type=new-dev' },
      { label: 'Land plots', href: '/coming-soon?type=land' },
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
      { label: 'Off-market', href: '/coming-soon?q=off%20market' },
    ],
    [],
  );

  function countryHref(country: string) {
    return `/coming-soon?country=${encodeURIComponent(country)}`;
  }

  // Royal palette helpers (low-white borders, deep graphite, restrained gold)
  const barBg = scrolled ? 'bg-[#06070B]/96' : 'bg-[#06070B]/88';
  const barRing = scrolled ? 'ring-1 ring-white/[0.07]' : 'ring-1 ring-white/[0.06]';

  const linkBase =
    'relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/15';
  const linkIdle =
    'text-zinc-200/85 hover:text-white hover:bg-white/[0.04] ring-1 ring-inset ring-white/0 hover:ring-white/8';
  const linkActive = 'text-white bg-white/[0.06] ring-1 ring-inset ring-white/10';

  const pill =
    'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ring-1 ring-inset ring-white/8 bg-white/[0.03] text-zinc-200/90 hover:bg-white/[0.05] hover:ring-white/10 transition';

  const goldText =
    'bg-clip-text text-transparent bg-gradient-to-b from-[#F7E7B8] via-[#E7C982] to-[#B8893B]';
  const goldRing = 'ring-1 ring-inset ring-[#E7C982]/20';

  // JE-style country strip: subtle, scrollable, under main bar
  const stripBg = scrolled ? 'bg-[#05060A]/90' : 'bg-[#05060A]/78';
  const stripBorder = 'border-t border-white/[0.06]';
  const stripLink =
    'inline-flex items-center whitespace-nowrap px-2.5 py-2 text-[12px] text-zinc-200/80 hover:text-white transition';

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* MAIN BAR */}
      <div className={cx('relative w-full backdrop-blur-[12px]', barBg, barRing)}>
        {/* top/bottom hairlines (not bright white) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/18 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        {/* deep ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-140px] h-[260px] w-[520px] rounded-full bg-white/6 blur-3xl" />
          <div className="absolute -top-28 right-[-180px] h-[300px] w-[620px] rounded-full bg-violet-400/8 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_240px_at_50%_0%,rgba(231,201,130,0.10),transparent_60%)]" />
        </div>

        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          {/* Left - Brand */}
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              prefetch
              aria-label="Vantera home"
              className={cx(
                'group relative flex shrink-0 items-center',
                'rounded-2xl bg-[#05060A]/80 px-3 py-2',
                'ring-1 ring-inset ring-white/[0.07]',
                'shadow-[0_18px_60px_rgba(0,0,0,0.55)]',
                'hover:ring-white/[0.10] hover:bg-[#05060A]/90',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/15',
              )}
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/8 via-transparent to-transparent opacity-80" />
              <div className="pointer-events-none absolute -inset-10 opacity-0 transition duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(231,201,130,0.18),transparent_58%)] blur-2xl" />
              </div>

              <Image
                src="/brand/vantera-logo-dark.png"
                alt="Vantera"
                width={220}
                height={54}
                priority={false}
                className={cx(
                  'relative h-9 w-auto opacity-95',
                  'drop-shadow-[0_18px_56px_rgba(0,0,0,0.65)]',
                  'transition group-hover:opacity-100',
                  'sm:h-10',
                )}
              />
            </Link>

            <div className="hidden min-w-0 leading-tight xl:block">
              <div className="flex items-center gap-2">
                <span className={cx('truncate text-[11px] font-semibold tracking-[0.22em] uppercase', goldText)}>
                  Global Property Intelligence
                </span>
                <span
                  className={cx(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] text-zinc-100/90',
                    'bg-white/[0.03] ring-1 ring-inset ring-white/[0.07]',
                  )}
                >
                  <Crown className="h-3.5 w-3.5 opacity-85" />
                  Trust layer
                </span>
              </div>
              <div className="truncate text-xs text-zinc-400">
                Truth-first signal for buyers, sellers and agents
              </div>
            </div>
          </div>

          {/* Center - Primary nav */}
          <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary">
            {/* Cities mega trigger */}
            <div className="relative" ref={citiesWrapRef}>
              <button
                type="button"
                onClick={() => setCitiesOpen((v) => !v)}
                className={cx(linkBase, citiesOpen ? linkActive : linkIdle)}
                aria-expanded={citiesOpen}
                aria-haspopup="menu"
              >
                <Globe className="h-4 w-4 opacity-90" />
                Destinations
                <ChevronDown className={cx('h-4 w-4 transition', citiesOpen && 'rotate-180')} />
              </button>

              {/* Mega panel */}
              <div
                ref={citiesPanelRef}
                className={cx(
                  'absolute left-1/2 z-[70] mt-4 w-[1040px] max-w-[calc(100vw-2rem)] -translate-x-1/2 origin-top',
                  'rounded-[28px] bg-[#05060A]',
                  'shadow-[0_60px_200px_rgba(0,0,0,0.88)]',
                  'ring-1 ring-inset ring-white/10',
                  'max-h-[74vh] overflow-auto',
                  'transition-[transform,opacity] duration-200',
                  citiesOpen
                    ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                    : 'pointer-events-none -translate-y-1 scale-[0.99] opacity-0',
                )}
                role="menu"
                aria-label="Cities mega menu"
              >
                {/* inner gold wash */}
                <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(900px_260px_at_50%_0%,rgba(231,201,130,0.12),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/6" />

                {/* Header row */}
                <div className="relative border-b border-white/8 px-6 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-200/85">
                      <span
                        className={cx(
                          'inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/[0.03]',
                          goldRing,
                        )}
                      >
                        <Globe className="h-4 w-4 opacity-90" />
                      </span>
                      Explore by country
                    </div>

                    <button
                      type="button"
                      onClick={() => setCitiesOpen(false)}
                      className={cx(
                        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px]',
                        'bg-white/[0.03] text-zinc-200/90 ring-1 ring-inset ring-white/10',
                        'hover:bg-white/[0.05] hover:ring-white/12',
                      )}
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
                        className={cx(
                          'rounded-full px-3.5 py-1.5 text-[12px] text-zinc-200/95',
                          'bg-white/[0.03] ring-1 ring-inset ring-white/10',
                          'hover:bg-white/[0.05] hover:ring-white/12 hover:text-white',
                        )}
                        role="menuitem"
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
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
                            'rounded-2xl px-3 py-2.5 text-sm text-zinc-200/90',
                            'bg-white/[0.02] ring-1 ring-inset ring-white/8',
                            'hover:bg-white/[0.04] hover:ring-white/10 hover:text-white',
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
                            'bg-white/[0.02] ring-1 ring-inset ring-white/8',
                            'hover:bg-white/[0.04] hover:ring-white/10',
                          )}
                          role="menuitem"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-zinc-100/90 group-hover:text-white">
                                {c.name}
                              </div>
                              <div className="truncate text-[11px] text-zinc-400">{c.country}</div>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-65 transition group-hover:translate-x-0.5 group-hover:opacity-85" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Types */}
                  <div className="col-span-2">
                    <div className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-200/80">
                      Types
                    </div>
                    <div className="grid gap-2">
                      {propertyTypes.map((t) => (
                        <Link
                          key={t.href}
                          href={t.href}
                          prefetch
                          onClick={() => setCitiesOpen(false)}
                          className={cx(
                            'rounded-2xl px-3 py-2.5 text-sm text-zinc-200/90',
                            'bg-white/[0.02] ring-1 ring-inset ring-white/8',
                            'hover:bg-white/[0.04] hover:ring-white/10 hover:text-white',
                          )}
                          role="menuitem"
                        >
                          {t.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Searches + CTA */}
                  <div className="col-span-3">
                    <div className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-zinc-200/80">
                      Top searches
                    </div>
                    <div className="grid gap-2">
                      {topSearches.map((t) => (
                        <Link
                          key={t.href}
                          href={t.href}
                          prefetch
                          onClick={() => setCitiesOpen(false)}
                          className={cx(
                            'rounded-2xl px-3 py-2.5 text-sm text-zinc-200/90',
                            'bg-white/[0.02] ring-1 ring-inset ring-white/8',
                            'hover:bg-white/[0.04] hover:ring-white/10 hover:text-white',
                          )}
                          role="menuitem"
                        >
                          {t.label}
                        </Link>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/10">
                      <div className={cx('text-xs font-semibold tracking-[0.18em] uppercase', goldText)}>
                        Global search
                      </div>
                      <div className="mt-1 text-xs text-zinc-400">Press / anywhere to jump into city search</div>

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
                          'mt-3 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200',
                          'bg-white/[0.03] ring-1 ring-inset ring-white/10',
                          'hover:bg-white/[0.05] hover:ring-white/12',
                        )}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Command className="h-4 w-4 opacity-90" />
                          Search homes
                          <span className="ml-2 rounded-md px-2 py-0.5 font-mono text-[11px] text-zinc-200 ring-1 ring-inset ring-white/10 bg-white/[0.02]">
                            /
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 opacity-70" />
                      </button>

                      <Link
                        href="/coming-soon?section=listings"
                        prefetch
                        onClick={() => setCitiesOpen(false)}
                        className={cx(
                          'mt-2 inline-flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm',
                          'bg-white/[0.02] ring-1 ring-inset ring-white/8 text-zinc-200/90',
                          'hover:bg-white/[0.04] hover:ring-white/10 hover:text-white',
                        )}
                      >
                        Browse listings
                        <ArrowRight className="h-4 w-4 opacity-70" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none relative h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

                {/* Bottom strip */}
                <div className="relative flex items-center justify-between gap-3 px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span
                      className={cx(
                        'inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/[0.03]',
                        goldRing,
                      )}
                    >
                      <Sparkles className="h-4 w-4 opacity-85" />
                    </span>
                    Truth-first coverage expands city by city
                  </div>

                  <Link
                    href="/"
                    prefetch
                    onClick={() => setCitiesOpen(false)}
                    className={cx(
                      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-zinc-100/90',
                      'bg-white/[0.03] ring-1 ring-inset ring-white/10',
                      'hover:bg-white/[0.05] hover:ring-white/12 hover:text-white',
                    )}
                  >
                    View all destinations <ArrowRight className="h-4 w-4 opacity-80" />
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/coming-soon?section=for-sale" prefetch className={cx(linkBase, linkIdle)}>
              For sale
            </Link>

            <Link href="/coming-soon?section=new-developments" prefetch className={cx(linkBase, linkIdle)}>
              New developments
            </Link>

            <Link href="/coming-soon?section=off-market" prefetch className={cx(linkBase, linkIdle)}>
              Off-market
            </Link>

            <Link href="/coming-soon?section=intel" prefetch className={cx(linkBase, linkIdle)}>
              Market intel
            </Link>

            {onCityPage ? (
              <div
                className={cx(
                  'ml-2 inline-flex items-center gap-2 rounded-full px-3 py-2',
                  'bg-white/[0.02]',
                  'ring-1 ring-inset ring-white/10',
                )}
              >
                <span className="inline-flex items-center gap-2 text-sm text-zinc-200/90">
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
                  }}
                  className={cx(
                    'rounded-full px-2.5 py-1 text-xs transition ring-1 ring-inset',
                    activeTab === 'supply'
                      ? 'bg-white/[0.06] text-white ring-white/12'
                      : 'bg-white/[0.02] text-zinc-300 ring-white/8 hover:bg-white/[0.04] hover:ring-white/10',
                  )}
                >
                  Live supply <span className="ml-1 font-mono text-[11px] opacity-80">L</span>
                </button>
              </div>
            ) : null}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <div
              className={cx(
                'hidden items-center gap-2 rounded-full px-3 py-2 text-sm xl:flex',
                'bg-white/[0.02]',
                'ring-1 ring-inset ring-white/10',
              )}
            >
              <span className="inline-flex items-center gap-2 text-zinc-200/90">
                <Command className="h-4 w-4 opacity-90" />
                Search
              </span>
              <span className="text-white/15">•</span>
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
              className={cx(
                'group relative hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold sm:inline-flex',
                'bg-white/[0.03] text-white ring-1 ring-inset ring-white/10',
                'shadow-[0_18px_70px_rgba(0,0,0,0.45)]',
                'hover:bg-white/[0.05] hover:ring-white/12',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/15',
              )}
              aria-label="Search homes"
            >
              <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute -left-1/3 top-0 h-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-[#E7C982]/14 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              </span>
              <span className={cx('tracking-[0.06em]', goldText)}>Search homes</span>
              <ArrowRight className="h-4 w-4 opacity-85 transition group-hover:translate-x-0.5" />
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

        {/* JE-STYLE COUNTRY STRIP (desktop only) */}
        <div className={cx('hidden lg:block', stripBg, stripBorder)}>
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="py-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-zinc-200/70">
                Countries
              </span>

              <div className="h-4 w-px bg-white/10" />

              <div
                className={cx(
                  'relative flex min-w-0 flex-1 items-center gap-1 overflow-x-auto',
                  '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                )}
              >
                {countries.map((c) => (
                  <Link
                    key={c}
                    href={countryHref(c)}
                    prefetch
                    onClick={() => setCitiesOpen(false)}
                    className={stripLink}
                  >
                    {c}
                  </Link>
                ))}

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
                    'ml-auto inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px]',
                    'bg-white/[0.02] text-zinc-200/85 ring-1 ring-inset ring-white/8',
                    'hover:bg-white/[0.04] hover:text-white hover:ring-white/10',
                  )}
                >
                  <Command className="h-4 w-4 opacity-85" />
                  Quick search <span className="font-mono text-[11px] opacity-80">/</span>
                </Link>
              </div>
            </div>
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
          <div className="rounded-3xl bg-[#05060A] p-3 shadow-[0_40px_140px_rgba(0,0,0,0.85)] ring-1 ring-inset ring-white/10">
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => {
                  focusGlobalSearch();
                  setMobileOpen(false);
                }}
                className={cx(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200',
                  'bg-white/[0.02] ring-1 ring-inset ring-white/10',
                  'hover:bg-white/[0.04] hover:ring-white/12',
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <Command className="h-4 w-4 opacity-90" />
                  Search homes
                  <span className="ml-2 rounded-md px-2 py-0.5 font-mono text-[11px] text-zinc-200 ring-1 ring-inset ring-white/10 bg-white/[0.02]">
                    /
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </button>

              <Link
                href="/coming-soon?section=for-sale"
                prefetch
                className={cx(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200',
                  'bg-white/[0.02] ring-1 ring-inset ring-white/10',
                  'hover:bg-white/[0.04] hover:ring-white/12',
                )}
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
                className={cx(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200',
                  'bg-white/[0.02] ring-1 ring-inset ring-white/10',
                  'hover:bg-white/[0.04] hover:ring-white/12',
                )}
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
                className={cx(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200',
                  'bg-white/[0.02] ring-1 ring-inset ring-white/10',
                  'hover:bg-white/[0.04] hover:ring-white/12',
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 opacity-90" />
                  Off-market
                </span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </Link>

              <Link
                href="/coming-soon?section=intel"
                prefetch
                className={cx(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200',
                  'bg-white/[0.02] ring-1 ring-inset ring-white/10',
                  'hover:bg-white/[0.04] hover:ring-white/12',
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 opacity-90" />
                  Market intel
                </span>
                <ArrowRight className="h-4 w-4 opacity-75" />
              </Link>

              <div className="mt-2 rounded-3xl bg-white/[0.02] p-3 ring-1 ring-inset ring-white/10">
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
                        'rounded-2xl px-3 py-2 text-sm text-zinc-200',
                        'bg-white/[0.02] ring-1 ring-inset ring-white/10',
                        'hover:bg-white/[0.04] hover:ring-white/12',
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
                    'mt-3 flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-zinc-200',
                    'bg-white/[0.02] ring-1 ring-inset ring-white/10',
                    'hover:bg-white/[0.04] hover:ring-white/12',
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Globe className="h-4 w-4 opacity-90" />
                    View destination hub
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-75" />
                </Link>
              </div>
            </div>
          </div>

          <div className="pointer-events-none mt-3 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>
      </div>
    </header>
  );
}
