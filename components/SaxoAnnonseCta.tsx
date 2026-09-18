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
 * Dimmet under tillitsrad — aldri over tillits-CTA.
 */
export function SaxoAnnonseCta({ placement }: Props) {
  function onClick() {
    track("affiliate_cta_click", { partner: "saxo", placement });
  }

  return (
    <aside
      className="rounded-2xl border border-border bg-[#F3F5F8] p-4 opacity-80 shadow-none sm:p-5"
      aria-label="Annonse — Saxo"
      data-testid={`saxo-annonse-cta-${placement}`}
      data-partner="saxo"
    >
      <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
        <span aria-hidden className="text-sm leading-none">
          ◈
        </span>
        Annonse
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-primary/80">Saxo Bank</h2>
          <p className="mt-1 text-sm leading-relaxed text-[#64748B]">
            Vil du spare i aksjesparekonto, fond eller aksjer? Saxo er en
            plattform for aksjer, ETF-er og fond.
          </p>
        </div>
        <a
          href={SAXO_TRACKING_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={onClick}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#D8DEE6] bg-card/70 px-4 py-2 text-sm font-medium text-primary/75 transition-colors hover:border-primary/30 hover:bg-card hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
          data-testid={`saxo-annonse-cta-link-${placement}`}
        >
          Les mer
          <span aria-hidden>→</span>
        </a>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[#64748B]/90">
        Historisk avkastning er ikke en garanti for fremtidig avkastning. Det er
        alltid en risiko for at du ikke får tilbake pengene du har investert.
        Dette er ikke personlig investeringsråd.
      </p>
    </aside>
  );
}
