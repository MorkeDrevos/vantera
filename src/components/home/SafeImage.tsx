// src/components/home/SafeImage.tsx
'use client';

import Image, { type ImageProps } from 'next/image';
import { useMemo, useState } from 'react';

type Props = Omit<ImageProps, 'alt'> & {
  alt: string;
  fallback?: React.ReactNode;
};

export default function SafeImage({ alt, fallback, ...props }: Props) {
  const [ok, setOk] = useState(true);

  const safeFallback = useMemo(() => {
    return (
      fallback ?? (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
      )
    );
  }, [fallback]);

  // If Next/Image fails, show a premium fallback - never leak alt as visible UI.
  if (!ok) return <>{safeFallback}</>;

  return <Image {...props} alt={alt} onError={() => setOk(false)} />;
}
