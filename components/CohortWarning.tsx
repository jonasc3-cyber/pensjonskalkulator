"use client";

import Link from "next/link";
import { NEW_FOLKETRYGD_FROM_YEAR } from "@/lib/pension/persistence";

type Props = {
  birthYear: number;
  /** Bruk role="alert" (standard). Sett false for gjentatt varsel nær resultater. */
  alert?: boolean;
};

/**
 * In-flow advarsel når brukeren er født før ny folketrygdmodell (1963+).
 * Skjules automatisk for 1963 og senere.
 */
export function CohortWarning({ birthYear, alert = true }: Props) {
  if (!Number.isFinite(birthYear) || birthYear >= NEW_FOLKETRYGD_FROM_YEAR) {
    return null;
  }

  return (
    <div
      className="rounded-xl border border-info-border bg-info-bg px-4 py-3 text-sm leading-relaxed text-info-text"
      role={alert ? "alert" : "note"}
      data-testid="cohort-warning"
    >
      <p className="font-semibold text-primary">
        Kalkulatoren bruker ny folketrygdmodell ({NEW_FOLKETRYGD_FROM_YEAR}+)
      </p>
      <p className="mt-1">
        Du har oppgitt fødselsår{" "}
        <strong className="tabular-nums">{birthYear}</strong>. Estimatene er
        basert på opptjeningsmodellen for personer født{" "}
        {NEW_FOLKETRYGD_FROM_YEAR} eller senere, og kan være{" "}
        <strong>feil eller misvisende</strong> for eldre kohorter. Bruk{" "}
        <a
          href="https://www.nav.no/dinpensjon"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Din pensjon hos NAV
        </a>{" "}
        for offisielle tall. Les mer under{" "}
        <Link
          href="/om"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          Om kalkulatoren
        </Link>
        .
      </p>
    </div>
  );
}
