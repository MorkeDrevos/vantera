// src/components/city/CityPageClient.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import PageShell from '@/components/layout/PageShell';

type CityLite = {
  name: string;
  slug: string;
  country: string;
  region: string | null;
  tz: string;
  blurb: string | null;
  image: { src: string; alt: string | null } | null;
};

type NavLite = { name: string; slug: string };
type TabKey = 'truth' | 'supply';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function formatLocalTime(tz: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: tz,
    }).format(new Date());
  } catch {
    return '';
  }
}

function pillTone(tone: 'good' | 'warn' | 'bad' | 'neutral') {
  if (tone === 'good') return 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100';
  if (tone === 'warn') return 'border-amber-400/20 bg-amber-500/10 text-amber-100';
  if (tone === 'bad') return 'border-rose-400/20 bg-rose-500/10 text-rose-100';
  return 'border-white/10 bg-white/5 text-zinc-200';
}

function TabButton({
  active,
  onClick,
  title,
  subtitle,
  tone = 'neutral',
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  tone?: 'good' | 'warn' | 'neutral';
}) {
  const activeClass = active
    ? 'border-white/20 bg-white/10'
    : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/5';

  const badge =
    tone === 'good'
      ? pillTone('good')
      : tone === 'warn'
        ? pillTone('warn')
        : pillTone('neutral');

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx('group w-full rounded-2xl border px-4 py-3 text-left transition', activeClass)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-100">{title}</div>
          <div className="mt-1 text-xs leading-relaxed text-zinc-400">{subtitle}</div>
        </div>
        <span className={cx('shrink-0 rounded-full border px-2.5 py-1 text-[11px]', badge)}>
          {active ? 'ACTIVE' : 'OPEN'}
        </span>
      </div>
    </button>
  );
}

function ConfidenceMeter({
  value,
  label = 'Confidence',
}: {
  value: number | null; // 0..1
  label?: string;
}) {
  const pct = Math.max(0, Math.min(1, value ?? 0));
  const shown = value != null;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">{label}</div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-200">
          {shown ? `${Math.round(pct * 100)}%` : 'Waiting for coverage'}
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-black/30">
        <div
          className={cx(
            'h-full rounded-full',
            'transition-[width,opacity] duration-700 ease-out',
            shown ? 'opacity-100' : 'opacity-40',
          )}
          style={{
            width: `${Math.round(pct * 100)}%`,
            background:
              'linear-gradient(90deg, rgba(16,185,129,0.9), rgba(245,158,11,0.85), rgba(244,63,94,0.75))',
          }}
        />
      </div>

      <div className="mt-2 text-xs leading-relaxed text-zinc-500">
        Locus increases confidence only when verified coverage exists (transactions, cuts, velocity). No fake precision.
      </div>
    </div>
  );
}

/* ----------------------------- Truth Preview ----------------------------- */

function TruthCardPreview({ confidence }: { confidence: number | null }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-zinc-100">Truth Card</div>
          <div className="mt-1 text-xs leading-relaxed text-zinc-500">
            Preview only. Static until verified coverage is wired.
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200">
          PREVIEW
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">Overpricing</div>
            <span className={cx('rounded-full border px-2.5 py-1 text-[11px]', pillTone('bad'))}>+18%</span>
          </div>
          <div className="mt-2 text-xs leading-relaxed text-zinc-500">
            Above micro-market fair value. Downward pressure likely without a cut.
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">Time-to-sell</div>
            <span className={cx('rounded-full border px-2.5 py-1 text-[11px]', pillTone('warn'))}>94 days</span>
          </div>
          <div className="mt-2 text-xs leading-relaxed text-zinc-500">
            At current ask, expected to sit. Faster exit requires price alignment.
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">Leverage</div>
            <span className={cx('rounded-full border px-2.5 py-1 text-[11px]', pillTone('good'))}>Buyer +2</span>
          </div>
          <div className="mt-2 text-xs leading-relaxed text-zinc-500">
            Buyer has more options. Seller urgency not yet priced into the listing.
          </div>
        </div>
      </div>

      <div className="mt-4">
        <ConfidenceMeter value={confidence} />
      </div>
    </div>
  );
}

/* ----------------------------- Live Supply UI ---------------------------- */

type Listing = {
  id: string;
  title: string;
  sub: string;
  price: string;
  chip: { label: string; tone: 'neutral' | 'warn' | 'good' };
};

function ListingRow({ item }: { item: Listing }) {
  const chipCls =
    item.chip.tone === 'good'
      ? pillTone('good')
      : item.chip.tone === 'warn'
        ? pillTone('warn')
        : pillTone('neutral');

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-zinc-100">{item.title}</div>
        <div className="mt-1 truncate text-xs text-zinc-400">{item.sub}</div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className={cx('rounded-full border px-2.5 py-1 text-[11px]', chipCls)}>{item.chip.label}</span>
        <div className="text-sm font-semibold text-zinc-100">{item.price}</div>
      </div>
    </div>
  );
}

