// src/components/layout/AppChrome.tsx
'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';

import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNotFound = pathname === '/404' || pathname === '/_not-found';

  return (
    <>
      {!isNotFound ? (
        <Suspense fallback={null}>
          <TopBar />
        </Suspense>
      ) : null}

      {children}

      {!isNotFound ? <Footer /> : null}
    </>
  );
}
