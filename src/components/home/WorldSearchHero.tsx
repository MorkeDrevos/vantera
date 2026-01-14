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
  // Split by commas, dots, or " and " when long
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
  const [risk, setRisk] = useState(35); // 0 safe, 100 aggressive
  const [signal, setSignal] = useState(65); // 0 lifestyle, 100 signal
  const [budgetMax, setBudgetMax] = useState<number | null>(null);
  const [budgetCurrency, setBudgetCurrency] = useState<string>('EUR');

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
    return sorted.slice(0, 8);
  }, [cities]);

  const suggestions = useMemo(() => {
    const qq = normalize(q);
    if (!qq) return topCities.slice(0, 6);
    return cityIndex
      .filter((c) => c._n.includes(qq))
      .slice(0, 8)
      .map(({ _n, ...rest }) => rest);
  }, [q, cityIndex, topCities]);

  // Convert the wishline into tokens (lightweight)
  useEffect(() => {
    const t = q.trim();
    if (!t) return;

    const b = detectBudget(t);
    if (b?.max) {
      setBudgetCurrency(b.currency);
      setBudgetMax(b.max);
    }
  }, [q]);

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
    setRisk(35);
    setSignal(65);
    inputRef.current?.focus();
  }

  function absorbWishline() {
    const parts = splitWish(q);
    if (!parts.length) return;

    // Put any city matches in location, others as features.
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

    params.set('risk', String(risk));
    params.set('signal', String(signal));

    // Use /browse as the canonical destination (matches your nav).
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

  return (
    <div className={cx('relative', className)}>
      {/* Frame */}
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
                Describe the place you want. We translate it into signal.
              </div>
              <div className="mt-1 text-[12px] text-zinc-400">
                Not “filters”. A wishline that becomes structured intelligence.
              </div>
            </div>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] text-zinc-300 hover:border-white/16 hover:bg-white/[0.04]"
            >
              Reset
            </button>
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
                      // Tab = absorb wishline into tokens (feels “new”)
                      e.preventDefault();
                      absorbWishline();
                    }
                  }}
                  placeholder="Oceanfront, family safe, walkable, under €5m, low noise..."
                  className="h-10 w-full bg-transparent text-[14px] text-zinc-100 placeholder:text-zinc-500 outline-none"
                  aria-label="World search"
                />

                <button
                  type="button"
                  onClick={absorbWishline}
                  className="hidden sm:inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-zinc-200 hover:border-white/16 hover:bg-white/[0.06]"
                  title="Convert wishline to tokens"
                >
                  Tokenise (Tab)
                </button>

                <button
                  type="button"
                  onClick={() => goSearch()}
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-zinc-100 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  SEARCH →
                </button>
              </div>

              {/* Token row */}
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
                      <span className="font-mono text-zinc-100">{prettyMoney(budgetMax, budgetCurrency)}</span>
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

                  {tokens.length ? (
                    tokens.map((t) => (
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
                    ))
                  ) : (
                    <div className="text-[11px] text-zinc-500">
                      Tip: type a wishline and press <span className="text-zinc-300">Tab</span> to convert into tokens.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">SIGNAL BIAS</div>
                <div className="font-mono text-[11px] text-zinc-300">{signal}%</div>
              </div>
              <div className="mt-2 text-[12px] text-zinc-400">Left = lifestyle. Right = market signal.</div>
              <input
                type="range"
                min={0}
                max={100}
                value={signal}
                onChange={(e) => setSignal(clamp(Number(e.target.value), 0, 100))}
                className="mt-3 w-full accent-white"
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-baseline justify-between gap-3">
                <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">RISK POSTURE</div>
                <div className="font-mono text-[11px] text-zinc-300">{risk}%</div>
              </div>
              <div className="mt-2 text-[12px] text-zinc-400">Lower = stable. Higher = asymmetric upside.</div>
              <input
                type="range"
                min={0}
                max={100}
                value={risk}
                onChange={(e) => setRisk(clamp(Number(e.target.value), 0, 100))}
                className="mt-3 w-full accent-white"
              />
            </div>
          </div>

          {/* “Never seen before” suggestion rail */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400">SUGGESTIONS</div>
              <div className="text-[11px] text-zinc-500">Click a city to lock location</div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((c) => (
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

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                'Oceanfront quiet',
                'Ultra-prime walkable',
                'Family safe schools',
                'Tax efficient',
                'Low noise, high privacy',
                'Investor liquid',
              ].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => addToken(t, 'intent')}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-zinc-300 hover:border-white/16 hover:bg-white/[0.06]"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Footer actions */}
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
