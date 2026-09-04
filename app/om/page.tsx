import type { Metadata } from "next";
import Link from "next/link";
import {
  CONSTANTS_SOURCE_LINKS,
  CONSTANTS_UPDATED,
  CONSTANTS_UPDATED_LABEL,
  DELINGSTALL_AT_67_SAMPLES,
  G_NOK,
  GARANTIPENSJON_NOK,
  TP_DEFAULT_SATS,
  TP_MAKS_G,
  WORK_AGE_CAP,
} from "@/lib/constants";
import { formatNOK, formatPercent } from "@/lib/format";
import { listDelingstall } from "@/lib/pension/delingstall";

export const metadata: Metadata = {
  title: "Om modellen | Pensjonskalkulator",
  description:
    "Forklaring av forenklet pensjonsmodell, kilder, begrensninger og personvern.",
};

export default function OmPage() {
  const delingstall = listDelingstall(1985);

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
        Om modellen
      </h1>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Denne siden forklarer hvordan den forenklede pensjonskalkulatoren fungerer,
        hvilke antagelser som er gjort, og hva du bør sjekke andre steder.
      </p>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-primary">Personvern</h2>
        <p className="text-slate-600 leading-relaxed">
          Alle tall du skriver inn brukes kun til beregning i nettleseren din. Vi
          har ingen innlogging, ingen database for dine data, og ingen
          serverlagring av lønn eller alder. Lukker du fanen, er tallene borte.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-primary">
          Satser sist kontrollert
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Satser sist kontrollert:{" "}
          <strong>{CONSTANTS_UPDATED_LABEL}</strong> ({CONSTANTS_UPDATED}).
          Verifisert mot offisielle kilder — se lenker under.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-600">
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
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-primary">Folketrygd (ny modell)</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            Gjelder forenklet for personer født 1963 eller senere (ny
            opptjeningsmodell).
          </li>
          <li>
            Hvert år: <strong>18,1 %</strong> av inntekt opp til{" "}
            <strong>7,1 G</strong> legges til pensjonsbeholdningen.
          </li>
          <li>
            Årlig pensjon ≈ beholdning / delingstall(uttaksalder). Delingstall ved
            67 er forankret i NAV-tall per fødselskohort; andre aldre er skalert
            forenklet.
          </li>
          <li>
            Garantipensjon: høy sats {formatNOK(GARANTIPENSJON_NOK.enslig)} / år
            (enslig), ordinær {formatNOK(GARANTIPENSJON_NOK.gift)} / år (gift) —
            fra 1. mai 2026, forenklet gulv.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-primary">Konstanter</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            Grunnbeløp G: <strong>{formatNOK(G_NOK)}</strong> (effektiv 1. mai
            2026).
          </li>
          <li>
            OTP: minimum {formatPercent(TP_DEFAULT_SATS)} av lønn opp til{" "}
            {TP_MAKS_G} G (fra første krone).
          </li>
          <li>
            Øvre aldersgrense i arbeidslivet: <strong>{WORK_AGE_CAP} år</strong>{" "}
            (i kraft 1. januar 2026). Folketrygdens uttaksaldre er fortsatt 62 /
            67 i lov.
          </li>
        </ul>
        <p className="text-slate-600 leading-relaxed">
          Øvrige konstanter ligger i{" "}
          <code className="rounded bg-muted px-1 text-sm">lib/constants.ts</code>{" "}
          med kildekommentarer.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-primary">
          Delingstall @ 67 (NAV-utvalg)
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-primary-soft text-slate-700">
              <tr>
                <th className="px-3 py-2 font-medium">Fødselsår</th>
                <th className="px-3 py-2 font-medium">Delingstall @ 67</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {DELINGSTALL_AT_67_SAMPLES.map((row) => (
                <tr key={row.birthYear} className="border-t border-border/60">
                  <td className="px-3 py-1.5 tabular-nums">{row.birthYear}</td>
                  <td className="px-3 py-1.5 tabular-nums">
                    {row.delingstall.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="px-3 py-1.5">
                    {row.status === "endelig" ? "Endelig" : "NAV-prognose"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-primary">
          Forenklet alderskurve (eks. født 1985)
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-primary-soft text-slate-700">
              <tr>
                <th className="px-3 py-2 font-medium">Uttaksalder</th>
                <th className="px-3 py-2 font-medium">Delingstall (approx.)</th>
              </tr>
            </thead>
            <tbody>
              {delingstall.map((row) => (
                <tr key={row.age} className="border-t border-border/60">
                  <td className="px-3 py-1.5 tabular-nums">{row.age}</td>
                  <td className="px-3 py-1.5 tabular-nums">
                    {row.delingstall.toFixed(2).replace(".", ",")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-primary">TP, AFP og sparing</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            <strong>Tjenestepensjon:</strong> flere kontoer støttes. Kun én «aktiv
            ordning» får pågående innskudd = sats × min(lønn, 12 G). Øvrige er
            frosne saldoer som fortsatt får avkastning. Utbetaling over N år eller
            forenklet livsvarig (global under Avansert).
          </li>
          <li>
            <strong>AFP:</strong> grovt tillegg merket «forenkling». Ekte privat og
            offentlig AFP har egne vilkår, levealdersjustering og samordning.
          </li>
          <li>
            <strong>Egen sparing:</strong> fremtidig verdi av månedlig sparing +
            saldo per konto, deretter annuitet.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-primary">Scenarioer</h2>
        <p className="text-slate-600 leading-relaxed">
          Pessimistisk / basis / optimistisk justerer lønns-/G-vekst og forventet
          avkastning. Poenget er å vise usikkerhet — ikke å predikere markedet.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-primary">Kilder å sjekke</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600">
          <li>
            <a
              className="underline underline-offset-2 hover:text-primary"
              href="https://www.nav.no/pensjon"
              target="_blank"
              rel="noopener noreferrer"
            >
              nav.no/pensjon
            </a>
          </li>
          <li>
            <a
              className="underline underline-offset-2 hover:text-primary"
              href="https://www.norskpensjon.no"
              target="_blank"
              rel="noopener noreferrer"
            >
              norskpensjon.no
            </a>
          </li>
          <li>
            <a
              className="underline underline-offset-2 hover:text-primary"
              href="https://www.finansportalen.no"
              target="_blank"
              rel="noopener noreferrer"
            >
              finansportalen.no
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-primary">Kjente forenklinger</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>Ikke full kohort × uttaksalder-matrise fra NAV for alle aldre.</li>
          <li>Ikke gammel opptjeningsmodell (før 1963) i detalj.</li>
          <li>Ikke BankID, Altinn eller Norsk Pensjon-API.</li>
          <li>
            Ikke full AFP-regelverk eller offentlig tjenestepensjon
            (bruttoordninger) — ytelse/offentlig TP er merket forenkling.
          </li>
          <li>Nettoanslag er svært grovt og erstatter ikke skattereglene.</li>
          <li>
            Historisk opptjening anslås fra dagens lønn — ikke faktisk
            inntektshistorikk.
          </li>
        </ul>
      </section>
    </div>
  );
}
