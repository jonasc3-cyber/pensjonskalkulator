/** Saxo Bank NO tracking (Adtraction). Prefer env; fallback keeps prod working. */
export const SAXO_TRACKING_URL_FALLBACK =
  "https://go.adt246.net/t/t?a=1975968377&as=2109515223&t=2&tk=1";

export const SAXO_TRACKING_URL =
  process.env.NEXT_PUBLIC_SAXO_TRACKING_URL?.trim() ||
  SAXO_TRACKING_URL_FALLBACK;
