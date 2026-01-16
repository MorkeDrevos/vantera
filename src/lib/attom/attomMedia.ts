// src/lib/attom/attomMedia.ts
import { attomFetchJson } from './attom';

export type AttomMediaResponse = {
  property: {
    media?: {
      photos?: Array<{
        sequenceNumber?: number;
        url: string;
        caption?: string;
        width?: number;
        height?: number;
      }>;
    };
  };
};

export async function fetchAttomMedia(attomId: string) {
  return attomFetchJson<AttomMediaResponse>({
    path: '/property/detail/media',
    query: {
      attomId,
    },
  });
}
