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

function looksLikeNoResultsPayload(payload: any) {
  const msg = String(payload?.status?.msg ?? payload?.status?.message ?? '').toLowerCase();
  // ATTOM sometimes returns 404/400 but with a JSON body like:
  // { "status": { "code": 0, "msg": "SuccessfulWithoutResult" }, "property": [] }
  return msg.includes('successfulwithoutresult') || msg.includes('successwithoutresult') || msg.includes('withoutresult');
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

  // Normal success
  if (res.ok) {
    return (await res.json()) as T;
  }

  // ATTOM "no results" quirk:
  // They can return non-2xx (often 404/400) while still sending a JSON body that indicates "SuccessfulWithoutResult".
  const text = await res.text().catch(() => '');
  const trimmed = text.trim();

  if (trimmed) {
    // Try parse JSON body
    try {
      const payload = JSON.parse(trimmed);

      // Treat "SuccessfulWithoutResult" as a valid empty response (not an error)
      if (looksLikeNoResultsPayload(payload)) {
        return payload as T;
      }
    } catch {
      // ignore parse errors, we'll throw below
    }
  }

  throw new Error(`ATTOM ${res.status} ${res.statusText} for ${url}\n${trimmed.slice(0, 400)}`);
}
