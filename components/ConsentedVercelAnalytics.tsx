"use client";

import { Analytics } from "@vercel/analytics/next";

/** Mount only after analytics consent is granted. */
export function ConsentedVercelAnalytics() {
  return <Analytics />;
}
