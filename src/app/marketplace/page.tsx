// src/app/marketplace/page.tsx
import type { Metadata } from 'next';

import MarketplacePage from '@/components/marketplace/MarketplacePage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Marketplace',
  description:
    'World’s Largest Luxury Marketplace. €2M+ properties only, curated globally, presented with editorial-grade precision.',
  alternates: { canonical: '/marketplace' },
  openGraph: {
    type: 'website',
    title: 'Marketplace · Vantera',
    description:
      'World’s Largest Luxury Marketplace. €2M+ properties only, curated globally, presented with editorial-grade precision.',
    url: '/marketplace',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketplace · Vantera',
    description:
      'World’s Largest Luxury Marketplace. €2M+ properties only, curated globally, presented with editorial-grade precision.',
  },
};

export default function Marketplace() {
  return <MarketplacePage />;
}
