// src/components/listings/FactsRow.tsx
import type { Listing } from '@prisma/client';

function sqftToM2Int(sqft?: number | null) {
  if (sqft == null) return null;
  return Math.round(sqft * 0.092903);
}

function Fact({ k, v }: { k: string; v: string | null }) {
  if (!v) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.16em] text-white/55">{k}</div>
      <div className="mt-1 text-[15px] font-medium text-white/85">{v}</div>
    </div>
  );
}

export default function FactsRow({ listing }: { listing: Listing }) {
  const builtM2 = listing.builtM2 ?? sqftToM2Int(listing.builtSqft);
  const plotM2 = listing.plotM2 ?? sqftToM2Int(listing.plotSqft);

  const facts: Array<{ k: string; v: string | null }> = [
    { k: 'Bedrooms', v: listing.bedrooms != null ? String(listing.bedrooms) : null },
    { k: 'Bathrooms', v: listing.bathrooms != null ? String(listing.bathrooms) : null },
    { k: 'Interior', v: builtM2 != null ? `${builtM2.toLocaleString('en-US')} m²` : null },
    { k: 'Plot', v: plotM2 != null ? `${plotM2.toLocaleString('en-US')} m²` : null },
    { k: 'Type', v: listing.propertyType ? titleCase(listing.propertyType) : null },
    { k: 'Source', v: listing.source ? listing.source.toUpperCase() : null },
  ];

  return <div className="grid grid-cols-6 gap-3">{facts.map((f) => <Fact key={f.k} k={f.k} v={f.v} />)}</div>;
}

function titleCase(s: string) {
  return s
    .split(/[\s_-]+/g)
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
