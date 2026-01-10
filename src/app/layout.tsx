// src/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vantera.com'),

  title: {
    default: 'Vantera – Truth-First Real Estate Intelligence',
    template: '%s · Vantera',
  },

  description:
    'Truth-first real estate intelligence. Explore cities, supply, pricing signals, and verified market data – without noise.',

  applicationName: 'Vantera',

  openGraph: {
    type: 'website',
    siteName: 'Vantera',
    title: 'Vantera – Truth-First Real Estate Intelligence',
    description:
      'Explore cities, supply dynamics, and real estate truth layers built for clarity and trust.',
    images: ['/og/vantera-default.png'],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Vantera',
    description:
      'Truth-first real estate intelligence for cities worldwide.',
    images: ['/og/vantera-default.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
