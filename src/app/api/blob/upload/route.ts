// src/app/api/blob/upload/route.ts
import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request, // ✅ THIS is the fix (was `req`)

      // IMPORTANT: lock this down to your own usage
      onBeforeGenerateToken: async (pathname) => {
        const allowed =
          pathname.startsWith('hero/homepage/') ||
          pathname.startsWith('images/heroes/');

        if (!allowed) {
          throw new Error('Path not allowed');
        }

        return {
          allowedContentTypes: [
            'video/mp4',
            'video/webm',
            'image/jpeg',
            'image/png',
            'image/webp',
          ],
          tokenPayload: JSON.stringify({ scope: 'operations-media' }),
        };
      },

      onUploadCompleted: async ({ blob }) => {
        void blob;
        // Optional: log, notify, or write to Prisma here
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Upload failed' },
      { status: 400 },
    );
  }
}
