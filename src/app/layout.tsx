import './globals.css';

export const metadata = {
  title: 'Locus',
  description: 'Real estate, observed.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
