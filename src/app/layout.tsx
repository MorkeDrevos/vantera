import type { ReactNode } from 'react';

export const metadata = {
  title: 'Locus',
  description: 'Find cities, beautifully.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
