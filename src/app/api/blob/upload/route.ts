// src/app/api/blob/upload/route.ts
import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      req,

      // IMPORTANT: lock this down to your own usage
      onBeforeGenerateToken: async (pathname) => {
        // Only allow uploads from Operations media tool
        // and only to the folders we want.
        const allowed =
          pathname.startsWith('hero/homepage/') || pathname.startsWith('images/heroes/');

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
          tokenPayload: JSON.stringify({
            scope: 'operations-media',
          }),
        };
      },

      onUploadCompleted: async ({ blob }) => {
        // Optional: you can log, notify, or later write to Prisma here
        // console.log('Upload completed:', blob.url);
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
