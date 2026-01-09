'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [scrolled, setScrolled] = useState(false);
  const lastKeyAt = useRef<number>(0);

  const onCityPage = useMemo(
    () => pathname?.startsWith('/city/'),
    [pathname],
  );

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
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Element | null;
      if (isEditableTarget(target)) return;

      const now = Date.now();
      if (now - lastKeyAt.current < 120) return;
      lastKeyAt.current = now;

      // "/" → focus global city search
      if (e.key === '/') {
        e.preventDefault();

        if (pathname !== '/') {
          router.push('/');
          window.setTimeout(() => {
            const el = document.getElementById(
              'locus-city-search',
            ) as HTMLInputElement | null;
            el?.focus();
          }, 350);
          return;
        }

        const el = document.getElementById(
          'locus-city-search',
        ) as HTMLInputElement | null;
        el?.focus();
        return;
      }

      // City page shortcuts
      if (onCityPage && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'truth');
        router.replace(url.pathname + '?' + url.searchParams.toString());
        window.dispatchEvent(
          new CustomEvent('locus:tab', { detail: { tab: 'truth' } }),
        );
        return;
      }

      if (onCityPage && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'supply');
        router.replace(url.pathname + '?' + url.searchParams.toString());
        window.dispatchEvent(
          new CustomEvent('locus:tab', { detail: { tab: 'supply' } }),
        );
        return;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCityPage, pathname, router]);

  /**
   * IMPORTANT:
   * - On city pages, the TopBar must be LIGHTER (it floats over imagery)
   * - On home pages, it can be slightly heavier
   */
  const veilClass = cx(
    'pointer-events-none absolute inset-0 transition-colors',
    onCityPage
      ? scrolled
        ? 'bg-black/30'
        : 'bg-black/15'
      : scrolled
        ? 'bg-black/40'
        : 'bg-black/25',
  );

  const surfaceClass = cx(
    'sticky top-0 z-50 w-full',
    'backdrop-blur-xl',
  );

  const innerClass = cx(
    'mx-auto flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-8',
    'max-w-7xl',
  );

  return (
    <div className={surfaceClass}>
      {/* subtle top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
      {/* subtle bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />

      {/* veil */}
      <div className={veilClass} />

      <div className={innerClass}>
        {/* Left — Identity */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5">
            <div className="h-4 w-4 rounded-full bg-emerald-300/80" />
          </div>

          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="truncate text-sm font-semibold tracking-wide text-zinc-100 hover:text-white"
                prefetch
              >
                Locus
              </Link>

              <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-100 sm:inline-flex">
                TRUTH LAYER
              </span>
            </div>

            <div className="truncate text-xs text-zinc-400">
              Truth-first real estate intelligence
            </div>
          </div>
        </div>

        {/* Center — Hints */}
        <div className="hidden items-center gap-2 lg:flex">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            Press <span className="font-mono text-zinc-200">/</span> to search
          </span>

          {onCityPage ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              <span className="font-mono text-zinc-200">T</span> Truth
              <span className="mx-2 text-white/20">|</span>
              <span className="font-mono text-zinc-200">L</span> Live supply
            </span>
          ) : null}
        </div>

        {/* Right — Mode chips */}
        <div className="flex items-center gap-2">
          {!onCityPage ? (
            <>
              <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 sm:inline-flex">
                Buyer-first
              </span>
              <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 sm:inline-flex">
                No portal logic
              </span>
              <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 sm:inline-flex">
                Reality over hype
              </span>
            </>
          ) : (
            <>
              <span
                className={cx(
                  'rounded-full border px-3 py-1 text-xs transition',
                  activeTab === 'truth'
                    ? 'border-amber-400/20 bg-amber-500/10 text-amber-100'
                    : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20',
                )}
              >
                Truth
              </span>

              <span
                className={cx(
                  'rounded-full border px-3 py-1 text-xs transition',
                  activeTab === 'supply'
                    ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100'
                    : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20',
                )}
              >
                Live supply
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
