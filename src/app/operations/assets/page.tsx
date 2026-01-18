// src/app/operations/assets/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Uploaded = {
  url: string;
  pathname: string;
  size?: number;
  contentType?: string;
};

type RecentItem = {
  url: string;
  pathname: string;
  contentType?: string;
  size?: number;
  uploadedAt: string;
};

const LS_KEY = 'vantera_ops_assets_recent_v1';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function loadRecent(): RecentItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 50);
  } catch {
    return [];
  }
}

function saveRecent(items: RecentItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items.slice(0, 50)));
  } catch {
    // ignore
  }
}

function prettyMB(n?: number) {
  if (typeof n !== 'number') return '';
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export default function AssetsPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [blob, setBlob] = useState<Uploaded | null>(null);
  const [recent, setRecent] = useState<RecentItem[]>([]);

  useEffect(() => setRecent(loadRecent()), []);

  const accept = useMemo(() => 'video/mp4,video/webm,image/jpeg,image/png,image/webp', []);

  async function upload(file: File) {
    setErr(null);
    setBlob(null);
    setBusy(true);

    try {
      const res = await fetch(`/operations/assets/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        headers: {
          'content-type': file.type || 'application/octet-stream',
        },
        body: file,
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `Upload failed (${res.status})`);
      }

      const j = (await res.json()) as Uploaded;
      setBlob(j);

      const next: RecentItem = {
        url: j.url,
        pathname: j.pathname,
        contentType: file.type || j.contentType,
        size: file.size || j.size,
        uploadedAt: new Date().toISOString(),
      };

      const updated = [next, ...loadRecent()].slice(0, 50);
      setRecent(updated);
      saveRecent(updated);

      if (inputRef.current) inputRef.current.value = '';
    } catch (e: any) {
      setErr(e?.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 text-white">
      <div className="mb-6">
        <div className="text-xs font-semibold tracking-[0.28em] text-white/50">OPERATIONS</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Assets</h1>
        <p className="mt-2 text-sm text-zinc-300/90">
          Upload hero videos, city imagery, and brand assets to Vercel Blob.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm font-semibold">Choose a file</div>
            <div className="mt-2">
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                }}
                disabled={busy}
                className={cx(
                  'block w-full cursor-pointer rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-200',
                  'file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/15',
                  busy && 'opacity-70 cursor-not-allowed',
                )}
              />
            </div>

            <div className="mt-2 text-xs text-white/45">
              Auto-routing:
              <span className="ml-2 text-white/70">video</span> -> <span className="text-white/70">hero/homepage/</span>,
              <span className="ml-2 text-white/70">image</span> -> <span className="text-white/70">images/heroes/</span>,
              <span className="ml-2 text-white/70">other</span> -> <span className="text-white/70">assets/</span>
            </div>
          </div>

          {busy ? (
            <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
              Uploading...
            </div>
          ) : null}

          {err ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {err}
            </div>
          ) : null}

          {blob ? (
            <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-4">
              <div className="text-sm font-semibold">Uploaded</div>

              <div className="mt-3 grid gap-2">
                <div className="text-xs text-white/50">Path</div>
                <div className="break-all text-sm text-white/90">{blob.pathname}</div>

                <div className="mt-2 text-xs text-white/50">URL</div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <a href={blob.url} target="_blank" rel="noreferrer" className="break-all text-sm text-white/90 underline">
                    {blob.url}
                  </a>
                  <button
                    type="button"
                    onClick={() => copy(blob.url)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                  >
                    Copy URL
                  </button>
                </div>

                <div className="mt-3 text-xs text-white/45">
                  Quick use:
                  <span className="ml-2 rounded bg-white/10 px-2 py-1 font-mono text-[11px] text-white/85">
                    {blob.url}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/operations"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/[0.04]"
            >
              Back to Operations
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">Recent uploads</div>
            <div className="mt-1 text-xs text-white/45">Stored locally in this browser.</div>
          </div>

          <button
            type="button"
            onClick={() => {
              setRecent([]);
              saveRecent([]);
            }}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
          >
            Clear
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          {recent.length ? (
            recent.map((r) => (
              <div key={r.url} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-xs text-white/50">Pathname</div>
                    <div className="mt-1 break-all text-sm text-white/90">{r.pathname}</div>
                    <div className="mt-2 text-xs text-white/45">
                      {r.contentType || 'unknown'}
                      {r.size ? ` • ${prettyMB(r.size)}` : ''}
                      {' • '}
                      {new Date(r.uploadedAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                    >
                      Open
                    </a>
                    <button
                      type="button"
                      onClick={() => copy(r.url)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-black/10 p-6 text-sm text-white/45">
              No uploads yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
