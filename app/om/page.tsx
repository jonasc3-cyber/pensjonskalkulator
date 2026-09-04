import type { ReactNode } from "react";
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

function OmCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-primary">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h3>
  );
}

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
      <p className="mt-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-slate-600">
        Uavhengig indie-prototype for personlig bruk — ikke tilknyttet NAV, bank
        eller pensjonsleverandør. Tilbakemelding via{" "}
        <a
          href="https://github.com/jonasc3-cyber/pensjonskalkulator/issues"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub issues
        </a>
        .
      </p>

      <div className="mt-8 space-y-5">
        <OmCard title="Personvern">
          <p className="text-slate-600 leading-relaxed">
            Alle tall du skriver inn brukes kun til beregning i nettleseren din. Vi
            har ingen innlogging, ingen database for dine data, og ingen
            serverlagring av lønn eller alder. Data sendes aldri til en server.
          </p>
          <p className="text-slate-600 leading-relaxed">
            For at du ikke skal miste alt når du lukker fanen, lagres inndata{" "}
            <strong>lokalt</strong> i nettleserens localStorage. URL-en kan også
            inneholde en komprimert kopi av inndataene (query-parameter), slik at
            du kan bokmerke eller dele en lenke — da følger tallene med i lenken
            du selv velger å sende. Bruk «Nullstill» i kalkulatoren for å tømme
            lokal lagring og fjerne tilstanden fra URL-en. Behandle delte lenker
            som personlige opplysninger.
          </p>
        </OmCard>

        <OmCard title="Modell">
          <div className="space-y-3">
            <SubHeading>Folketrygd (ny modell)</SubHeading>
            <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
              <li>
                Gjelder forenklet for personer født <strong>1963 eller senere</strong>{" "}
                (ny opptjeningsmodell). For eldre kohorter viser kalkulatoren en
                tydelig advarsel: estimatene kan være feil eller misvisende — bruk{" "}
                <a
                  className="underline underline-offset-2 hover:text-primary"
                  href="https://www.nav.no/dinpensjon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Din pensjon hos NAV
                </a>
                .
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
          </div>

          <div className="space-y-3">
            <SubHeading>Konstanter</SubHeading>
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
          </div>

          <div className="space-y-3">
            <SubHeading>Delingstall @ 67 (NAV-utvalg)</SubHeading>
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
          </div>

          <div className="space-y-3">
            <SubHeading>Forenklet alderskurve (eks. født 1985)</SubHeading>
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
          </div>

          <div className="space-y-3">
            <SubHeading>TP, AFP og sparing</SubHeading>
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
              <li>
                <strong>IPS:</strong> saldo og avkastning fremskrives som øvrig
                sparing. Den omtrentlige <strong>22&nbsp;% skattefordelen</strong>{" "}
                (inntektsfradrag / preferansebehandling) er{" "}
                <em>ikke</em> inkludert i estimatet — dette står også som advarsel
                ved IPS-konto og i «Spar for mål».
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <SubHeading>Scenarioer</SubHeading>
            <p className="text-slate-600 leading-relaxed">
              Pessimistisk / basis / optimistisk justerer lønns-/G-vekst og forventet
              avkastning. Poenget er å vise usikkerhet — ikke å predikere markedet.
            </p>
          </div>
        </OmCard>

        <OmCard title="Kilder">
          <div className="space-y-3">
            <SubHeading>Satser sist kontrollert</SubHeading>
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
          </div>

          <div className="space-y-3">
            <SubHeading>Kilder å sjekke</SubHeading>
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
          </div>
        </OmCard>

        <OmCard title="Begrensninger">
          <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
            <li>Ikke full kohort × uttaksalder-matrise fra NAV for alle aldre.</li>
            <li>
              Ikke gammel opptjeningsmodell (før 1963) i detalj — kohort-advarsel
              vises i kalkulatoren når fødselsår &lt; 1963.
            </li>
            <li>
              IPS-skattefradrag (ca. 22&nbsp;%) og øvrig skatt er ikke modellert.
            </li>
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
        </OmCard>
      </div>
    </div>
  );
}
