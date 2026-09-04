"use client";

import { useEffect, useState } from "react";
import { formatNOK } from "@/lib/format";

type Props = {
  baseMonthly: number;
};

/**
 * Mobil-only sticky mini-resultat nederst mens man scroller skjemaet.
 * Skjules når #results er synlig (IntersectionObserver).
 */
export function StickyMiniResult({ baseMonthly }: Props) {
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

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-3 py-2 shadow-[0_-4px_16px_rgba(11,42,74,0.08)] backdrop-blur supports-[backdrop-filter]:bg-card/90 sm:hidden"
      role="status"
      aria-live="polite"
    >
      <a
        href="#results"
        className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-lg px-1 py-1 text-sm text-slate-700 transition-colors hover:text-primary"
      >
        <span className="min-w-0 truncate">
          Basis ca.{" "}
          <strong className="tabular-nums text-primary">
            {formatNOK(baseMonthly)}
          </strong>
          /mnd
          <span className="text-muted-foreground"> · </span>
          <span className="font-semibold text-accent">Se estimat</span>
        </span>
      </a>
    </div>
  );
}
