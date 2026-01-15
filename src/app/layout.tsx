// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';

import { SEO_CONFIG } from '@/lib/seo/seo.config';
import {
  jsonLd,
  websiteJsonLd,
  organizationJsonLd,
} from '@/lib/seo/seo.jsonld';

function toAbsoluteUrl(input: string) {
  // Ensures metadataBase is always a valid absolute URL.
  // Accepts "https://vantera.io" or "vantera.io"
  const s = (input || '').trim();
  if (!s) return new URL('https://vantera.io');
  if (s.startsWith('http://') || s.startsWith('https://')) return new URL(s);
  return new URL(`https://${s}`);
}

const baseUrl = toAbsoluteUrl(SEO_CONFIG.domain);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#fbfbfa',
};

export const metadata: Metadata = {
  metadataBase: baseUrl,

  title: {
    default: 'Vantera - Private Intelligence for the World’s Most Valuable Assets',
    template: '%s · Vantera',
  },

  description:
    'Private intelligence for the world’s most valuable assets. Truth-first real estate intelligence, listings, private sellers, and agent launchpads.',

  applicationName: 'Vantera',

  alternates: {
    canonical: '/',
  },

  // Keep indexing open unless you explicitly gate prod via middleware
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

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

  // Light editorial theme (must match globals.css)
  themeColor: '#fbfbfa',

  appleWebApp: {
    title: 'Vantera',
    capable: true,
    statusBarStyle: 'default',
  },

  // Social previews (use your real OG asset path)
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Vantera',
    title: 'Vantera - Private Intelligence for the World’s Most Valuable Assets',
    description:
      'Private intelligence for the world’s most valuable assets. Truth-first real estate intelligence, listings, private sellers, and agent launchpads.',
    images: [
      {
        url: '/brand/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Vantera',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Vantera - Private Intelligence for the World’s Most Valuable Assets',
    description:
      'Private intelligence for the world’s most valuable assets. Truth-first real estate intelligence, listings, private sellers, and agent launchpads.',
    images: ['/brand/og.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Global schemas (1 script tag each)
  const site = {
    ...websiteJsonLd(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl.toString().replace(/\/$/, '')}/listings?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const org = organizationJsonLd();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="v-paper">
        {jsonLd(site)}
        {jsonLd(org)}
        {children}
      </body>
    </html>
  );
}
