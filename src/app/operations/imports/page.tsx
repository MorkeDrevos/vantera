// src/app/operations/imports/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

type ImportRunStatus = 'queued' | 'running' | 'success' | 'error';

type ImportRun = {
  id: string;
  source: 'attom' | 'other';
  scope: 'cities' | 'properties';
  region: string;
  market?: string;
  status: ImportRunStatus;

  startedAt: string;
  finishedAt?: string;
  recordsIn?: number;
  recordsUpserted?: number;
  warnings?: number;

  message?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function fmtTime(iso?: string) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleString();
}

function StatusPill({ status }: { status: ImportRunStatus }) {
  const cls =
    status === 'success'
      ? 'border-emerald-300/25 bg-emerald-500/12 text-emerald-200'
      : status === 'error'
        ? 'border-rose-300/25 bg-rose-500/12 text-rose-200'
        : status === 'running'
          ? 'border-sky-300/25 bg-sky-500/12 text-sky-200'
          : 'border-zinc-300/15 bg-white/5 text-zinc-200';

  return (
    <span className={cx('inline-flex items-center rounded-full border px-2.5 py-1 text-xs', cls)}>
      {status}
    </span>
  );
}

export default function ImportsMonitorPage() {
  const [runs, setRuns] = useState<ImportRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

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

  async function seedTestRun() {
    setErr(null);
    try {
      await fetch('/api/ops/imports', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ source: 'attom', scope: 'cities', region: 'US-FL', market: 'Miami' }),
      });
      // refresh shortly after
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
    const running = runs.filter((r) => r.status === 'running').length;
    const failed = runs.filter((r) => r.status === 'error').length;
    return { running, failed };
  }, [runs]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-lg font-semibold">Imports</div>
          <p className="mt-1 text-sm text-zinc-300/90">
            Live monitor of ingestion runs. Auto-refreshes every few seconds.
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-300">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
              Running: <span className="text-white">{headline.running}</span>
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
              Failed: <span className="text-white">{headline.failed}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={load}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.06]"
          >
            Refresh
          </button>
          <button
            onClick={seedTestRun}
            className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white transition hover:bg-white/[0.10]"
          >
            Create test run
          </button>
        </div>
      </div>

      {err ? (
        <div className="rounded-2xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-200">
          {err}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-zinc-300">
              <tr>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Scope</th>
                <th className="px-4 py-3 font-medium">Region</th>
                <th className="px-4 py-3 font-medium">Market</th>
                <th className="px-4 py-3 font-medium">Started</th>
                <th className="px-4 py-3 font-medium">Finished</th>
                <th className="px-4 py-3 font-medium">In</th>
                <th className="px-4 py-3 font-medium">Upserted</th>
                <th className="px-4 py-3 font-medium">Warnings</th>
                <th className="px-4 py-3 font-medium">Message</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-zinc-400" colSpan={11}>
                    Loading…
                  </td>
                </tr>
              ) : runs.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-zinc-400" colSpan={11}>
                    No runs yet. Hit “Create test run”.
                  </td>
                </tr>
              ) : (
                runs.map((r) => (
                  <tr key={r.id} className="bg-black/10">
                    <td className="px-4 py-3">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-200">{r.source}</td>
                    <td className="px-4 py-3 text-zinc-200">{r.scope}</td>
                    <td className="px-4 py-3 text-zinc-200">{r.region}</td>
                    <td className="px-4 py-3 text-zinc-200">{r.market ?? '-'}</td>
                    <td className="px-4 py-3 text-zinc-300">{fmtTime(r.startedAt)}</td>
                    <td className="px-4 py-3 text-zinc-300">{fmtTime(r.finishedAt)}</td>
                    <td className="px-4 py-3 text-zinc-200">{r.recordsIn ?? '-'}</td>
                    <td className="px-4 py-3 text-zinc-200">{r.recordsUpserted ?? '-'}</td>
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

      <div className="text-xs text-zinc-500">
        Next: wire this to real import runs (Attom cities + properties), store runs in Prisma, and add filters
        (region, source, date range, failures only).
      </div>
    </div>
  );
}
