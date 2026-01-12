// src/app/sell/page.tsx
import { Suspense } from 'react';

import SellerUploadClient from '@/components/sell/SellerUploadClient';

function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10 text-sm text-zinc-300">
      Loading sell flow...
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SellerUploadClient />
    </Suspense>
  );
}
