// src/app/operations/layout.tsx
import type { ReactNode } from 'react';

/**
 * Operations layout
 * Intentionally minimal.
 * NOTE: globals.css must ONLY be imported in src/app/layout.tsx
 */

export default function OperationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
