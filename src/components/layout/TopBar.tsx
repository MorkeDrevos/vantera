// src/components/layout/TopBar.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

type TopBarProps = {
  pills?: string[];
};

function useScrollY(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}

export default function TopBar({
  pills = ['Buyer-first', 'No portal logic', 'Reality over hype'],
}: TopBarProps) {
  const scrolled = useScrollY(12);

  // Mobile pills dropdown
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, []);

  const safePills = useMemo(() => pills.filter(Boolean).slice(0, 5), [pills]);

  return (
    <div className="sticky top-0 z-50">
      {/* topbar glass */}
      <div
        className={[
          'relative border-b transition',
          scrolled
            ? 'border-white/10 bg-zinc-950/70 backdrop-blur-xl'
            : 'border-transparent bg-transparent',
        ].join(' ')}
      >
        {/* subtle sheen */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-0 transition duration-300 sm:opacity-100" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/10 opacity-0 sm:opacity-100" />
        </div>

        <header className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-10">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition group-hover:border-white/20">
              <div className="h-4 w-4 rounded-full bg-emerald-300/80" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(300px_120px_at_35%_0%,rgba(255,255,255,0.14),transparent_60%)]" />
              </div>
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold tracking-wide text-zinc-100">
                  Locus
                </div>
                <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-100 sm:inline-flex">
                  TRUTH LAYER
                </span>
              </div>
              <div className="text-xs text-zinc-400">
                Truth-first real estate intelligence
              </div>
            </div>
          </Link>

          {/* Desktop pills */}
          <div className="hidden items-center gap-2 sm:flex">
            {safePills.map((p) => (
              <span
                key={p}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200 transition hover:border-white/20"
              >
                {p}
              </span>
            ))}
          </div>

          {/* Mobile: compact pill toggle */}
          <div className="relative sm:hidden" ref={panelRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 transition hover:border-white/20"
              aria-expanded={open}
              aria-label="Open principles"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/90" />
              <span>Principles</span>
              <span className="opacity-70">{open ? '↑' : '↓'}</span>
            </button>

            {open ? (
              <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                {safePills.map((p) => (
                  <div
                    key={p}
                    className="rounded-xl border border-transparent px-3 py-2 text-xs text-zinc-200 transition hover:border-white/10 hover:bg-white/5"
                  >
                    {p}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </header>
      </div>

      {/* subtle underglow line when scrolled */}
      <div
        className={[
          'pointer-events-none h-px w-full transition',
          scrolled ? 'bg-white/10' : 'bg-transparent',
        ].join(' ')}
      />
    </div>
  );
}
