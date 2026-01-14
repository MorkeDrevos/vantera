// src/app/(pillars)/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export default function Image({
  params,
}: {
  params: { slug: string };
}) {
  const title = params.slug.replace(/-/g, ' ');

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background:
            'radial-gradient(900px 420px at 20% 0%, rgba(232,190,92,0.18), transparent 55%), radial-gradient(900px 520px at 80% 10%, rgba(155,109,255,0.18), transparent 60%), #0B0D12',
          color: 'white',
          fontSize: 64,
          fontWeight: 750,
          letterSpacing: -1,
        }}
      >
        <div
          style={{
            fontSize: 18,
            opacity: 0.7,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          Vantera
        </div>

        <div style={{ marginTop: 14, lineHeight: 1.08 }}>
          {title}
        </div>

        <div style={{ marginTop: 18, fontSize: 22, opacity: 0.75 }}>
          Private intelligence for the world’s most valuable assets
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
