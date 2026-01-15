// src/lib/ops/importRunsStore.ts
// NOTE: In-memory store for dev/testing. We will replace with Prisma after you paste schema.prisma.

export type ImportRunStatus = 'queued' | 'running' | 'success' | 'error';

export type ImportRun = {
  id: string;
  source: 'attom' | 'other';
  scope: 'cities' | 'properties';
  region: string; // e.g. "US-FL", "EU-ES"
  market?: string; // e.g. "Miami"
  status: ImportRunStatus;

  startedAt: string; // ISO
  finishedAt?: string; // ISO
  recordsIn?: number;
  recordsUpserted?: number;
  warnings?: number;

  message?: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __VANTERA_IMPORT_RUNS__: ImportRun[] | undefined;
}

function getStore(): ImportRun[] {
  if (!globalThis.__VANTERA_IMPORT_RUNS__) globalThis.__VANTERA_IMPORT_RUNS__ = [];
  return globalThis.__VANTERA_IMPORT_RUNS__;
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function listImportRuns(limit = 50): ImportRun[] {
  const store = getStore();
  return store.slice(-limit).reverse();
}

export function createImportRun(partial: Omit<ImportRun, 'id'>): ImportRun {
  const store = getStore();
  const run: ImportRun = { id: uid(), ...partial };
  store.push(run);
  return run;
}

export function updateImportRun(id: string, patch: Partial<ImportRun>): ImportRun | null {
  const store = getStore();
  const i = store.findIndex((r) => r.id === id);
  if (i === -1) return null;
  store[i] = { ...store[i], ...patch };
  return store[i];
}
