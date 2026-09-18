"use client";

import type { MouseEvent } from "react";
import { track } from "@/lib/ga";

const NAV_DIN_PENSJON_URL = "https://www.nav.no/dinpensjon";
const NORSK_PENSJON_URL = "https://www.norskpensjon.no";
const SPAR_FOR_MAL_ID = "spar-for-mal";

type TrustAction = {
  id: "nav" | "norsk_pensjon" | "spar_for_mal";
  title: string;
  description: string;
  href?: string;
  external?: boolean;
};

const ACTIONS: TrustAction[] = [
  {
    id: "nav",
    title: "Nav",
    description: "Se Din pensjon hos Nav",
    href: NAV_DIN_PENSJON_URL,
    external: true,
  },
  {
    id: "norsk_pensjon",
    title: "Norsk Pensjon",
    description: "Hent tjenestepensjon hos Norsk Pensjon",
    href: NORSK_PENSJON_URL,
    external: true,
  },
  {
    id: "spar_for_mal",
    title: "Spar for mål",
    description: "Juster sparing / Spar for mål",
  },
];

const cardClass =
  "group flex min-h-[4.5rem] w-full items-center gap-3 rounded-xl border-2 border-primary/40 bg-card px-4 py-3 text-left shadow-sm transition-colors hover:border-primary hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/**
 * Native tillits-CTA-rad etter resultater, før Saxo Annonse.
 * Sterkere visuelt enn affiliate-kort under.
 */
export function TrustNextSteps() {
  function onNavOrNp(id: TrustAction["id"]) {
    track("trust_cta_click", { target: id });
  }

  function onSparForMal(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    track("trust_cta_click", { target: "spar_for_mal" });
    const el = document.getElementById(SPAR_FOR_MAL_ID);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (typeof window !== "undefined" && window.history?.replaceState) {
      window.history.replaceState(null, "", `#${SPAR_FOR_MAL_ID}`);
    }
  }

  return (
    <nav
      className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
      aria-labelledby="trust-next-steps-heading"
      data-testid="trust-next-steps"
    >
      <h2
        id="trust-next-steps-heading"
        className="text-sm font-semibold text-primary sm:text-base"
      >
        Neste steg
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-3">
        {ACTIONS.map((action) => {
          const body = (
            <>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold text-primary">
                  {action.title}
                </span>
                <span className="text-xs font-normal leading-snug text-muted-foreground">
                  {action.description}
                </span>
              </span>
              <span
                className="shrink-0 text-lg font-semibold text-primary transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </>
          );

          return (
            <li key={action.id}>
              {action.external && action.href ? (
                <a
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onNavOrNp(action.id)}
                  className={cardClass}
                  data-testid={`trust-cta-${action.id}`}
                >
                  {body}
                </a>
              ) : (
                <a
                  href={`#${SPAR_FOR_MAL_ID}`}
                  onClick={onSparForMal}
                  className={cardClass}
                  data-testid={`trust-cta-${action.id}`}
                >
                  {body}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
