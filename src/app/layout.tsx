import './globals.css';

export const metadata = {
  title: 'Locus',
  description: 'Real estate, observed.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-950 antialiased">{children}</body>
    </html>
  );
}
