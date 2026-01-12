// src/lib/copy/vanteraCopy.helpers.ts
import { VANTERA_COPY, type TrustLayerId } from './vanteraCopy';

export function getLayerCopy(id: TrustLayerId) {
  return VANTERA_COPY.layers[id];
}
