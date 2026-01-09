// src/components/layout/Footer.tsx
'use client';

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pb-10 pt-10 text-xs text-zinc-500 sm:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} Locus</div>
        <div className="text-zinc-600">
          Early build. UI is live. Intelligence layers evolve city by city.
        </div>
      </div>
    </footer>
  );
}
