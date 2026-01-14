// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

import { SEO_CONFIG } from '@/lib/seo/seo.config';
import { jsonLd, websiteJsonLd, organizationJsonLd } from '@/lib/seo/seo.jsonld';

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
      { url: '/brand/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180' }],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Global schemas (1 script tag each)
  const site = {
    ...websiteJsonLd(),
    // Add SearchAction at the WebSite level (helps Google understand your internal search)
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SEO_CONFIG.domain}/listings?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const org = organizationJsonLd();

  return (
    <html lang="en">
      <body>
        {jsonLd(site)}
        {jsonLd(org)}
        {children}
      </body>
    </html>
  );
}
