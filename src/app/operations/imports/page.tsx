// src/app/operations/imports/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

type ImportRunStatus = 'queued' | 'running' | 'success' | 'error';

type ImportRun = {
  id: string;
  source: 'attom' | 'other' | string;
  scope: 'cities' | 'properties' | string;
  region: string;
  market?: string;
  status: ImportRunStatus | string;

  startedAt: string;
  finishedAt?: string;

  recordsIn?: number;
  recordsUpserted?: number;

  // Optional richer fields if your API returns them (safe to ignore otherwise)
  scanned?: number;
  created?: number;
  skipped?: number;
  errors?: number;

  warnings?: number;
  message?: string;

  params?: any;
  breakdown?: any;
  errorSamples?: Array<{ step?: string; message?: string }>;
};

type Pipeline = {
  key: string;
  title: string;
  badge: string;
  description: string;
  enabledByDefault?: boolean;
  defaults: Array<{ k: string; v: string }>;
  runUrl: string;
  dryRunUrl?: string;
  note?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function fmtTime(iso?: string) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return '-';
  return d.toLocaleString();
}

function msToCompact(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return '-';
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  return `${h}h`;
}

function durationForRun(r: ImportRun) {
  const a = new Date(r.startedAt).getTime();
  const b = r.finishedAt ? new Date(r.finishedAt).getTime() : Date.now();
  if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return '-';
  return msToCompact(b - a);
}

function normalizeStatus(s: string): ImportRunStatus {
  const v = (s || '').toLowerCase();
  if (v === 'running') return 'running';
  if (v === 'queued') return 'queued';
  if (v === 'success' || v === 'succeeded') return 'success';
  if (v === 'error' || v === 'failed') return 'error';
  return 'queued';
}

function StatusPill({ status }: { status: ImportRunStatus | string }) {
  const s = normalizeStatus(String(status));
  const cls =
    s === 'success'
      ? 'border-emerald-300/25 bg-emerald-500/12 text-emerald-200'
      : s === 'error'
        ? 'border-rose-300/25 bg-rose-500/12 text-rose-200'
        : s === 'running'
          ? 'border-sky-300/25 bg-sky-500/12 text-sky-200'
          : 'border-zinc-300/15 bg-white/5 text-zinc-200';

  return (
    <span className={cx('inline-flex items-center rounded-full border px-2.5 py-1 text-xs', cls)}>
      {s}
    </span>
  );
}

function Chip({ k, v }: { k: string; v: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-200">
      <span className="text-zinc-400">{k}</span>
      <span className="text-white">{v}</span>
    </span>
  );
}

function JsonBox({ value }: { value: any }) {
  const text = useMemo(() => {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }, [value]);

  return (
    <pre className="max-h-[340px] overflow-auto rounded-2xl border border-white/10 bg-black/30 p-3 text-xs text-zinc-200">
      {text}
    </pre>
  );
}

