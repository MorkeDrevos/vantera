// src/app/operations/page.tsx
import Link from 'next/link';

function Card({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-base font-semibold">{title}</div>
          <p className="mt-2 text-sm text-zinc-300/90">{desc}</p>
        </div>
        <div className="text-zinc-500 transition group-hover:text-zinc-300">→</div>
      </div>
    </Link>
  );
}

export default function OperationsHomePage() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Card
        title="Imports"
        desc="Monitor ingestion runs, status, volumes, and errors for cities and properties."
        href="/operations/imports"
      />
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="text-base font-semibold">Next</div>
        <p className="mt-2 text-sm text-zinc-300/90">
          We can add “Data Health”, “Queues”, and “Coverage” pages once imports are stable.
        </p>
      </div>
    </div>
  );
}
