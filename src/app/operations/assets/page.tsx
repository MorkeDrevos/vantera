// src/app/operations/assets/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sanitizeFilename(name: string) {
  return name
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+/, '');
}

function pickFolder(contentType: string) {
  if (contentType.startsWith('video/')) return 'hero/homepage';
  if (contentType.startsWith('image/')) return 'images/heroes';
  return 'assets';
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get('filename');

  if (!raw) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
  }

  const contentType = req.headers.get('content-type') || 'application/octet-stream';
  const safe = sanitizeFilename(raw);

  if (!safe) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  const folder = pickFolder(contentType);
  const pathname = `${folder}/${safe}`;

  if (!req.body) {
    return NextResponse.json({ error: 'Missing request body' }, { status: 400 });
  }

  try {
    const blob = await put(pathname, req.body, {
      access: 'public',
      contentType,
      // Keep the pathname deterministic (no random suffix)
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      contentType: blob.contentType,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Upload failed' },
      { status: 500 },
    );
  }
}