export default function ImportsMonitorPage() {
  const [runs, setRuns] = useState<ImportRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Filters (client-side for now)
  const [q, setQ] = useState('');
  const [fStatus, setFStatus] = useState<'all' | ImportRunStatus>('all');
  const [fSource, setFSource] = useState<'all' | string>('all');
  const [fScope, setFScope] = useState<'all' | string>('all');

  // Run detail
  const [openId, setOpenId] = useState<string | null>(null);

  const PIPELINES: Pipeline[] = useMemo(
    () => [
      {
        key: 'attom-properties-marbella',
        title: 'ATTOM - Properties',
        badge: 'Luxury gate',
        description: 'Ingest properties with strict filters for Vantera luxury inventory.',
        defaults: [
          { k: 'residential', v: 'only' },
          { k: 'min', v: '$2,000,000' },
          { k: 'city', v: 'Marbella (Costa del Sol)' },
          { k: 'radius', v: '12mi' },
          { k: 'limit', v: '25' },
        ],
        // NOTE: route.ts expects minAvm (not minValue)
        runUrl: '/api/attom/ingest/properties?city=marbella&radius=12&limit=25&minAvm=2000000',
        dryRunUrl: '/api/attom/ingest/properties?city=marbella&radius=12&limit=25&minAvm=2000000&dryRun=1',
        note: 'Uses AVM or assessment market value to enforce the 2m gate. Benahavis + Estepona are collapsed under Marbella.',
      },
      {
        key: 'attom-cities-global',
        title: 'ATTOM - Cities',
        badge: 'Foundation',
        description: 'Canonical cities ingest (from cities.ts). Creates/updates city rows used by all imports.',
        defaults: [
          { k: 'market', v: 'GLOBAL (all cities)' },
          { k: 'region', v: 'All regions' },
        ],
        // Cities ingest is not per-city - it ingests the full canonical list
        runUrl: '/api/attom/ingest/cities',
        dryRunUrl: '/api/attom/ingest/cities?dryRun=1',
        note: 'This ingests all canonical cities and locks Costa del Sol to Marbella.',
      },
    ],
    [],
  );

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/ops/imports', { cache: 'no-store' });
      const json = await res.json();
      if (!json?.ok) throw new Error('API returned not ok');
      setRuns(json.runs ?? []);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  async function runPipeline(url: string) {
    setErr(null);
    try {
      await fetch(url, { method: 'GET', cache: 'no-store' });
      setTimeout(load, 250);
      setTimeout(load, 1200);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to run pipeline');
    }
  }

  async function seedTestRun() {
    setErr(null);
    try {
      await fetch('/api/ops/imports', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          source: 'vantera',
          scope: 'cities',
          region: 'GLOBAL',
          market: 'Cities',
        }),
      });
      setTimeout(load, 250);
      setTimeout(load, 1100);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to create test run');
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headline = useMemo(() => {
    const running = runs.filter((r) => normalizeStatus(String(r.status)) === 'running').length;
    const failed = runs.filter((r) => normalizeStatus(String(r.status)) === 'error').length;
    return { running, failed };
  }, [runs]);

  const sources = useMemo(() => {
    const s = new Set<string>();
    for (const r of runs) s.add(String(r.source || 'unknown'));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [runs]);

  const scopes = useMemo(() => {
    const s = new Set<string>();
    for (const r of runs) s.add(String(r.scope || 'unknown'));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [runs]);

  const filteredRuns = useMemo(() => {
    const query = q.trim().toLowerCase();

    const list = [...runs].sort((a, b) => {
      const ta = new Date(a.startedAt).getTime();
      const tb = new Date(b.startedAt).getTime();
      return (Number.isFinite(tb) ? tb : 0) - (Number.isFinite(ta) ? ta : 0);
    });

    return list.filter((r) => {
      const st = normalizeStatus(String(r.status));
      if (fStatus !== 'all' && st !== fStatus) return false;
      if (fSource !== 'all' && String(r.source) !== fSource) return false;
      if (fScope !== 'all' && String(r.scope) !== fScope) return false;

      if (!query) return true;
      const hay = [
        r.id,
        r.source,
        r.scope,
        r.region,
        r.market ?? '',
        r.message ?? '',
        fmtTime(r.startedAt),
      ]
        .join(' ')
        .toLowerCase();

      return hay.includes(query);
    });
  }, [runs, q, fStatus, fSource, fScope]);

  const openRun = useMemo(() => filteredRuns.find((r) => r.id === openId) ?? null, [filteredRuns, openId]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),rgba(255,255,255,0.02),transparent_70%)]" />
          <div className="absolute -bottom-44 right-[-160px] h-[420px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.10),rgba(56,189,248,0.03),transparent_70%)]" />
        </div>

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-white">Imports</div>
            <p className="mt-1 text-sm text-zinc-300/90">
              Control room for ingestion pipelines. Run, monitor, and audit imports from one place.
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-300">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
                Running: <span className="text-white">{headline.running}</span>
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
                Failed: <span className="text-white">{headline.failed}</span>
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
                Auto-refresh: <span className="text-white">4s</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={load}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.06]"
            >
              Refresh
            </button>
            <button
              onClick={seedTestRun}
              className="rounded-2xl border border-white/10 bg-white/[0.06] px-3.5 py-2 text-sm text-white transition hover:bg-white/[0.10]"
            >
              Create test run
            </button>
          </div>
        </div>
      </div>

      {err ? (
        <div className="rounded-2xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-200">
          {err}
        </div>
      ) : null}

      {/* Pipelines */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white">Pipelines</div>
            <div className="mt-1 text-xs text-zinc-400">
              Defaults are locked for quality. Residential only and minimum 2m is enforced.
            </div>
          </div>
          <div className="text-xs text-zinc-500">Setup table (DB-backed) comes next.</div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {PIPELINES.map((p) => (
            <div
              key={p.key}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-4"
            >
              <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute -top-24 -left-16 h-52 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),rgba(255,255,255,0.02),transparent_70%)]" />
              </div>

              <div className="relative flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-white">{p.title}</div>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-200">
                        {p.badge}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-zinc-400">{p.description}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => runPipeline(p.runUrl)}
                      className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-white transition hover:bg-white/[0.10]"
                      title="Run now"
                    >
                      Run now
                    </button>
                    <button
                      onClick={() => runPipeline(p.dryRunUrl || p.runUrl)}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-200 transition hover:bg-white/[0.06]"
                      title="Dry run"
                    >
                      Dry run
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {p.defaults.map((d) => (
                    <Chip key={`${p.key}-${d.k}`} k={d.k} v={d.v} />
                  ))}
                </div>

                {p.note ? <div className="text-xs text-zinc-500">{p.note}</div> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Runs header + filters */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Runs</div>
            <div className="mt-1 text-xs text-zinc-400">Live monitor of import runs. Click a row for details.</div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search runs…"
                className="h-10 w-full rounded-2xl border border-white/10 bg-black/30 px-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-500 focus:border-white/20 sm:w-[260px]"
              />
            </div>

            <select
              value={fStatus}
              onChange={(e) => setFStatus(e.target.value as any)}
              className="h-10 rounded-2xl border border-white/10 bg-black/30 px-3 text-sm text-zinc-200 outline-none focus:border-white/20"
            >
              <option value="all">All statuses</option>
              <option value="running">Running</option>
              <option value="queued">Queued</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </select>

            <select
              value={fSource}
              onChange={(e) => setFSource(e.target.value)}
              className="h-10 rounded-2xl border border-white/10 bg-black/30 px-3 text-sm text-zinc-200 outline-none focus:border-white/20"
            >
              <option value="all">All sources</option>
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={fScope}
              onChange={(e) => setFScope(e.target.value)}
              className="h-10 rounded-2xl border border-white/10 bg-black/30 px-3 text-sm text-zinc-200 outline-none focus:border-white/20"
            >
              <option value="all">All scopes</option>
              {scopes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setQ('');
                setFStatus('all');
                setFSource('all');
                setFScope('all');
              }}
              className="h-10 rounded-2xl border border-white/10 bg-white/[0.03] px-3 text-sm text-zinc-200 transition hover:bg-white/[0.06]"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Runs table */}
        <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-zinc-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Scope</th>
                  <th className="px-4 py-3 font-medium">Region</th>
                  <th className="px-4 py-3 font-medium">Market</th>
                  <th className="px-4 py-3 font-medium">Started</th>
                  <th className="px-4 py-3 font-medium">Finished</th>
                  <th className="px-4 py-3 font-medium">Dur</th>
                  <th className="px-4 py-3 font-medium">In</th>
                  <th className="px-4 py-3 font-medium">Upserted</th>
                  <th className="px-4 py-3 font-medium">Warnings</th>
                  <th className="px-4 py-3 font-medium">Message</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                    <td className="px-4 py-4 text-zinc-400" colSpan={12}>
                      Loading…
                    </td>
                  </tr>
                ) : filteredRuns.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-zinc-400" colSpan={12}>
                      No runs match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredRuns.map((r) => (
                    <tr
                      key={r.id}
                      className="cursor-pointer bg-black/10 transition hover:bg-white/[0.03]"
                      onClick={() => setOpenId(r.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <td className="px-4 py-3">
                        <StatusPill status={r.status} />
                      </td>
                      <td className="px-4 py-3 text-zinc-200">{String(r.source)}</td>
                      <td className="px-4 py-3 text-zinc-200">{String(r.scope)}</td>
                      <td className="px-4 py-3 text-zinc-200">{r.region}</td>
                      <td className="px-4 py-3 text-zinc-200">{r.market ?? '-'}</td>
                      <td className="px-4 py-3 text-zinc-300">{fmtTime(r.startedAt)}</td>
                      <td className="px-4 py-3 text-zinc-300">{fmtTime(r.finishedAt)}</td>
                      <td className="px-4 py-3 text-zinc-200">{durationForRun(r)}</td>
                      <td className="px-4 py-3 text-zinc-200">{r.recordsIn ?? r.scanned ?? '-'}</td>
                      <td className="px-4 py-3 text-zinc-200">{r.recordsUpserted ?? r.created ?? '-'}</td>
                      <td className="px-4 py-3 text-zinc-200">{r.warnings ?? '-'}</td>
                      <td className="px-4 py-3 text-zinc-300">
                        <span className="line-clamp-1">{r.message ?? '-'}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3 text-xs text-zinc-500">
          Next: store pipeline definitions in Prisma, add schedules, and wire run detail fetch for full params and
          breakdown.
        </div>
      </div>

      {/* Run detail drawer */}
      {openRun ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpenId(null)}
            role="button"
            tabIndex={0}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-[560px] overflow-hidden border-l border-white/10 bg-[#0a0b0f]">
            <div className="h-full overflow-y-auto p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-white">Run details</div>
                    <StatusPill status={openRun.status} />
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">
                    {String(openRun.source)} / {String(openRun.scope)} / {openRun.region}
                    {openRun.market ? ` / ${openRun.market}` : ''}
                  </div>
                </div>

                <button
                  onClick={() => setOpenId(null)}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-200 transition hover:bg-white/[0.06]"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Chip k="started" v={fmtTime(openRun.startedAt)} />
                <Chip k="finished" v={fmtTime(openRun.finishedAt)} />
                <Chip k="duration" v={durationForRun(openRun)} />
                <Chip k="id" v={openRun.id.slice(0, 10)} />
              </div>

              <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs font-semibold text-white">Counters</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-zinc-300">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-zinc-400">in</div>
                    <div className="mt-1 text-base text-white">{openRun.recordsIn ?? openRun.scanned ?? '-'}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-zinc-400">upserted</div>
                    <div className="mt-1 text-base text-white">
                      {openRun.recordsUpserted ?? openRun.created ?? '-'}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-zinc-400">skipped</div>
                    <div className="mt-1 text-base text-white">{openRun.skipped ?? '-'}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-zinc-400">errors</div>
                    <div className="mt-1 text-base text-white">{openRun.errors ?? '-'}</div>
                  </div>
                </div>

                {openRun.message ? (
                  <div className="mt-3 text-xs text-zinc-300">
                    <div className="text-zinc-400">message</div>
                    <div className="mt-1">{openRun.message}</div>
                  </div>
                ) : null}
              </div>

              {openRun.params != null ? (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-white">Params</div>
                  <div className="mt-2">
                    <JsonBox value={openRun.params} />
                  </div>
                </div>
              ) : null}

              {openRun.breakdown != null ? (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-white">Breakdown</div>
                  <div className="mt-2">
                    <JsonBox value={openRun.breakdown} />
                  </div>
                </div>
              ) : null}

              {openRun.errorSamples && openRun.errorSamples.length ? (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-white">Error samples</div>
                  <div className="mt-2 space-y-2">
                    {openRun.errorSamples.slice(0, 8).map((e, idx) => (
                      <div
                        key={`${openRun.id}-err-${idx}`}
                        className="rounded-2xl border border-rose-300/20 bg-rose-500/10 p-3 text-xs text-rose-100"
                      >
                        <div className="text-rose-200/80">{e.step ?? 'error'}</div>
                        <div className="mt-1 text-rose-100/90">{e.message ?? '-'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-5 text-xs text-zinc-500">
                Next: add a dedicated run endpoint to fetch full run payload by id and include skip breakdown for
                ATTOM luxury gates.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
