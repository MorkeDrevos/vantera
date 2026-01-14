// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Coming-soon gating has been removed.
// We keep middleware as a no-op so deployments remain stable and
// we can reintroduce controlled gating later if needed.
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

// Keep a matcher that does nothing (safe). You can delete the config entirely too.
export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