/**
 * Simple in-house virtualization (no libs)
 * - fixed row height
 * - renders only visible window + overscan
 */
function VirtualizedListings({
  items,
  rowHeight = 84,
  overscan = 6,
  heightClassName = 'h-[420px]',
}: {
  items: Listing[];
  rowHeight?: number;
  overscan?: number;
  heightClassName?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportH, setViewportH] = useState(420);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onScroll = () => setScrollTop(el.scrollTop);
    const onResize = () => setViewportH(el.clientHeight);

    onResize();
    el.addEventListener('scroll', onScroll, { passive: true });

    const ro = new ResizeObserver(() => onResize());
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, []);

  const total = items.length;
  const totalH = total * rowHeight;

  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(total, Math.ceil((scrollTop + viewportH) / rowHeight) + overscan);
  const slice = items.slice(start, end);

  return (
    <div
      ref={wrapRef}
      className={cx(
        'relative overflow-auto rounded-3xl border border-white/10 bg-black/20',
        heightClassName,
      )}
    >
      <div style={{ height: totalH }} className="relative">
        <div style={{ transform: `translateY(${start * rowHeight}px)` }} className="absolute left-0 right-0">
          <div className="grid gap-3 p-4">
            {slice.map((it) => (
              <ListingRow key={it.id} item={it} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveSupplyPanel({ listings }: { listings: Listing[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-100">Latest listings</div>
          <div className="mt-1 text-xs text-zinc-500">
            Supply layer preview. Final version shows source, last seen, and deduped identity.
          </div>
        </div>
        <span className={cx('rounded-full border px-2.5 py-1 text-[11px]', pillTone('good'))}>Updated 6 min ago</span>
      </div>

      <div className="mt-4">
        <VirtualizedListings
          items={listings}
          rowHeight={84}
          overscan={7}
          heightClassName="h-[380px] sm:h-[420px]"
        />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-zinc-500">
        Supply is complete and fast. Truth is conservative and locked. Both exist without conflict.
      </div>
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

function parseTab(s: string | null): TabKey | null {
  const v = String(s ?? '').toLowerCase();
  if (v === 'truth') return 'truth';
  if (v === 'supply') return 'supply';
  return null;
}

export default function CityPageClient({
  city,
  prev,
  next,
}: {
  city: CityLite;
  prev: NavLite;
  next: NavLite;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlTab = useMemo(() => parseTab(searchParams?.get('tab') ?? null), [searchParams]);

  const [tab, setTab] = useState<TabKey>(() => urlTab ?? 'truth');
  const [localTime, setLocalTime] = useState(() => formatLocalTime(city.tz));

  // "Confidence arrives" simulation - replace later with real data
  const [confidence, setConfidence] = useState<number | null>(null);

  // Keep local time fresh
  useEffect(() => {
    const update = () => setLocalTime(formatLocalTime(city.tz));
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, [city.tz]);

  // 1) URL -> state sync
  useEffect(() => {
    if (!urlTab) return;
    setTab(urlTab);
  }, [urlTab]);

  // 2) state -> URL sync (only when tab changes via clicks)
  function setTabAndUrl(nextTab: TabKey) {
    setTab(nextTab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', nextTab);
    router.replace(url.pathname + '?' + url.searchParams.toString());
  }

  // 3) React to TopBar's keyboard switching (locus:tab event)
  useEffect(() => {
    const onTab = (e: Event) => {
      const detail = (e as CustomEvent).detail as { tab?: TabKey } | undefined;
      if (!detail?.tab) return;
      setTabAndUrl(detail.tab);
    };
    window.addEventListener('locus:tab', onTab as any);
    return () => window.removeEventListener('locus:tab', onTab as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 4) Confidence animation placeholder (simulate "data arrived")
  useEffect(() => {
    let t: number | null = null;

    if (tab === 'truth') {
      setConfidence(null);
      t = window.setTimeout(() => {
        // placeholder preview value; replace with real computation later
        setConfidence(0.24);
      }, 650);
    } else {
      setConfidence(null);
    }

    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [tab]);

  const nodeId = useMemo(() => `LOCUS:${city.slug.toUpperCase()}`, [city.slug]);

  // Big list for virtualization demo (replace with real API later)
  const listings = useMemo<Listing[]>(() => {
    const base: Listing[] = [
      {
        id: 'a',
        title: '2 bed apartment, near center',
        sub: 'Active - Source: broker - Seen 6 min ago',
        price: '€740k',
        chip: { label: 'New', tone: 'good' },
      },
      {
        id: 'b',
        title: '3 bed family home, schools zone',
        sub: 'Active - Source: portal mirror - Seen 12 min ago',
        price: '€1.15M',
        chip: { label: 'Cut -3%', tone: 'warn' },
      },
      {
        id: 'c',
        title: '1 bed prime location',
        sub: 'Relisted - Source: public - Seen 22 min ago',
        price: '€520k',
        chip: { label: 'Relist', tone: 'neutral' },
      },
    ];

    // scale out to show virtualization working
    const out: Listing[] = [];
    for (let i = 0; i < 800; i += 1) {
      const src = i % 3;
      const seed = base[src];
      out.push({
        ...seed,
        id: `${seed.id}-${i}`,
        title: `${seed.title} #${i + 1}`,
      });
    }
    return out;
  }, []);

  const hero = (
    <section className="relative">
      {/* Full-bleed market surface background */}
      <div className="pointer-events-none absolute inset-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[520px] w-[1400px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[160px]" />
        <div className="absolute right-[-260px] top-[40px] h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:86px_86px]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_460px_at_50%_0%,rgba(0,0,0,0),rgba(0,0,0,0.52)_70%,rgba(0,0,0,0.88)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        <div className="pt-8 sm:pt-12 pb-10 sm:pb-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* HERO LEFT */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/90" />
                <span>Market surface</span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1 font-mono text-[11px] text-zinc-300">
                  {nodeId}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200">
                  Signals: initializing
                </span>
                <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[11px] text-amber-100">
                  Liquidity model: pending
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200">
                  Supply: live (soon)
                </span>
              </div>

              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
                {city.name}
                <span className="text-zinc-300"> market</span>
              </h1>

              <div className="mt-3 text-sm text-zinc-300">
                {city.country}
                {city.region ? ` · ${city.region}` : ''}
                {localTime ? ` · Local time ${localTime}` : ''}
              </div>

              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-200/90">
                {city.blurb ?? 'Truth-first market surface. Listings are the supply layer. Truth is computed on top.'}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <TabButton
                  active={tab === 'truth'}
                  onClick={() => setTabAndUrl('truth')}
                  title="Truth"
                  subtitle="Value, liquidity, pressure, risk. No paid boosts. No suppression."
                  tone="warn"
                />
                <TabButton
                  active={tab === 'supply'}
                  onClick={() => setTabAndUrl('supply')}
                  title="Live supply"
                  subtitle="Fresh listings and price changes with source provenance and deduping."
                  tone="good"
                />
              </div>

              <div className="mt-3 text-xs text-zinc-500">
                Tip: shareable view is URL-based. Example: {pathname}?tab={tab}
              </div>
            </div>

            {/* HERO RIGHT */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <div className="relative aspect-[16/9] w-full bg-zinc-950">
                  {city.image?.src ? (
                    <img
                      src={city.image.src}
                      alt={city.image.alt ?? `${city.name} image`}
                      className="absolute inset-0 h-full w-full object-cover opacity-90"
                      loading="eager"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-zinc-100">Surface status</div>
                    <span className={cx('rounded-full border px-2.5 py-1 text-[11px]', pillTone('good'))}>
                      Live UI
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs text-zinc-400">Truth</div>
                      <div className="mt-1 text-sm font-semibold text-amber-100">
                        {tab === 'truth' ? 'Active' : 'Standby'}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs text-zinc-400">Supply</div>
                      <div className="mt-1 text-sm font-semibold text-emerald-100">
                        {tab === 'supply' ? 'Active' : 'Standby'}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs text-zinc-400">Timezone</div>
                      <div className="mt-1 text-sm font-semibold text-zinc-100">{city.tz}</div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-zinc-500">
                    This page will always show the freshest supply, but truth outputs stay locked to reality.
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Link
                      href="/"
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
                      prefetch
                    >
                      Back to labs
                    </Link>
                    <div className="text-xs text-zinc-500">Node: {nodeId}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT BELOW HERO */}
          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {tab === 'truth' ? (
                <div className="grid gap-6">
                  <TruthCardPreview confidence={confidence} />

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                    <div className="text-sm font-semibold text-zinc-100">Truth layer notes</div>
                    <div className="mt-2 text-sm leading-relaxed text-zinc-300">
                      Truth is not a listing. It is computed output with an audit trail.
                      When coverage is incomplete, the system shows what it knows and refuses to fake certainty.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  <LiveSupplyPanel listings={listings} />
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <div className="text-sm font-semibold text-zinc-100">Navigate labs</div>
                <div className="mt-2 text-sm leading-relaxed text-zinc-300">
                  Move through market nodes. Each node becomes a truth surface and a live supply terminal.
                </div>

                <div className="mt-5 grid gap-3">
                  <Link
                    href={`/city/${prev.slug}?tab=${tab}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
                    prefetch
                  >
                    ← {prev.name}
                  </Link>

                  <Link
                    href={`/city/${next.slug}?tab=${tab}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
                    prefetch
                  >
                    {next.name} →
                  </Link>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-zinc-500">
                  Default is Truth. Live supply is always available, always sourced, always deduped.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return <PageShell fullBleedHero={hero}>{/* page body handled inside hero */}</PageShell>;
}
