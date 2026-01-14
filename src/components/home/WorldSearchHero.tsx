// src/components/home/WorldSearchHero.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type CityLike = {
  slug: string;
  name: string;
  country: string;
  region?: string | null;
  tz: string;
  priority?: number;
};

type Token = {
  id: string;
  label: string;
  kind: 'location' | 'budget' | 'feature' | 'intent' | 'risk' | 'timeframe';
};

type PreferenceMode = 'lifestyle' | 'balanced' | 'market';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function detectBudget(text: string) {
  // Very lightweight heuristic: €5m, 5m, 5 million, 5000000
  const t = text.toLowerCase();

  // € / eur
  const euroM = t.match(/€\s*([0-9]+(\.[0-9]+)?)\s*m/);
  if (euroM?.[1]) return { currency: 'EUR', max: Number(euroM[1]) * 1_000_000 };

  const plainM = t.match(/\b([0-9]+(\.[0-9]+)?)\s*m\b/);
  if (plainM?.[1]) return { currency: 'USD', max: Number(plainM[1]) * 1_000_000 };

  const million = t.match(/\b([0-9]+(\.[0-9]+)?)\s*million\b/);
  if (million?.[1]) return { currency: 'USD', max: Number(million[1]) * 1_000_000 };

  const digits = t.match(/\b([0-9]{6,9})\b/);
  if (digits?.[1]) return { currency: 'USD', max: Number(digits[1]) };

  return null;
}

function splitWish(text: string) {
  // Split by commas, dots, or " and "
  const raw = text
    .replace(/\s+/g, ' ')
    .replace(/\s+and\s+/gi, ', ')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

  return raw;
}

