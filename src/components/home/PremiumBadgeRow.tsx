// src/components/home/PremiumBadgeRow.tsx
export default function PremiumBadgeRow() {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200">
        Truth-first
      </span>
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200">
        Private sellers
      </span>
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200">
        Verified layer
      </span>
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-zinc-200">
        Miami first
      </span>
    </div>
  );
}
