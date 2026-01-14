// src/app/(pillars)/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export default function Image({ params }: { params: { slug: string } }) {
  const title = params.slug.replace(/-/g, ' ');

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0B0D12',
          color: 'white',
          fontSize: 64,
          fontWeight: 750,
          letterSpacing: -1,
          padding: '72px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 18, opacity: 0.7, letterSpacing: 3, textTransform: 'uppercase' }}>
          Vantera
        </div>
        <div style={{ marginTop: 14, lineHeight: 1.08 }}>{title}</div>
        <div style={{ marginTop: 18, fontSize: 22, opacity: 0.75 }}>
          Private intelligence for the world’s most valuable assets
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