function prettyMoney(n?: number | null, currency?: string | null) {
  if (!n || !Number.isFinite(n)) return '';
  const c = currency || 'USD';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: c,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${c} ${Math.round(n).toLocaleString()}`;
  }
}

function preferenceToSignalRisk(p: PreferenceMode) {
  // Keep the engine, change the surface.
  // lifestyle = more lifestyle weight, lower risk
  // balanced = default
  // market = more signal weight, higher risk
  if (p === 'lifestyle') return { signal: 35, risk: 25 };
  if (p === 'market') return { signal: 75, risk: 60 };
  return { signal: 60, risk: 35 };
}

export default function WorldSearchHero({
  cities,
  onKeepScanningId,
  className,
}: {
  cities: CityLike[];
  onKeepScanningId?: string;
  className?: string;
}) {
  const router = useRouter();

  const [q, setQ] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);

  // Engine controls (kept, but hidden by default)
  const [preference, setPreference] = useState<PreferenceMode>('balanced');
  const [risk, setRisk] = useState(35);
  const [signal, setSignal] = useState(65);

  const [budgetMax, setBudgetMax] = useState<number | null>(null);
  const [budgetCurrency, setBudgetCurrency] = useState<string>('EUR');

  const [refineOpen, setRefineOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const cityIndex = useMemo(() => {
    const arr = (cities ?? []).map((c) => ({
      ...c,
      _n: normalize(`${c.name} ${c.country} ${c.region ?? ''} ${c.slug}`),
    }));
    return arr;
  }, [cities]);

  const topCities = useMemo(() => {
    const sorted = [...(cities ?? [])].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    return sorted.slice(0, 6);
  }, [cities]);

  const citySuggestions = useMemo(() => {
    const qq = normalize(q);
    if (!qq) return topCities;
    return cityIndex
      .filter((c) => c._n.includes(qq))
      .slice(0, 6)
      .map(({ _n, ...rest }) => rest);
  }, [q, cityIndex, topCities]);

  // Convert the wishline into budget (quietly)
  useEffect(() => {
    const t = q.trim();
    if (!t) return;

    const b = detectBudget(t);
    if (b?.max) {
      setBudgetCurrency(b.currency);
      setBudgetMax(b.max);
    }
  }, [q]);

  // When preference changes, map to engine values
  useEffect(() => {
    const mapped = preferenceToSignalRisk(preference);
    setSignal(mapped.signal);
    setRisk(mapped.risk);
  }, [preference]);

  function addToken(label: string, kind: Token['kind']) {
    const clean = label.trim();
    if (!clean) return;

    const exists = tokens.some((t) => normalize(t.label) === normalize(clean) && t.kind === kind);
    if (exists) return;

    setTokens((prev) => [...prev, { id: uid(), label: clean, kind }]);
  }

  function removeToken(id: string) {
    setTokens((prev) => prev.filter((t) => t.id !== id));
  }

  function clearAll() {
    setQ('');
    setTokens([]);
    setBudgetMax(null);
    setPreference('balanced');
    setRisk(35);
    setSignal(65);
    setRefineOpen(false);
    inputRef.current?.focus();
  }

  function absorbWishline() {
    const parts = splitWish(q);
    if (!parts.length) return;

    for (const p of parts) {
      const matchCity = cityIndex.find((c) => c._n.includes(normalize(p)));
      if (matchCity) addToken(matchCity.name, 'location');
      else addToken(p, 'feature');
    }
    setQ('');
    inputRef.current?.focus();
  }

  function goSearch(overrideCitySlug?: string) {
    const params = new URLSearchParams();

    const free = q.trim();
    if (free) params.set('q', free);

    const locs = tokens.filter((t) => t.kind === 'location').map((t) => t.label);
    const feats = tokens.filter((t) => t.kind === 'feature').map((t) => t.label);
    const intents = tokens.filter((t) => t.kind === 'intent').map((t) => t.label);

    if (overrideCitySlug) params.set('city', overrideCitySlug);
    if (locs.length) params.set('loc', locs.join('|'));
    if (feats.length) params.set('feat', feats.join('|'));
    if (intents.length) params.set('intent', intents.join('|'));

    if (budgetMax) {
      params.set('max', String(Math.round(budgetMax)));
      params.set('cur', budgetCurrency);
    }

    // Keep your existing engine params for compatibility
    params.set('risk', String(clamp(risk, 0, 100)));
    params.set('signal', String(clamp(signal, 0, 100)));

    router.push(`/browse?${params.toString()}`);
  }

  const tokenPillTone = (k: Token['kind']) =>
    k === 'location'
      ? 'border-emerald-300/18 bg-emerald-500/10 text-emerald-100/95'
      : k === 'intent'
        ? 'border-violet-300/18 bg-violet-500/12 text-violet-100/95'
        : k === 'budget'
          ? 'border-amber-300/18 bg-amber-500/10 text-amber-100/95'
          : 'border-white/12 bg-white/[0.05] text-zinc-200/90';

  const hasChips = Boolean(budgetMax || tokens.length);

  const mandates = [
    { label: 'Quiet accumulation', hint: 'low noise, high signal', value: 'Quiet accumulation' },
    { label: 'Low-noise prime', hint: 'clean demand structure', value: 'Low-noise prime' },
    { label: 'Ahead of cycle', hint: 'early momentum, disciplined', value: 'Ahead of cycle' },
    { label: 'Verification strong', hint: 'truth-first coverage', value: 'Verification strong' },
    { label: 'Liquidity building', hint: 'velocity-led signals', value: 'Liquidity building' },
  ];

  return (
    <div className={cx('relative', className)}>
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] shadow-[0_34px_120px_rgba(0,0,0,0.60)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_22%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_260px_at_88%_10%,rgba(120,76,255,0.12),transparent_62%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7C982]/20 to-transparent" />
        </div>

        <div className="relative p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.26em] text-zinc-400">SEARCH</div>
              <div className="mt-2 text-[15px] font-medium text-zinc-100 sm:text-base">
                Describe the place you want. Vantera handles the structure.
              </div>
              <div className="mt-1 text-[12px] text-zinc-400">
                A wishline becomes a private intelligence brief.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRefineOpen((v) => !v)}
                className={cx(
                  'rounded-full border px-3 py-1.5 text-[11px] text-zinc-200',
                  refineOpen
                    ? 'border-white/18 bg-white/[0.06]'
                    : 'border-white/10 bg-black/25 hover:border-white/16 hover:bg-white/[0.04]',
                )}
              >
                Refine
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] text-zinc-300 hover:border-white/16 hover:bg-white/[0.04]"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="mt-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="pointer-events-none absolute inset-0 opacity-[0.9]">
                <div className="absolute inset-0 bg-[radial-gradient(900px_220px_at_10%_0%,rgba(231,201,130,0.12),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(900px_220px_at_88%_10%,rgba(120,76,255,0.14),transparent_62%)]" />
              </div>

              <div className="relative flex items-center gap-2 p-3 sm:p-3.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[12px] text-zinc-200">
                  ⌕
                </span>

                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (q.trim().length >= 3) goSearch();
                    }
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      absorbWishline();
                    }
                  }}
                  placeholder="Oceanfront, quiet, family-safe, walkable, under €5m"
                  className="h-10 w-full bg-transparent text-[14px] text-zinc-100 placeholder:text-zinc-500 outline-none"
                  aria-label="World search"
                />

                <button
                  type="button"
                  onClick={() => goSearch()}
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-zinc-100 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  SEARCH →
                </button>
              </div>

              {/* Chips (only when they exist, no “tips” block) */}
              {hasChips ? (
                <div className="relative border-t border-white/10 px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    {budgetMax ? (
                      <span
                        className={cx(
                          'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] leading-none backdrop-blur-2xl',
                          tokenPillTone('budget'),
                        )}
                      >
                        <span className="text-zinc-300">Max</span>
                        <span className="font-mono text-zinc-100">
                          {prettyMoney(budgetMax, budgetCurrency)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setBudgetMax(null)}
                          className="ml-1 rounded-full border border-white/10 bg-black/25 px-1.5 py-0.5 text-[10px] text-zinc-300 hover:bg-white/[0.06]"
                          aria-label="Remove budget"
                        >
                          ×
                        </button>
                      </span>
                    ) : null}

                    {tokens.map((t) => (
                      <span
                        key={t.id}
                        className={cx(
                          'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] leading-none backdrop-blur-2xl',
                          tokenPillTone(t.kind),
                        )}
                      >
                        <span className="text-zinc-200">{t.label}</span>
                        <button
                          type="button"
                          onClick={() => removeToken(t.id)}
                          className="rounded-full border border-white/10 bg-black/25 px-1.5 py-0.5 text-[10px] text-zinc-300 hover:bg-white/[0.06]"
                          aria-label={`Remove ${t.label}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Quiet helper row */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
              <div>
                Press <span className="text-zinc-200">Tab</span> to structure your wishline.
              </div>
              <div className="text-zinc-500">
                Preference: <span className="text-zinc-200">{preference === 'market' ? 'Market-opportunistic' : preference === 'lifestyle' ? 'Lifestyle-first' : 'Balanced'}</span>
              </div>
            </div>
          </div>

          {/* Popular paths (calm, limited) */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">POPULAR PATHS</div>
              <button
                type="button"
                onClick={() => setRefineOpen(true)}
                className="text-[11px] text-zinc-400 hover:text-zinc-200"
              >
                Refine →
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {topCities.slice(0, 4).map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => {
                    addToken(c.name, 'location');
                    inputRef.current?.focus();
                  }}
                  className="rounded-full border border-white/10 bg-black/25 px-3 py-2 text-[11px] text-zinc-200 hover:border-white/16 hover:bg-white/[0.05]"
                  title={`${c.name}, ${c.country}`}
                >
                  <span className="text-zinc-100">{c.name}</span>
                  <span className="text-zinc-600"> · </span>
                  <span className="text-zinc-400">{c.country}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Refine drawer (progressive disclosure) */}
          {refineOpen ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/25">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div>
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-300">REFINE</div>
                  <div className="mt-1 text-[12px] text-zinc-400">
                    Optional controls. Vantera will still work without them.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRefineOpen(false)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-zinc-200 hover:bg-white/[0.07]"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-4 p-4 sm:grid-cols-2">
                {/* Preference */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">PREFERENCE</div>
                  <div className="mt-2 text-[12px] text-zinc-400">
                    Choose the lens. The model adapts behind the scenes.
                  </div>

                  <div className="mt-3 grid gap-2">
                    {[
                      { k: 'lifestyle' as const, title: 'Lifestyle-first', sub: 'comfort, calm, fit' },
                      { k: 'balanced' as const, title: 'Balanced', sub: 'default intelligence' },
                      { k: 'market' as const, title: 'Market-opportunistic', sub: 'signal, timing, upside' },
                    ].map((x) => (
                      <button
                        key={x.k}
                        type="button"
                        onClick={() => setPreference(x.k)}
                        className={cx(
                          'w-full rounded-2xl border px-3 py-3 text-left transition',
                          preference === x.k
                            ? 'border-white/18 bg-white/[0.06]'
                            : 'border-white/10 bg-black/20 hover:border-white/16 hover:bg-white/[0.04]',
                        )}
                      >
                        <div className="text-[12px] font-semibold text-zinc-100">{x.title}</div>
                        <div className="mt-1 text-[11px] text-zinc-400">{x.sub}</div>
                      </button>
                    ))}
                  </div>

                  {/* Keep engine values invisible but deterministic */}
                  <div className="mt-3 text-[11px] text-zinc-500">
                    Engine: <span className="font-mono text-zinc-200">signal {signal}</span>,{' '}
                    <span className="font-mono text-zinc-200">risk {risk}</span>
                  </div>
                </div>

                {/* Mandate + lock city */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">MANDATE</div>
                  <div className="mt-2 text-[12px] text-zinc-400">
                    Optional. Pick one, or leave it to Vantera.
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {mandates.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => addToken(m.value, 'intent')}
                        className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[11px] text-zinc-200 hover:border-white/16 hover:bg-white/[0.05]"
                        title={m.hint}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 text-[11px] font-semibold tracking-[0.22em] text-zinc-400">
                    LOCK A CITY
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {citySuggestions.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => {
                          addToken(c.name, 'location');
                          inputRef.current?.focus();
                        }}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-zinc-300 hover:border-white/16 hover:bg-white/[0.06]"
                        title={`${c.name}, ${c.country}`}
                      >
                        <span className="text-zinc-100">{c.name}</span>
                        <span className="text-zinc-600"> · </span>
                        <span className="text-zinc-400">{c.country}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={absorbWishline}
                      className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[11px] text-zinc-200 hover:border-white/16 hover:bg-white/[0.04]"
                    >
                      Structure wishline (Tab)
                    </button>

                    <button
                      type="button"
                      onClick={() => goSearch()}
                      className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-zinc-100 hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      OPEN RESULTS →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Footer actions (kept, but calmer) */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (!onKeepScanningId) return;
                const el = document.getElementById(onKeepScanningId);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[11px] text-zinc-300 hover:border-white/16 hover:bg-white/[0.04]"
            >
              Keep scanning ↓
            </button>

            <button
              type="button"
              onClick={() => goSearch()}
              className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-zinc-100 hover:border-white/20 hover:bg-white/[0.08]"
            >
              OPEN RESULTS →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
