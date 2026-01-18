// src/app/api/blob/put/route.ts
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const pathname = request.headers.get('x-vantera-pathname') || '';
    if (!pathname) throw new Error('Missing x-vantera-pathname');

    const allowed =
      pathname.startsWith('hero/homepage/') ||
      pathname.startsWith('images/heroes/');

    if (!allowed) throw new Error('Path not allowed');

    const contentType =
      request.headers.get('content-type') || 'application/octet-stream';

    const blob = await request.blob();

    const uploaded = await put(pathname, blob, {
      access: 'public',
      contentType,
    });

    return NextResponse.json(uploaded);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Upload failed' },
      { status: 400 },
    );
  }
}
