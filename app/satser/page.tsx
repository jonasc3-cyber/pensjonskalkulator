import type { Metadata } from "next";
import Link from "next/link";
import {
  CONSTANTS_SOURCE_LINKS,
  CONSTANTS_UPDATED,
  CONSTANTS_UPDATED_LABEL,
  G_NOK,
  GARANTIPENSJON_NOK,
  TP_DEFAULT_SATS,
  TP_MAKS_G,
  WORK_AGE_CAP,
} from "@/lib/constants";
import { formatNOK, formatPercent } from "@/lib/format";

export const metadata: Metadata = {
  title: "Satser og kilder | Pensjonskalkulator",
  description:
    "Satser sist kontrollert for sjekkpensjon.no: G, garantipensjon, OTP og lenker til offisielle kilder.",
  alternates: { canonical: "/satser" },
};

export default function SatserPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-sm text-muted-foreground">
        <Link
          href="/"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          ← Tilbake til kalkulatoren
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">
        Satser og kilder
      </h1>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Nøkkelstørrelser brukt i den forenklede modellen. Utfyllende tabeller og
        begrensninger står under{" "}
        <Link
          href="/om#satser"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          Om modellen → Satser / kilder
        </Link>
        .
      </p>

      <section className="mt-8 space-y-5">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-primary">
            Satser sist kontrollert
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Satser sist kontrollert:{" "}
            <strong>{CONSTANTS_UPDATED_LABEL}</strong> ({CONSTANTS_UPDATED}).
            Verifisert mot offisielle kilder — se lenker under.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
            <li>
              Grunnbeløp G: <strong>{formatNOK(G_NOK)}</strong> (effektiv 1. mai
              2026).
            </li>
            <li>
              Garantipensjon: høy sats {formatNOK(GARANTIPENSJON_NOK.enslig)} /
              år (enslig), ordinær {formatNOK(GARANTIPENSJON_NOK.gift)} / år
              (gift) — forenklet gulv.
            </li>
            <li>
              OTP: minimum {formatPercent(TP_DEFAULT_SATS)} av lønn opp til{" "}
              {TP_MAKS_G} G (fra første krone).
            </li>
            <li>
              Øvre aldersgrense i arbeidslivet: <strong>{WORK_AGE_CAP} år</strong>{" "}
              (i kraft 1. januar 2026).
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-primary">Kilder</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
            {CONSTANTS_SOURCE_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  className="underline underline-offset-2 hover:text-primary"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted-foreground">
            Mer om modell og begrensninger:{" "}
            <Link
              href="/om#satser"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              /om#satser
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
