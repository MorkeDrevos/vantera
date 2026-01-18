// src/app/operations/assets/upload/route.ts
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sanitizePath(input: string) {
  // Remove any path traversal, collapse whitespace, keep safe chars
  const cleaned = input
    .trim()
    .replace(/\\/g, '/')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9/_\-.]/g, '-')
    .replace(/\/+/g, '/');

  // no traversal
  if (cleaned.includes('..')) return null;

  // no leading slash
  return cleaned.replace(/^\/+/, '');
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filenameRaw = searchParams.get('filename');

    if (!filenameRaw) {
      return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
    }

    const filename = sanitizePath(filenameRaw);
    if (!filename) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // ✅ Lock this down to allowed folders only
    const allowed =
      filename.startsWith('brand/') ||
      filename.startsWith('images/heroes/') ||
      filename.startsWith('hero/homepage/');

    if (!allowed) {
      return NextResponse.json({ error: 'Path not allowed' }, { status: 403 });
    }

    const contentType =
      request.headers.get('content-type') || 'application/octet-stream';

    const fileBlob = await request.blob();

    const uploaded = await put(filename, fileBlob, {
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
