// src/app/operations/page.tsx
import Link from 'next/link';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function Card({ title, desc, href, badge }: { title: string; desc: string; href: string; badge?: string }) {
  return (
    <Link
      href={href}
      className={cx(
        'group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition',
        'hover:bg-white/[0.05] hover:border-white/15',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-base font-semibold text-white">{title}</div>
            {badge ? (
              <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] font-semibold tracking-[0.18em] text-white/70">
                {badge}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300/90">{desc}</p>
        </div>
        <div className="text-zinc-500 transition group-hover:text-zinc-200">→</div>
      </div>

      <div className="mt-5 h-px w-full bg-white/10" />
      <div className="mt-4 text-xs font-semibold tracking-[0.28em] text-white/45">OPEN</div>
    </Link>
  );
}

export default function OperationsHomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 text-white">
      <div className="mb-6">
        <div className="text-xs font-semibold tracking-[0.28em] text-white/50">OPERATIONS</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Control room</h1>
        <p className="mt-2 text-sm text-zinc-300/90">
          Internal tools for ingestion, media, and marketplace operations.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card
          title="Imports"
          badge="DATA"
          desc="Monitor ingestion runs, status, volumes, and errors for cities and properties."
          href="/operations/imports"
        />

        <Card
          title="Assets"
          badge="BLOB"
          desc="Upload hero videos, city images, and brand assets (Blob CDN)."
          href="/operations/assets"
        />

        <Card
          title="Media"
          badge="OPS"
          desc="Upload and manage hero media with a recent history panel."
          href="/operations/media"
        />
      </div>
    </div>
  );
}
