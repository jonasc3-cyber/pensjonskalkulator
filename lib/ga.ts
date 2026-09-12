export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function track(
  event: string,
  params?: Record<string, string | number | boolean>,
) {
  if (!GA_ID || typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (typeof gtag === "function") gtag("event", event, params);
}
