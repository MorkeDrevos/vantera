// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

// Everything on these hosts should behave normally (no coming-soon gate)
const ALLOW_HOSTS = new Set([
  'dev.vantera.io',
  'localhost',
  '127.0.0.1',
]);

function isBypassPath(pathname: string) {
  // Let Next internals + assets work normally
  if (pathname.startsWith('/_next')) return true;

  // Let public/static files load normally (add more if you need)
  if (pathname === '/favicon.ico') return true;
  if (pathname === '/robots.txt') return true;
  if (pathname === '/sitemap.xml') return true;

  // Let OG images / icons / assets load
  if (pathname.startsWith('/og/')) return true;
  if (pathname.startsWith('/brand/')) return true;
  if (pathname.startsWith('/brands/')) return true;
  if (pathname.startsWith('/hero/')) return true;

  // Let API routes work (health checks, etc.)
  if (pathname.startsWith('/api')) return true;

  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow bypass paths
  if (isBypassPath(pathname)) return NextResponse.next();

  // Figure out host (strip port if present)
  const host = (req.headers.get('host') || '').toLowerCase().split(':')[0];

  // Allow dev + local to work normally
  if (ALLOW_HOSTS.has(host)) return NextResponse.next();

  // Everything else (vantera.io + any other non-dev host) shows Coming Soon
  // Rewrite (NOT redirect) so URL stays the same.
  const url = req.nextUrl.clone();
  url.pathname = '/coming-soon';
  return NextResponse.rewrite(url);
}

// Run middleware on all routes (we already bypass assets in code above)
export const config = {
  matcher: ['/:path*'],
};
