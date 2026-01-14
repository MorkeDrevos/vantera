// src/app/(pillars)/[slug]/opengraph-image.tsx

export const runtime = 'edge';

import { ImageResponse } from 'next/og';

export default function Image({ params }: { params: { slug: string } }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0B0D12',
          color: 'white',
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        {params.slug.replace(/-/g, ' ')}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
