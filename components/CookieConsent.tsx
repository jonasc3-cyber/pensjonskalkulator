"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  COOKIE_CONSENT_OPEN_EVENT,
  applyConsent,
  getStoredConsent,
  setStoredConsent,
  type CookieConsentChoice,
} from "@/lib/cookieConsent";
import { ConsentedVercelAnalytics } from "@/components/ConsentedVercelAnalytics";

const BANNER_COPY =
  "Vi bruker nødvendige cookies for at siden skal virke, og analyse-cookies (Google Analytics) for å forstå bruk — hvis du godtar. Pensjonstallene dine regnes lokalt i nettleseren og sendes ikke til oss.";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored === "accepted") {
      applyConsent("accepted");
      setAnalyticsAllowed(true);
      setVisible(false);
    } else if (stored === "rejected") {
      applyConsent("rejected");
      setAnalyticsAllowed(false);
      setVisible(false);
    } else {
      setVisible(true);
    }
    setReady(true);

    const onOpen = () => setVisible(true);
    window.addEventListener(COOKIE_CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(COOKIE_CONSENT_OPEN_EVENT, onOpen);
  }, []);

  const choose = useCallback((choice: CookieConsentChoice) => {
    setStoredConsent(choice);
    applyConsent(choice);
    setAnalyticsAllowed(choice === "accepted");
    setVisible(false);
  }, []);

  return (
    <>
      {ready && analyticsAllowed ? <ConsentedVercelAnalytics /> : null}

      {visible ? (
        <div
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card shadow-[0_-6px_24px_rgba(11,42,74,0.10)]"
          role="region"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
        >
          <div className="mx-auto max-w-6xl px-4 py-3.5 sm:px-6 sm:py-4">
            <div className="flex flex-col gap-3 sm:gap-3.5">
              <div className="min-w-0">
                <h2
                  id="cookie-consent-title"
                  className="text-base font-semibold text-primary sm:text-lg"
                >
                  Cookies og analyse
                </h2>
                <p
                  id="cookie-consent-desc"
                  className="mt-1.5 text-sm leading-relaxed text-muted-foreground"
                >
                  {BANNER_COPY}{" "}
                  <Link
                    href="/personvern#cookies"
                    className="font-medium text-primary underline underline-offset-2 hover:text-accent"
                  >
                    Les mer
                  </Link>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => choose("accepted")}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-mid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Godta analyse
                </button>
                <button
                  type="button"
                  onClick={() => choose("rejected")}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border-[1.5px] border-border bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Kun nødvendige
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
