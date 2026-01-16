// src/components/listings/MediaStrip.tsx
import Image from 'next/image';
import type { ListingMedia } from '@prisma/client';

export default function MediaStrip({ media }: { media: ListingMedia[] }) {
  const images = (media || []).filter((m) => (m.kind || 'image') === 'image' && !!m.url);

  if (!images.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/65">
        Media is not available yet.
      </div>
    );
  }

  return (
    <div>
      <div className="text-[12px] uppercase tracking-[0.16em] text-white/55">Media</div>

      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {images.map((m) => (
          <div
            key={m.id}
            className="relative h-[180px] w-[300px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
          >
            <Image
              src={m.url}
              alt={m.alt || 'Property image'}
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
