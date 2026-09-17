"use client";

import { SAXO_TRACKING_URL } from "@/lib/affiliate";
import { track } from "@/lib/ga";

export type SaxoAnnonsePlacement = "after_results" | "after_spar_for_mal";

type Props = {
  placement: SaxoAnnonsePlacement;
};

/**
 * Merket native Annonse-CTA for Saxo (Adtraction).
 * Plasseres etter resultater og etter Spar for mål — ikke skillebånd/banner.
 */
export function SaxoAnnonseCta({ placement }: Props) {
  function onClick() {
    track("affiliate_cta_click", { partner: "saxo", placement });
  }

  return (
    <aside
      className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 opacity-95 shadow-sm sm:p-6"
      aria-label="Annonse — Saxo"
      data-testid={`saxo-annonse-cta-${placement}`}
      data-partner="saxo"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Annonse
      </p>
      <h2 className="mt-1.5 text-lg font-semibold text-primary">
        Annonse — Saxo
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Vil du spare i aksjesparekonto, fond eller aksjer? Saxo er en plattform
        for aksjer, ETF-er og fond.
      </p>
      <a
        href={SAXO_TRACKING_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={onClick}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition-colors hover:border-primary/40 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
        data-testid={`saxo-annonse-cta-link-${placement}`}
      >
        Åpne konto hos Saxo
      </a>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Historisk avkastning er ikke en garanti for fremtidig avkastning. Det er
        alltid en risiko for at du ikke får tilbake pengene du har investert.
        Dette er ikke personlig investeringsråd.
      </p>
    </aside>
  );
}
