// src/components/listings/ListingActions.tsx
import type { Listing } from '@prisma/client';

export default function ListingActions({ listing }: { listing: Listing }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="text-[12px] uppercase tracking-[0.16em] text-white/55">Actions</div>

      <div className="mt-4 grid gap-3">
        <button
          type="button"
          className="rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white hover:bg-white/[0.10]"
        >
          Save to private list
        </button>

        <button
          type="button"
          className="rounded-2xl border border-[#d7b86a]/30 bg-[#d7b86a]/10 px-5 py-3 text-sm font-medium text-[#f4e1a6] hover:bg-[#d7b86a]/15"
        >
          Request intelligence report
        </button>

        <div className="pt-2 text-xs leading-5 text-white/55">
          Listing: {listing.slug}
        </div>
      </div>
    </section>
  );
}
