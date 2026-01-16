// src/app/luxury-real-estate/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

function goldGradient() {
  return 'linear-gradient(180deg, rgba(231,201,130,1) 0%, rgba(209,169,92,1) 45%, rgba(177,141,70,1) 100%)';
}

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          color: '#0b0c10',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        }}
      >
        {/* paper texture + micro grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(10,10,12,0.10) 1px, transparent 0), ' +
              'linear-gradient(to right, rgba(10,10,12,0.07) 1px, transparent 1px), ' +
              'linear-gradient(to bottom, rgba(10,10,12,0.07) 1px, transparent 1px), ' +
              'radial-gradient(1200px 520px at 50% 0%, rgba(0,0,0,0.04), transparent 62%)',
            backgroundSize: '28px 28px, 140px 140px, 140px 140px, 100% 100%',
            opacity: 0.9,
          }}
        />

        {/* gold aura */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 28% 18%, rgba(231,201,130,0.22), transparent 56%), ' +
              'radial-gradient(circle at 78% 78%, rgba(231,201,130,0.14), transparent 60%)',
          }}
        />

        {/* top + bottom hairlines */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 1,
            background: 'rgba(10,10,12,0.12)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 1,
            background: 'rgba(10,10,12,0.12)',
          }}
        />

        <div style={{ width: 980, display: 'flex', flexDirection: 'column', gap: 18, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(11,12,16,0.70)' }}>
              Vantera
            </div>
            <div style={{ fontSize: 12, letterSpacing: 2.2, textTransform: 'uppercase', color: 'rgba(11,12,16,0.55)' }}>
              vantera.io/luxury-real-estate
            </div>
          </div>

          <div style={{ fontSize: 60, fontWeight: 760, letterSpacing: -1.4, lineHeight: 1.03 }}>
            Luxury real estate{' '}
            <span
              style={{
                backgroundImage: goldGradient(),
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              with intelligence
            </span>
          </div>

          <div style={{ fontSize: 24, color: 'rgba(11,12,16,0.78)', lineHeight: 1.25, maxWidth: 900 }}>
            Truth-first market context for prime areas.
            <br />
            Pricing reality, liquidity signals, and clarity beyond listings.
          </div>

          <div style={{ marginTop: 6, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Truth Layer', 'Pricing reality', 'Liquidity signals', 'Private network'].map((t) => (
              <div
                key={t}
                style={{
                  padding: '10px 14px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.88)',
                  border: '1px solid rgba(10,10,12,0.12)',
                  fontSize: 14,
                  letterSpacing: 1.8,
                  textTransform: 'uppercase',
                  color: 'rgba(11,12,16,0.70)',
                }}
              >
                {t}
              </div>
            ))}
          </div>

          {/* subtle crown line */}
          <div style={{ marginTop: 10, height: 1, width: '100%', background: 'rgba(10,10,12,0.10)' }} />
          <div
            style={{
              marginTop: -1,
              height: 1,
              width: '100%',
              background: 'linear-gradient(to right, transparent, rgba(231,201,130,0.75), transparent)',
              opacity: 0.9,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
