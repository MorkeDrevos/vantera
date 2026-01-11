// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').toLowerCase();
  const url = req.nextUrl;

  // ✅ ONLY gate the real prod domains
  const isProdDomain = host === 'vantera.io' || host === 'www.vantera.io';

  // ✅ dev.vantera.io (and anything else) works normally
  if (!isProdDomain) return NextResponse.next();

  const { pathname } = url;

  // Allow Next internals + public files + API
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

  // Allow the coming-soon route itself
  if (pathname === '/coming-soon') return NextResponse.next();

  // ✅ Force EVERY other URL to /coming-soon (no redirect, just rewrite)
  url.pathname = '/coming-soon';
  url.search = '';
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
