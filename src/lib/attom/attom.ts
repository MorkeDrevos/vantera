// src/lib/attom/attom.ts
export const ATTOM_BASE = 'https://api.gateway.attomdata.com/propertyapi/v1.0.0';

type FetchJsonOpts = {
  path: string;
  query?: Record<string, string | number | boolean | null | undefined>;
};

export class AttomError extends Error {
  status: number;
  statusText: string;
  url: string;
  bodyText: string;

  constructor(args: { status: number; statusText: string; url: string; bodyText: string }) {
    super(`ATTOM ${args.status} ${args.statusText} for ${args.url}\n${args.bodyText.slice(0, 400)}`);
    this.name = 'AttomError';
    this.status = args.status;
    this.statusText = args.statusText;
    this.url = args.url;
    this.bodyText = args.bodyText;
  }
}

function toQueryString(query: FetchJsonOpts['query']) {
  if (!query) return '';
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === null || v === undefined) continue;
    params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}

function looksLikeSuccessWithNoResult(bodyText: string) {
  const t = (bodyText || '').toLowerCase();
  // ATTOM commonly returns 460 with "SuccessWithNoResult" in body (JSON or text)
  return t.includes('successwithnoresult');
}

export async function attomFetchJson<T>({ path, query }: FetchJsonOpts): Promise<T> {
  const key = process.env.ATTOM_API_KEY || process.env.NEXT_PUBLIC_ATTOM_API_KEY;

  if (!key) {
    throw new Error('Missing ATTOM_API_KEY env var. Add it in Vercel Project Settings -> Environment Variables.');
  }

  const url = `${ATTOM_BASE}${path}${toQueryString(query)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      apikey: key,
    },
    cache: 'no-store',
  });

  // Special-case: ATTOM sometimes uses 460 for "SuccessWithNoResult"
  // We treat it as a valid empty response, not a failure.
  if (!res.ok) {
    const bodyText = await res.text().catch(() => '');

    if (res.status === 460 && looksLikeSuccessWithNoResult(bodyText)) {
      // Prefer returning JSON if possible (ATTOM often returns JSON even on 460)
      try {
        return JSON.parse(bodyText) as T;
      } catch {
        // Fallback: return an empty-shaped payload that won't break snapshot consumers
        return ({ property: [], status: { msg: 'SuccessWithNoResult', code: 460 } } as unknown) as T;
      }
    }

    throw new AttomError({
      status: res.status,
      statusText: res.statusText,
      url,
      bodyText,
    });
  }

  return (await res.json()) as T;
}
