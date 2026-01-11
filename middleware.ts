// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === '1';

  // If gate is off, do nothing (dev.vantera.io stays normal)
  if (!comingSoon) return NextResponse.next();

  const { pathname } = url;

  // Allow Next internals and static/public files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Allow the coming-soon page itself
  if (pathname === '/coming-soon') return NextResponse.next();

  // Redirect EVERYTHING else to /coming-soon (keeps your domain clean)
  const dest = url.clone();
  dest.pathname = '/coming-soon';
  dest.search = ''; // optional: drop query params
  return NextResponse.redirect(dest);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
