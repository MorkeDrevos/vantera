// src/lib/attom/attom.ts
export const ATTOM_BASE = 'https://api.gateway.attomdata.com/propertyapi/v1.0.0';

type FetchJsonOpts = {
  path: string;
  query?: Record<string, string | number | boolean | null | undefined>;
};

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

export async function attomFetchJson<T>({ path, query }: FetchJsonOpts): Promise<T> {
  const key = process.env.ATTOM_API_KEY || process.env.NEXT_PUBLIC_ATTOM_API_KEY;

  if (!key) {
    throw new Error(
      'Missing ATTOM_API_KEY env var. Add it in Vercel Project Settings -> Environment Variables.',
    );
  }

  const url = `${ATTOM_BASE}${path}${toQueryString(query)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      apikey: key,
    },
    // Prevent Next from caching vendor calls unexpectedly
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`ATTOM ${res.status} ${res.statusText} for ${url}\n${text.slice(0, 400)}`);
  }

  return (await res.json()) as T;
}
