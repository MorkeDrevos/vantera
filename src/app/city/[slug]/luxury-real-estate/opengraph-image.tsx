// src/app/city/[slug]/luxury-real-estate/opengraph-image.tsx
import { ImageResponse } from 'next/og';

import { CITIES } from '@/components/home/cities';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function OpenGraphImage({ params }: { params: { slug: string } }) {
  const city = CITIES.find((c) => c.slug === params.slug);

  const cityName = city?.name ?? params.slug;
  const subtitle = [city?.region, city?.country].filter(Boolean).join(', ');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(circle at 30% 20%, rgba(232,190,92,0.20), transparent 55%), radial-gradient(circle at 75% 75%, rgba(155,109,255,0.18), transparent 60%), #06060a',
          color: 'white',
        }}
      >
        <div style={{ width: 980, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 18, opacity: 0.85, letterSpacing: 2, textTransform: 'uppercase' }}>
            Vantera
          </div>

          <div style={{ fontSize: 62, fontWeight: 760, letterSpacing: -1, lineHeight: 1.05 }}>
            Luxury Real Estate for Sale
          </div>

          <div style={{ fontSize: 34, fontWeight: 700, opacity: 0.96, lineHeight: 1.1 }}>
            {cityName}
          </div>

          <div style={{ fontSize: 22, opacity: 0.85 }}>
            {subtitle || 'Real value, liquidity, and market truth'}
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Prime areas', 'Pricing reality', 'Liquidity signals', 'Truth-first listings'].map((t) => (
              <div
                key={t}
                style={{
                  padding: '10px 14px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontSize: 16,
                  opacity: 0.92,
                }}
              >
                {t}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 6, fontSize: 16, opacity: 0.75 }}>
            vantera.io/city/{params.slug}/luxury-real-estate
          </div>
        </div>
      </div>
    ),
    size
  );
}
