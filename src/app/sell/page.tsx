// src/app/sell/page.tsx
import type { Metadata } from 'next';
import SellerUploadClient from '@/components/sell/SellerUploadClient';

export const metadata: Metadata = {
  title: 'Publish a verified listing | Vantera',
  description: 'One listing at a time. Verified supply only.',
};

export default function SellPage() {
  return <SellerUploadClient />;
}
