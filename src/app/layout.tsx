// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';

import AppChrome from '@/components/layout/AppChrome';

import { SEO_CONFIG } from '@/lib/seo/seo.config';
import { jsonLd, websiteJsonLd, organizationJsonLd } from '@/lib/seo/seo.jsonld';

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.domain),
  title: {
    default: 'Vantera',
    template: '%s · Vantera',
  },
  description:
    'Private intelligence for the world’s most valuable assets. Truth-first real estate intelligence, listings, private sellers and agent launchpad.',
  applicationName: 'Vantera',

  icons: {
    icon: [
      { url: '/images/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/brand/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/images/brand/web-app-manifest-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/images/brand/web-app-manifest-512x512.png', type: 'image/png', sizes: '512x512' },
      { url: '/images/brand/favicon.ico' },
    ],
    apple: [{ url: '/images/brand/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/images/brand/favicon.ico' }],
  },

  manifest: '/images/brand/site.webmanifest',

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
      target: `${SEO_CONFIG.domain}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const org = organizationJsonLd();

  return (
    <html lang="en" className="h-full bg-white antialiased scroll-smooth" suppressHydrationWarning>
      <body className="min-h-[100dvh] bg-white text-slate-950 selection:bg-black/10 selection:text-slate-950">
        {jsonLd(site)}
        {jsonLd(org)}

        <div id="__vantera" className="min-h-[100dvh] bg-white">
          <AppChrome>{children}</AppChrome>
        </div>
      </body>
    </html>
  );
}
