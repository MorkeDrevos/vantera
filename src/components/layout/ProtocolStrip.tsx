// src/components/layout/ProtocolStrip.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

type ItemTone = 'good' | 'warn' | 'neutral';

type StripItem = {
  label: string;
  value: string;
  tone?: ItemTone;
  hint?: string;
};

function toneClasses(tone: ItemTone) {
  if (tone === 'good') return 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100';
  if (tone === 'warn') return 'border-amber-400/20 bg-amber-500/10 text-amber-100';
  return 'border-white/10 bg-white/5 text-zinc-200';
}

function useNowTick(ms = 15_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}

export default function ProtocolStrip() {
  const now = useNowTick(15_000);

  const items = useMemo<StripItem[]>(() => {
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');

    return [
      {
        label: 'Protocol',
        value: 'Truth-first',
        tone: 'good',
        hint: 'Outputs change only when reality changes',
      },
      {
        label: 'Coverage',
        value: 'Initializing',
        tone: 'warn',
        hint: 'No numbers until verified sources are connected',
      },
      {
        label: 'Surfaces',
        value: `${Math.max(1, 7)} labs`,
        tone: 'neutral',
        hint: 'City truth labs are your market nodes',
      },
      {
        label: 'System time',
        value: `${hh}:${mm}`,
        tone: 'neutral',
        hint: 'UI-only for now',
      },
    ];
  }, [now]);

  return (
    <div className="relative">
      {/* subtle scanline */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:1px_28px]" />
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 py-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/90" />
            <span className="uppercase tracking-[0.18em]">Protocol status</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {items.map((it) => (
              <div
                key={it.label}
                title={it.hint}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs"
              >
                <span className="text-zinc-500">{it.label}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${toneClasses(it.tone ?? 'neutral')}`}>
                  {it.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
