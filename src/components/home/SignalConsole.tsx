// src/components/home/SignalConsole.tsx
'use client';

import { useMemo, useState } from 'react';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

type Token = { id: string; label: string; group: 'city' | 'signal' };

const DEFAULT_SUGGESTIONS: Token[] = [
  { id: 'marbella', label: 'Marbella, Spain', group: 'city' },
  { id: 'benahavis', label: 'Benahavís, Spain', group: 'city' },
  { id: 'estepona', label: 'Estepona, Spain', group: 'city' },
  { id: 'monaco', label: 'Monaco, Monaco', group: 'city' },
  { id: 'dubai', label: 'Dubai, United Arab Emirates', group: 'city' },
  { id: 'london', label: 'London, United Kingdom', group: 'city' },

  { id: 'oceanfront-quiet', label: 'Oceanfront, quiet', group: 'signal' },
  { id: 'ultra-walkable', label: 'Ultra-prime, walkable', group: 'signal' },
  { id: 'family-schools', label: 'Family, top schools', group: 'signal' },
  { id: 'tax-efficient', label: 'Tax efficient', group: 'signal' },
  { id: 'privacy-low-noise', label: 'Low noise, high privacy', group: 'signal' },
  { id: 'investor-liquid', label: 'Investor liquid', group: 'signal' },
];

function Pill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'group inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-[12px] leading-none',
        'border backdrop-blur-xl transition',
        active
          ? 'border-white/22 bg-white/[0.06] text-white/92 shadow-[0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.08)]'
          : 'border-white/12 bg-white/[0.035] text-white/70 hover:border-white/18 hover:bg-white/[0.05]'
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white/35 group-hover:bg-white/45" />
      <span className="truncate">{children}</span>
    </button>
  );
}

function Meter({
  label,
  value,
  leftHint,
  rightHint,
  onChange,
}: {
  label: string;
  value: number;
  leftHint: string;
  rightHint: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] tracking-[0.22em] text-white/45">
            {label.toUpperCase()}
          </div>
          <div className="mt-2 text-[13px] text-white/58">{leftHint}</div>
        </div>
        <div className="text-[13px] text-white/70">
          <span className="tabular-nums text-white/88">{value}</span>
          <span className="text-white/50">%</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="relative">
          {/* track */}
          <div className="h-9 rounded-2xl border border-white/10 bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />

          {/* neutral marker */}
          <div className="pointer-events-none absolute left-1/2 top-[6px] h-[22px] w-px -translate-x-1/2 bg-white/14" />

          {/* range input */}
          <input
            aria-label={label}
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className={cx(
              'absolute inset-0 h-9 w-full cursor-pointer appearance-none bg-transparent',
              // Webkit thumb
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/25',
              '[&::-webkit-slider-thumb]:bg-white/90',
              '[&::-webkit-slider-thumb]:shadow-[0_8px_24px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.55)]',
              // Firefox thumb
              '[&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-white/25',
              '[&::-moz-range-thumb]:bg-white/90',
              '[&::-moz-range-thumb]:shadow-[0_8px_24px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.55)]',
              // hide default track
              '[&::-webkit-slider-runnable-track]:appearance-none',
              '[&::-moz-range-track]:appearance-none'
            )}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-[12px] text-white/45">
          <span>{leftHint}</span>
          <span className="text-white/40">{rightHint}</span>
        </div>
      </div>
    </div>
  );
}

