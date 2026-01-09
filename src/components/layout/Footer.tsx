// src/components/layout/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t mt-24 py-8 text-sm">
      <div className="mx-auto max-w-6xl px-6 flex justify-between">
        <span>© Vantera</span>
        <nav className="flex gap-6">
          <Link href="/contact">Contact</Link>
          <a href="mailto:hello@vantera.io">hello@vantera.io</a>
        </nav>
      </div>
    </footer>
  );
}
