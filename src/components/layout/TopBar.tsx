'use client';

// src/components/layout/TopBar.tsx

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

/* ---------------- Search focus bridge ---------------- */

function dispatchFocusSearch() {
  window.dispatchEvent(new CustomEvent('vantera:focus-search'));
  window.dispatchEvent(new CustomEvent('locus:focus-search'));
}

function useHotkeyFocusSearch(
  pathname: string | null,
  router: ReturnType<typeof useRouter>,
) {
  const lastKeyAt = useRef<number>(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target as Element | null)) return;

      const now = Date.now();
      if (now - lastKeyAt.current < 120) return;
      lastKeyAt.current = now;

      if (e.key === '/') {
        e.preventDefault();

        if (pathname !== '/') {
          router.push('/');
          setTimeout(dispatchFocusSearch, 350);
        } else {
          dispatchFocusSearch();
        }
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

/* ---------------- Types ---------------- */

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
    if (!seen.has(k)) {
      seen.add(k);
      out.push(a);
    }
  }
  return out;
}

/* ====================================================== */

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useHotkeyFocusSearch(pathname, router);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openT = useRef<number | null>(null);
  const closeT = useRef<number | null>(null);

  const onCityPage = pathname?.startsWith('/city/') ?? false;

  const activeTab = useMemo(() => {
    const t = (searchParams?.get('tab') ?? '').toLowerCase();
    return t === 'supply' ? 'supply' : 'truth';
  }, [searchParams]);

  /* ---------------- Scroll ---------------- */

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

  /* ---------------- Keyboard ---------------- */

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target as Element | null)) return;

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
      }

      if (onCityPage && (e.key === 'l' || e.key === 'L')) {
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

  /* ---------------- Data ---------------- */

  const cityList = useMemo<CityLite[]>(() => (CITIES as any) ?? [], []);
  const topCities = cityList.slice(0, 10);

  const countries = useMemo(() => {
    const preferred = [
      'Spain',
      'United States',
      'United Arab Emirates',
      'United Kingdom',
      'France',
      'Portugal',
      'Italy',
      'Switzerland',
    ];

    const present = uniqBy(
      cityList.map((c) => c.country).filter(Boolean).map(String),
      (x) => x.toLowerCase(),
    );

    return [
      ...preferred.filter((p) =>
        present.some((x) => x.toLowerCase() === p.toLowerCase()),
      ),
      ...present.filter(
        (x) => !preferred.some((p) => p.toLowerCase() === x.toLowerCase()),
      ),
    ].slice(0, 12);
  }, [cityList]);

  function countryHref(country: string) {
    return `/coming-soon?country=${encodeURIComponent(country)}`;
  }

  /* ---------------- Styling ---------------- */

  const barBg = scrolled ? 'bg-[#06070A]/88' : 'bg-[#06070A]/62';

  const goldText =
    'bg-clip-text text-transparent bg-gradient-to-b from-[#F7E7BF] via-[#E6C980] to-[#B7863A]';

  const softBorder = 'ring-1 ring-inset ring-white/10';
  const softFill = 'bg-white/[0.028] hover:bg-white/[0.055]';
  const softFillStrong = 'bg-white/[0.038] hover:bg-white/[0.075]';

  const navItemBase =
    'inline-flex h-10 items-center whitespace-nowrap text-[12px] tracking-[0.14em] text-zinc-200/70 hover:text-white transition';

  /* ---------------- Routes / copy ---------------- */

  const sellLabel = 'List privately';
  const sellHref = '/coming-soon?flow=sell';
  const agentHref = '/coming-soon?flow=agents';
  const sellersHref = '/coming-soon?flow=private-sellers';
  const intelligenceHref = '/coming-soon?section=intelligence';
  const journalHref = '/coming-soon?section=journal';
  const aboutHref = '/coming-soon?section=about';

  /* ====================== JSX ====================== */

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className={cx('relative w-full backdrop-blur-[18px]', barBg)}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E6C980]/20 to-transparent" />

        <div className="relative mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-7">
          {/* Brand */}
          <Link href="/" aria-label="Vantera home" className="flex items-center">
            <Image
              src="/brand/vantera-logo-dark.svg"
              alt="Vantera"
              width={620}
              height={180}
              className="h-[40px] w-auto sm:h-[44px]"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 justify-center lg:flex">
            <div className="flex items-center gap-8">
              {/* Places */}
              <button
                type="button"
                onClick={() => setMegaOpen((v) => !v)}
                className={navItemBase}
              >
                <Globe className="h-4 w-4 opacity-70" />
                Places
                <ChevronDown className="h-4 w-4" />
              </button>

              <Link href={intelligenceHref} className={navItemBase}>
                Intelligence
              </Link>

              <Link href={sellersHref} className={navItemBase}>
                Private sellers
              </Link>

              <Link href={agentHref} className={navItemBase}>
                For agents
              </Link>

              <Link href={journalHref} className={navItemBase}>
                Journal
              </Link>

              <Link href={aboutHref} className={navItemBase}>
                About
              </Link>
            </div>
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={dispatchFocusSearch}
              className={cx(
                'hidden sm:inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm text-zinc-200',
                softFill,
                softBorder,
              )}
            >
              <Command className="h-4 w-4 opacity-70" />
              Search
              <span className="font-mono text-xs opacity-60">/</span>
            </button>

            <Link
              href={sellHref}
              className={cx(
                'inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold',
                softFillStrong,
                softBorder,
              )}
            >
              <span className={goldText}>{sellLabel}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={cx(
                'lg:hidden inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm',
                softFill,
                softBorder,
              )}
            >
              Menu
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
