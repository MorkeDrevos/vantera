// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

import ComingSoon from '@/components/ComingSoon';
import { SEO_CONFIG } from '@/lib/seo/seo.config';
import { jsonLd, organizationJsonLd, websiteJsonLd } from '@/lib/seo/seo.jsonld';

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.domain),
  title: { default: SEO_CONFIG.defaultTitle, template: SEO_CONFIG.titleTemplate },
  description: SEO_CONFIG.defaultDescription,
  applicationName: SEO_CONFIG.siteName,

  openGraph: {
    type: 'website',
    siteName: SEO_CONFIG.siteName,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    url: SEO_CONFIG.domain,
    images: ['/opengraph-image'],
  },

  twitter: {
    card: 'summary_large_image',
    title: SEO_CONFIG.siteName,
    description: SEO_CONFIG.defaultDescription,
    images: ['/opengraph-image'],
  },

  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isProd = process.env.NODE_ENV === 'production';
  const comingSoon = isProd && process.env.NEXT_PUBLIC_COMING_SOON === '1';

  return (
    <html lang="en">
      <head>
        {jsonLd(organizationJsonLd())}
        {jsonLd(websiteJsonLd())}
        {comingSoon ? <meta name="robots" content="noindex,nofollow" /> : null}
      </head>
      <body>{comingSoon ? <ComingSoon /> : children}</body>
    </html>
  );
}
