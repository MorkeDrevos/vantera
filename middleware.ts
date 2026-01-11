// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const url = req.nextUrl;

  // 🔒 PRODUCTION DOMAIN = MAINTENANCE
  if (host === 'vantera.io' || host === 'www.vantera.io') {
    // Allow assets
    if (
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/favicon') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg')
    ) {
      return NextResponse.next();
    }

    // Always rewrite to maintenance page
    url.pathname = '/maintenance';
    return NextResponse.rewrite(url);
  }

  // 🟢 DEV DOMAIN WORKS NORMALLY
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
