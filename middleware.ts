// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

const DEV_HOSTS = new Set([
  'dev.vantera.io',
  'localhost',
  '127.0.0.1',
]);

function getHost(req: NextRequest) {
  // Vercel typically forwards the real host here
  const xfHost = req.headers.get('x-forwarded-host');
  const host = req.headers.get('host');
  const raw = (xfHost || host || '').toLowerCase();

  // strip port
  return raw.split(',')[0].trim().split(':')[0];
}

function isPublicAsset(pathname: string) {
  // Next internals
  if (pathname.startsWith('/_next')) return true;

  // Allow common static files
  if (pathname === '/favicon.ico') return true;
  if (pathname === '/robots.txt') return true;
  if (pathname === '/sitemap.xml') return true;

  // Allow your public folders used by ComingSoon + homepage
  if (pathname.startsWith('/og/')) return true;
  if (pathname.startsWith('/brand/')) return true;
  if (pathname.startsWith('/brands/')) return true;
  if (pathname.startsWith('/hero/')) return true;

  // Allow any file with an extension (png, jpg, svg, css, js, etc.)
  // This prevents breaking images/fonts even if you move folders later.
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true;

  return false;
}

export function middleware(req: NextRequest) {
  const host = getHost(req);
  const { pathname } = req.nextUrl;

  // Always let assets + APIs through
  if (isPublicAsset(pathname) || pathname.startsWith('/api')) {
    const res = NextResponse.next();
    res.headers.set('x-vantera-gate', 'bypass-assets');
    res.headers.set('x-vantera-host', host || 'unknown');
    return res;
  }

  // Prevent looping / reprocessing coming-soon itself
  if (pathname === '/coming-soon') {
    const res = NextResponse.next();
    res.headers.set('x-vantera-gate', 'allow-coming-soon');
    res.headers.set('x-vantera-host', host || 'unknown');
    return res;
  }

  // DEV host(s) work normally
  if (DEV_HOSTS.has(host)) {
    const res = NextResponse.next();
    res.headers.set('x-vantera-gate', 'dev-allow');
    res.headers.set('x-vantera-host', host || 'unknown');
    return res;
  }

  // Everything else is forced to Coming Soon (rewrite keeps URL)
  const url = req.nextUrl.clone();
  url.pathname = '/coming-soon';

  const res = NextResponse.rewrite(url);
  res.headers.set('x-vantera-gate', 'prod-coming-soon');
  res.headers.set('x-vantera-host', host || 'unknown');
  return res;
}

export const config = {
  matcher: ['/:path*'],
};
