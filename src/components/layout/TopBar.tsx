// src/components/layout/TopBar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, ChevronDown, Command, Crown, Globe, MapPin, Radar, ShieldCheck, Sparkles } from 'lucide-react';

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

/**
 * Vantera hotkey behavior:
 * - Press "/" to focus the global city search on home
 * - Backward compatible with old Locus IDs while we migrate
 */
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

        const focus = () => {
  // Prefer Vantera id, fallback to legacy id
  const el =
    (document.getElementById('vantera-city-search') as HTMLInputElement | null) ||
    (document.getElementById('locus-city-search') as HTMLInputElement | null);

  el?.focus();
};

        if (pathname !== '/') {
          router.push('/');
          window.setTimeout(focus, 350);
          return;
        }

        focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pathname, router]);
}

function dispatchTab(tab: 'truth' | 'supply') {
  // New event name (Vantera)
  window.dispatchEvent(new CustomEvent('vantera:tab', { detail: { tab } }));
  // Legacy compatibility until CityPageClient is migrated
  window.dispatchEvent(new CustomEvent('locus:tab', { detail: { tab } }));
}

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useHotkeyFocusSearch(pathname, router);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const onCityPage = useMemo(() => pathname?.startsWith('/city/'), [pathname]);

  const activeTab = useMemo(() => {
    const t = (searchParams?.get('tab') ?? '').toLowerCase();
    if (t === 'truth' || t === 'supply') return t;
    return 'truth';
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Element | null;
      if (isEditableTarget(target)) return;

      if (e.key === 'Escape') setMobileOpen(false);

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

  // Denser glass, calmer accents, more “private system”
  const veilClass = cx(
    'pointer-events-none absolute inset-0 transition-colors duration-300',
    onCityPage
      ? scrolled
        ? 'bg-black/22'
        : 'bg-black/12'
      : scrolled
        ? 'bg-black/44'
        : 'bg-black/26',
  );

  const surfaceClass = cx(
    'sticky top-0 z-50 w-full',
    'backdrop-blur-[18px]',
    'supports-[backdrop-filter]:bg-black/42',
  );

  const innerClass = cx(
    'mx-auto flex w-full items-center justify-between gap-4',
    'max-w-7xl',
    'px-5 py-3 sm:px-8 sm:py-3.5',
  );

  const linkBase =
    'relative rounded-full px-3 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20';
  const linkIdle =
    'text-zinc-200/85 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10';
  const linkActive =
    'text-white bg-white/[0.07] border border-white/12 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]';

  return (
    <div className={surfaceClass}>
      {/* edges */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ultra-subtle glint (reduced gold) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* soft aura behind bar */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[-10%] top-[-160%] h-[260px] w-[520px] rounded-full bg-white/8 blur-3xl" />
        <div className="absolute right-[-12%] top-[-180%] h-[280px] w-[560px] rounded-full bg-violet-400/8 blur-3xl" />
      </div>

      <div className={veilClass} />

      <div className={innerClass}>
        {/* Left - Identity */}
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            prefetch
            aria-label="Vantera home"
            className="group relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
          >
            {/* emblem plate */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent opacity-90" />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/18" />

            {/* restrained halo */}
            <div className="pointer-events-none absolute -inset-10 opacity-0 transition duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 via-violet-400/8 to-cyan-400/8 blur-2xl" />
            </div>

            <Image
              src="/brand/vantera-icon.png"
              alt="Vantera mark"
              width={30}
              height={30}
              className="relative opacity-95 drop-shadow-[0_10px_28px_rgba(255,255,255,0.10)] transition group-hover:scale-[1.03]"
              priority={false}
            />
          </Link>

          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-2">
              <Link href="/" prefetch className="truncate text-sm font-semibold tracking-[0.18em] text-zinc-100 hover:text-white">
                VANTERA
              </Link>

              <span className="hidden items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-1 text-[11px] text-zinc-100/90 sm:inline-flex">
                <Crown className="h-3.5 w-3.5 opacity-85" />
                PROPERTY INTELLIGENCE
              </span>
            </div>

            <div className="truncate text-xs text-zinc-400">Truth-first signal for buyers, sellers and agents</div>
          </div>
        </div>

        {/* Center - Main navigation */}
        <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary">
          <Link href="/" prefetch className={cx(linkBase, pathname === '/' ? linkActive : linkIdle)}>
            <span className="inline-flex items-center gap-2">
              <Globe className="h-4 w-4 opacity-90" />
              Cities
            </span>
          </Link>

          <Link href="/coming-soon" prefetch className={cx(linkBase, linkIdle)}>
            <span className="inline-flex items-center gap-2">
              <Radar className="h-4 w-4 opacity-90" />
              Signals
            </span>
          </Link>

          <Link href="/coming-soon" prefetch className={cx(linkBase, linkIdle)}>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 opacity-90" />
              Protocol
            </span>
          </Link>

          <Link href="/coming-soon" prefetch className={cx(linkBase, linkIdle)}>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 opacity-90" />
              Coverage
            </span>
          </Link>

          {onCityPage ? (
            <div className="ml-2 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-sm text-zinc-200/90">
              <span className="inline-flex items-center gap-2">
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
                  'rounded-full border px-2.5 py-1 text-xs transition',
                  activeTab === 'truth'
                    ? 'border-white/18 bg-white/[0.10] text-white'
                    : 'border-white/10 bg-white/[0.06] text-zinc-300 hover:border-white/18',
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
                  'rounded-full border px-2.5 py-1 text-xs transition',
                  activeTab === 'supply'
                    ? 'border-white/18 bg-white/[0.10] text-white'
                    : 'border-white/10 bg-white/[0.06] text-zinc-300 hover:border-white/18',
                )}
              >
                Live supply <span className="ml-1 font-mono text-[11px] opacity-80">L</span>
              </button>
            </div>
          ) : null}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-sm text-zinc-200/90 xl:flex">
            <span className="inline-flex items-center gap-2">
              <Command className="h-4 w-4 opacity-90" />
              Search
            </span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-xs text-zinc-200">/</span>
          </div>

          <Link
            href="/"
            prefetch
            className={cx(
              'group relative hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold',
              'border border-white/14 bg-white/[0.08] text-white',
              'shadow-[0_10px_30px_rgba(0,0,0,0.28)]',
              'hover:border-white/20 hover:bg-white/[0.10]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
              'sm:inline-flex',
            )}
            aria-label="Explore cities"
          >
            <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute -left-1/3 top-0 h-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            </span>
            Explore
            <ArrowRight className="h-4 w-4 opacity-90 transition group-hover:translate-x-0.5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className={cx(
              'relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm',
              'border border-white/12 bg-white/[0.06] text-zinc-200/90 hover:border-white/20 hover:bg-white/[0.08]',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
              'lg:hidden',
            )}
            aria-expanded={mobileOpen}
            aria-controls="vantera-mobile-menu"
          >
            Menu
            <ChevronDown className={cx('h-4 w-4 transition', mobileOpen && 'rotate-180')} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        id="vantera-mobile-menu"
        className={cx(
          'lg:hidden',
          'overflow-hidden transition-[max-height,opacity] duration-300',
          mobileOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="mx-auto max-w-7xl px-5 pb-5 sm:px-8">
          <div className="rounded-2xl border border-white/12 bg-black/40 p-3 backdrop-blur-2xl">
            <div className="grid gap-2">
              <Link
                href="/"
                prefetch
                className={cx(
                  'flex items-center justify-between rounded-xl border px-4 py-3 text-sm',
                  pathname === '/' ? 'border-white/18 bg-white/[0.10] text-white' : 'border-white/12 bg-white/[0.06] text-zinc-200 hover:border-white/20',
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <Globe className="h-4 w-4 opacity-90" />
                  Cities
                </span>
                <ArrowRight className="h-4 w-4 opacity-80" />
              </Link>

              <Link
                href="/coming-soon"
                prefetch
                className="flex items-center justify-between rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-zinc-200 hover:border-white/20"
              >
                <span className="inline-flex items-center gap-2">
                  <Radar className="h-4 w-4 opacity-90" />
                  Signals
                </span>
                <ArrowRight className="h-4 w-4 opacity-80" />
              </Link>

              <Link
                href="/coming-soon"
                prefetch
                className="flex items-center justify-between rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-zinc-200 hover:border-white/20"
              >
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 opacity-90" />
                  Protocol
                </span>
                <ArrowRight className="h-4 w-4 opacity-80" />
              </Link>

              <Link
                href="/coming-soon"
                prefetch
                className="flex items-center justify-between rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-zinc-200 hover:border-white/20"
              >
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 opacity-90" />
                  Coverage
                </span>
                <ArrowRight className="h-4 w-4 opacity-80" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  const el =
                    (document.getElementById('vantera-city-search') as HTMLInputElement | null) ??
                    (document.getElementById('locus-city-search') as HTMLInputElement | null);
                  el?.focus();
                  setMobileOpen(false);
                }}
                className="flex items-center justify-between rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-zinc-200 hover:border-white/20"
              >
                <span className="inline-flex items-center gap-2">
                  <Command className="h-4 w-4 opacity-90" />
                  Search cities
                  <span className="ml-2 rounded-md border border-white/12 bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-zinc-200">
                    /
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 opacity-80" />
              </button>
            </div>
          </div>

          <div className="pointer-events-none mt-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </div>
  );
}
