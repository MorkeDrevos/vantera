// src/lib/copy/resolveCopy.ts
import { VANTERA_COPY } from './vanteraCopy';

function get(obj: any, path: string) {
  return path.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

export function resolveVanteraCopy(path: string): string {
  const v = get(VANTERA_COPY, path);
  if (typeof v === 'string') return v;
  return '';
}
