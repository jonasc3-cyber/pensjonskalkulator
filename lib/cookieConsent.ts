/** First-party cookie / analytics consent (localStorage). */

export const COOKIE_CONSENT_KEY = "sp_cookie_consent";
export const COOKIE_CONSENT_OPEN_EVENT = "sp-cookie-consent-open";

export type CookieConsentChoice = "accepted" | "rejected";

export function getStoredConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (v === "accepted" || v === "rejected") return v;
  } catch {
    /* private mode / blocked storage */
  }
  return null;
}

export function setStoredConsent(choice: CookieConsentChoice): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  } catch {
    /* ignore */
  }
}

export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COOKIE_CONSENT_OPEN_EVENT));
}

/** Google Consent Mode v2 defaults — deny analytics (and ads) until accept. */
export const CONSENT_DEFAULT = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  wait_for_update: 500,
} as const;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function ensureGtag(): (...args: unknown[]) => void {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
  }
  return window.gtag;
}

export function applyConsent(choice: CookieConsentChoice): void {
  const gtag = ensureGtag();
  if (choice === "accepted") {
    gtag("consent", "update", { analytics_storage: "granted" });
  } else {
    gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }
}
