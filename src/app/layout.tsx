// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

import ComingSoon from '@/components/ComingSoon';
import { jsonLd } from '@/lib/seo/seo.jsonld';
import { SEO_CONFIG } from '@/lib/seo/seo.config';

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.domain),

  title: {
    default: 'Vantera – Private Intelligence for the World’s Most Valuable Assets',
    template: '%s · Vantera',
  },

  description:
    'Private intelligence for the world’s most valuable assets. Truth-first real estate intelligence, listings, private sellers, and agent launchpads.',

  applicationName: 'Vantera',

  // ✅ FAVICONS (served from /public/brand)
  icons: {
    icon: [
      { url: '/brand/favicon.ico' },
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
      {
        url: '/brand/favicon-96x96.png',
        type: 'image/png',
        sizes: '96x96',
      },
    ],
    apple: [
      {
        url: '/brand/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
    shortcut: [{ url: '/brand/favicon.ico' }],
  },

  manifest: '/brand/site.webmanifest',

  // Mobile + PWA polish
  themeColor: '#0F1115',

  appleWebApp: {
    title: 'Vantera',
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isProd = process.env.NODE_ENV === 'production';
  const comingSoon = isProd && process.env.NEXT_PUBLIC_COMING_SOON === '1';

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vantera',
    url: SEO_CONFIG.domain,
    description:
      'Private intelligence for the world’s most valuable assets. Truth-first real estate intelligence built to model value, liquidity, and risk without noise.',
    publisher: {
      '@type': 'Organization',
      name: 'Vantera',
      url: SEO_CONFIG.domain,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SEO_CONFIG.domain}/listings?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <body>
        {jsonLd(websiteJsonLd)}
        {comingSoon ? <ComingSoon /> : children}
      </body>
    </html>
  );
}
