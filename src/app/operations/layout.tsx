// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';

import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

import { SEO_CONFIG } from '@/lib/seo/seo.config';
import { jsonLd, websiteJsonLd, organizationJsonLd } from '@/lib/seo/seo.jsonld';

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.domain),

  title: {
    default: 'Vantera · World’s Largest Luxury Marketplace',
    template: '%s · Vantera',
  },

  description:
    'World’s Largest Luxury Marketplace for €2M+ properties. Curated globally, presented with editorial-grade precision.',

  applicationName: 'Vantera',

  // Favicons (served from /public/brand)
  icons: {
    icon: [
      { url: '/brand/favicon.ico' },
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/brand/favicon.ico' }],
  },

  manifest: '/brand/site.webmanifest',

  appleWebApp: {
    title: 'Vantera',
    capable: true,
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = {
    ...websiteJsonLd(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SEO_CONFIG.domain}/marketplace?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const org = organizationJsonLd();

  return (
    <html
      lang="en"
      className="h-full bg-white antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <body className="min-h-[100dvh] bg-white text-slate-950 selection:bg-black/10 selection:text-slate-950">
        {jsonLd(site)}
        {jsonLd(org)}

        {/* App root */}
        <div id="__vantera" className="min-h-[100dvh] bg-white">
          <Suspense fallback={null}>
            <TopBar />
          </Suspense>

          {children}

          <Footer />
        </div>
      </body>
    </html>
  );
}