export default function SignalConsole({
  className = '',
  coverageNote = 'Coverage: 16 cities · Regions: 4 · Timezones: 9 · Updates: Live',
  proofNote = 'Proof: Registry + docs',
}: {
  className?: string;
  coverageNote?: string;
  proofNote?: string;
}) {
  const [query, setQuery] = useState(
    'Oceanfront, family safe, walkable, under €5m, low noise'
  );
  const [signalBias, setSignalBias] = useState(65);
  const [riskPosture, setRiskPosture] = useState(35);
  const [active, setActive] = useState<Record<string, boolean>>({});

  const cityTokens = useMemo(
    () => DEFAULT_SUGGESTIONS.filter((t) => t.group === 'city'),
    []
  );
  const signalTokens = useMemo(
    () => DEFAULT_SUGGESTIONS.filter((t) => t.group === 'signal'),
    []
  );

  function toggle(id: string) {
    setActive((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function reset() {
    setQuery('Oceanfront, family safe, walkable, under €5m, low noise');
    setSignalBias(65);
    setRiskPosture(35);
    setActive({});
  }

  return (
    <section className={cx('relative w-full', className)}>
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-10">
        {/* Top line copy - colder and institutional */}
        <div className="mb-6">
          <p className="text-[15px] leading-relaxed text-white/70">
            Vantera is a private intelligence interface for buyers, sellers and
            advisors who operate on signal not narrative. Built to model value,
            liquidity and risk with audit-grade discipline.
          </p>
        </div>

        {/* Intelligence slab */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.035] shadow-[0_18px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]">
          {/* Ambient glow layers */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-56 h-[520px] w-[520px] rounded-full bg-white/[0.05] blur-3xl" />
            <div className="absolute -right-40 -top-56 h-[620px] w-[620px] rounded-full bg-violet-500/10 blur-3xl" />
            <div className="absolute right-10 top-10 h-[420px] w-[760px] rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/45" />
          </div>

          <div className="relative p-6 sm:p-8 lg:p-10">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] tracking-[0.28em] text-white/45">
                  SEARCH
                </div>
                <h2 className="mt-2 text-[22px] font-medium text-white/92 sm:text-[24px]">
                  Describe intent. We convert it to structured signal.
                </h2>
                <p className="mt-2 max-w-[68ch] text-[14px] leading-relaxed text-white/55">
                  Not filters. A wishline translated into constraints, trade-offs
                  and market posture.
                </p>
              </div>

              <button
                type="button"
                onClick={reset}
                className="rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-2 text-[12px] text-white/70 backdrop-blur-xl transition hover:border-white/18 hover:bg-white/[0.05]"
              >
                Reset
              </button>
            </div>

            {/* Command row */}
            <div className="mt-7 rounded-[26px] border border-white/10 bg-black/30 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35">
                    ⌕
                  </div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Oceanfront, low noise, family safe, walkable, under €5m"
                    className={cx(
                      'h-[64px] w-full rounded-2xl border border-white/10 bg-black/35',
                      'pl-11 pr-4 text-[15px] text-white/85 placeholder:text-white/35',
                      'outline-none ring-0',
                      'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.6)]',
                      'focus:border-white/18'
                    )}
                  />
                  <div className="mt-2 text-[12px] text-white/40">
                    Tip: press Tab to tokenise intent into constraints.
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <button
                    type="button"
                    className="rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3 text-[12px] text-white/70 backdrop-blur-xl transition hover:border-white/18 hover:bg-white/[0.05]"
                  >
                    Tokenise (Tab)
                  </button>

                  <button
                    type="button"
                    className={cx(
                      'h-[52px] rounded-2xl px-6 text-[12px] tracking-[0.18em]',
                      'border border-white/20 bg-white/[0.06] text-white/92',
                      'shadow-[0_16px_44px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.10)]',
                      'transition hover:border-white/26 hover:bg-white/[0.08]'
                    )}
                  >
                    SEARCH →
                  </button>
                </div>
              </div>
            </div>

            {/* Instruments */}
            <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Meter
                label="Signal bias"
                value={signalBias}
                leftHint="Lifestyle"
                rightHint="Market signal"
                onChange={setSignalBias}
              />
              <Meter
                label="Risk posture"
                value={riskPosture}
                leftHint="Stable"
                rightHint="Asymmetric"
                onChange={setRiskPosture}
              />
            </div>

            {/* Suggestions slab */}
            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.02] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <div className="text-[11px] tracking-[0.28em] text-white/45">
                  SUGGESTIONS
                </div>
                <div className="text-[12px] text-white/40">
                  Click a city to lock location.
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {cityTokens.map((t) => (
                  <Pill
                    key={t.id}
                    active={!!active[t.id]}
                    onClick={() => toggle(t.id)}
                  >
                    {t.label}
                  </Pill>
                ))}
              </div>

              <div className="mt-4 h-px w-full bg-white/8" />

              <div className="mt-4 flex flex-wrap gap-2.5">
                {signalTokens.map((t) => (
                  <Pill
                    key={t.id}
                    active={!!active[t.id]}
                    onClick={() => toggle(t.id)}
                  >
                    {t.label}
                  </Pill>
                ))}
              </div>

              <div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[12px] text-white/70 backdrop-blur-xl transition hover:border-white/18 hover:bg-white/[0.05]"
                >
                  Keep scanning ↓
                </button>

                <button
                  type="button"
                  className={cx(
                    'inline-flex items-center justify-center rounded-2xl px-6 py-3',
                    'border border-white/20 bg-white/[0.06] text-[12px] tracking-[0.18em] text-white/92',
                    'shadow-[0_18px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.10)]',
                    'transition hover:border-white/26 hover:bg-white/[0.08]'
                  )}
                >
                  ENTER INTELLIGENCE →
                </button>
              </div>
            </div>

            {/* Coverage strip */}
            <div className="mt-6 rounded-[22px] border border-white/10 bg-black/25 px-5 py-4 text-[12px] text-white/60 backdrop-blur-2xl">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-white/60">{coverageNote}</div>
                <div className="text-white/55">{proofNote}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional spacer below */}
        <div className="h-8" />
      </div>
    </section>
  );
}
