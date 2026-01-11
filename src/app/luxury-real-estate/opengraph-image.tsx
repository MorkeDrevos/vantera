// src/app/luxury-real-estate/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function OpenGraphImage() {
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

          <div style={{ fontSize: 24, opacity: 0.88, lineHeight: 1.25 }}>
            Truth-first market intelligence for prime areas.
            <br />
            Real value signals, liquidity reality, and pricing context beyond listings.
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

          <div style={{ marginTop: 6, fontSize: 16, opacity: 0.75 }}>vantera.io/luxury-real-estate</div>
        </div>
      </div>
    ),
    size
  );
}
