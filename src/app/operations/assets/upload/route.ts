// src/app/operations/assets/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
  }

  if (!req.body) {
    return NextResponse.json({ error: 'Missing request body' }, { status: 400 });
  }

  const contentType = req.headers.get('content-type') || 'application/octet-stream';

  const blob = await put(filename, req.body, {
    access: 'public',
    contentType,
  });

  // PutBlobResult does NOT include "size" - keep the response minimal + stable
  return NextResponse.json({
    url: blob.url,
    pathname: blob.pathname,
    contentType: blob.contentType ?? contentType,
  });
}
