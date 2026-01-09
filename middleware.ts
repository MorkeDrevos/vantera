// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === '1';
  if (!comingSoon) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Allow the coming-soon page and Next static assets
  if (
    pathname === '/coming-soon' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next();
  }

  // Optional: keep APIs accessible even in coming-soon mode
  if (pathname.startsWith('/api')) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/coming-soon';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
