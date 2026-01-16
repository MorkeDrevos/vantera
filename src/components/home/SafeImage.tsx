// src/components/home/SafeImage.tsx
'use client';

import Image, { type ImageProps } from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';

type Props = Omit<ImageProps, 'alt' | 'onLoad' | 'onError'> & {
  alt: string;
  fallback?: React.ReactNode;
};

/**
 * SafeImage
 * - Never shows broken-image UI.
 * - Shows a premium shimmer while loading.
 * - Smooth fade-in on load (no harsh pop).
 * - Resets correctly when src changes.
 */
export default function SafeImage({ alt, fallback, ...props }: Props) {
  const srcKey = typeof props.src === 'string' ? props.src : (props.src as any)?.src ?? String(props.src);

  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // One gentle retry per src (some CDNs 403/timeout transiently)
  const retriedRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [srcKey]);

  const safeFallback = useMemo(() => {
    return (
      fallback ?? (
        <div className="absolute inset-0">
          {/* paper shimmer */}
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.04),rgba(0,0,0,0.02),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_18%_0%,rgba(231,201,130,0.14),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_360px_at_90%_12%,rgba(11,12,16,0.06),transparent_62%)]" />
          <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,rgba(11,12,16,0.22)_1px,transparent_0)] [background-size:28px_28px]" />

          {/* shimmer sweep */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -inset-y-10 -left-1/2 w-[60%] rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] opacity-30 blur-md animate-[vanteraShimmer_1.6s_ease-in-out_infinite]" />
          </div>

          <style jsx>{`
            @keyframes vanteraShimmer {
              0% {
                transform: translateX(-20%);
              }
              100% {
                transform: translateX(220%);
              }
            }
          `}</style>
        </div>
      )
    );
  }, [fallback]);

  // If image has failed (after retry), show fallback only.
  if (failed) return <>{safeFallback}</>;

  return (
    <div className="absolute inset-0">
      {/* fallback stays under image until it fully loads */}
      {!loaded ? <>{safeFallback}</> : null}

      <Image
        {...props}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => {
          const already = retriedRef.current[srcKey] === true;
          if (!already) {
            retriedRef.current[srcKey] = true;

            // Soft retry: flip loaded false (keeps shimmer) and let Next attempt again on re-render.
            setLoaded(false);

            // Trigger a microtask rerender without changing layout.
            // If the underlying src is genuinely invalid, the next error will mark failed.
            Promise.resolve().then(() => {
              // no-op; state is enough to rerender
            });

            return;
          }
          setFailed(true);
        }}
        className={[
          props.className ?? '',
          'transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />
    </div>
  );
}
