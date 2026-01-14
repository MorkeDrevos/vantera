// src/app/(pillars)/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';

import { KEYWORD_PILLARS } from '@/lib/seo/keyword-pillars';

export const runtime = 'edge';

export async function generateStaticParams() {
  return KEYWORD_PILLARS.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pillar = KEYWORD_PILLARS.find((p) => p.slug === slug);
  if (!pillar) return notFound();

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background: '#06060a',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 22, opacity: 0.8 }}>Vantera</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 62, fontWeight: 700, letterSpacing: -1 }}>
            {pillar.phrase}
          </div>
          <div style={{ fontSize: 26, opacity: 0.85, maxWidth: 950, lineHeight: 1.3 }}>
            Private intelligence for the world’s most valuable assets.
          </div>
          <div style={{ fontSize: 20, opacity: 0.7 }}>
            Truth-first pricing signals, liquidity reality, and risk context.
          </div>
        </div>

        <div style={{ fontSize: 18, opacity: 0.7 }}>
          vantera.io
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
