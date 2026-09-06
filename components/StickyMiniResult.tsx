"use client";

import { useEffect, useState } from "react";
import { formatNOK } from "@/lib/format";

type Props =
  | { baseMonthly: number; invalid?: false }
  | { invalid: true; baseMonthly?: never };

/**
 * Mobil-only sticky mini-resultat nederst mens man scroller skjemaet.
 * Skjules når #results er synlig (IntersectionObserver).
 */
export function StickyMiniResult(props: Props) {
  const [resultsInView, setResultsInView] = useState(false);

  useEffect(() => {
    const el = document.getElementById("results");
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setResultsInView(entry.isIntersecting);
      },
      {
        // Litt slack så baren forsvinner før resultatene er helt i top
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (resultsInView) return null;

  if (props.invalid) {
    return (
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-red-200 bg-card/95 px-3 pt-2 shadow-[0_-4px_16px_rgba(11,42,74,0.08)] backdrop-blur supports-[backdrop-filter]:bg-card/90 sm:hidden"
        style={{
          paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))",
        }}
        role="status"
        aria-live="polite"
        data-testid="sticky-mini-result"
      >
        <a
          href="#annualSalary"
          className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800 transition-colors hover:bg-red-100 hover:text-red-900"
        >
          <span className="min-w-0 truncate font-medium">
            Oppgi årslønn for å se estimat
          </span>
          <span
            className="shrink-0 rounded-lg bg-red-800 px-3 py-1.5 text-xs font-semibold text-white"
            aria-hidden
          >
            Rett opp
          </span>
        </a>
      </div>
    );
  }

  const { baseMonthly } = props;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-3 pt-2 shadow-[0_-4px_16px_rgba(11,42,74,0.08)] backdrop-blur supports-[backdrop-filter]:bg-card/90 sm:hidden"
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))",
      }}
      role="status"
      aria-live="polite"
      data-testid="sticky-mini-result"
    >
      <a
        href="#results"
        className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-xl border border-border bg-primary-soft/60 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:border-primary/25 hover:bg-primary-soft"
      >
        <span className="min-w-0 truncate">
          Basis ca.{" "}
          <strong className="tabular-nums text-primary">
            {formatNOK(baseMonthly)}
          </strong>
          /mnd
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground shadow-sm">
          Se estimat
          <span aria-hidden>↓</span>
        </span>
      </a>
    </div>
  );
}
