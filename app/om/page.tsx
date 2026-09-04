import type { Metadata } from "next";
import Link from "next/link";
import { G_NOK } from "@/lib/constants";
import { formatNOK } from "@/lib/format";
import { listDelingstall } from "@/lib/pension/delingstall";

export const metadata: Metadata = {
  title: "Om modellen | Pensjonskalkulator",
  description:
    "Forklaring av forenklet pensjonsmodell, kilder, begrensninger og personvern.",
};

export default function OmPage() {
  const delingstall = listDelingstall();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-sm text-slate-500">
        <Link href="/" className="underline hover:text-teal-800">
          ← Tilbake til kalkulatoren
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
        Om modellen
      </h1>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Denne siden forklarer hvordan den forenklede pensjonskalkulatoren fungerer,
        hvilke antagelser som er gjort, og hva du bør sjekke andre steder.
      </p>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Personvern</h2>
        <p className="text-slate-600 leading-relaxed">
          Alle tall du skriver inn brukes kun til beregning i nettleseren din.
          Vi har ingen innlogging, ingen database for dine data, og ingen
          serverlagring av lønn eller alder. Lukker du fanen, er tallene borte.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Folketrygd (ny modell)</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            Gjelder forenklet for personer født 1963 eller senere (ny opptjeningsmodell).
          </li>
          <li>
            Hvert år: <strong>18,1 %</strong> av inntekt opp til <strong>7,1 G</strong>{" "}
            legges til pensjonsbeholdningen.
          </li>
          <li>
            Årlig pensjon ≈ beholdning / delingstall(uttaksalder). Delingstallene
            her er <strong>tilnærmede</strong>, ikke offisielle kohorttabeller fra NAV.
          </li>
          <li>
            Garantipensjon er et forenklet gulv basert på sivilstatus og G.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Konstanter (VERIFY)</h2>
        <p className="text-slate-600 leading-relaxed">
          Grunnbeløp G i denne versjonen: <strong>{formatNOK(G_NOK)}</strong>.
          Oppdater mot offisiell G fra NAV/regjeringen. Andre konstanter ligger i{" "}
          <code className="rounded bg-slate-100 px-1 text-sm">lib/constants.ts</code>{" "}
          med VERIFY-kommentarer.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Forenklet delingstall-tabell
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 font-medium">Uttaksalder</th>
                <th className="px-3 py-2 font-medium">Delingstall (approx.)</th>
              </tr>
            </thead>
            <tbody>
              {delingstall.map((row) => (
                <tr key={row.age} className="border-t border-slate-100">
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
        <h2 className="text-lg font-semibold text-slate-900">TP, AFP og sparing</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            <strong>Tjenestepensjon:</strong> innskudd = sats × min(lønn, 12 G),
            fremskrevet med valgt avkastning, utbetalt over N år eller forenklet livsvarig.
          </li>
          <li>
            <strong>AFP:</strong> grovt tillegg merket «forenkling». Ekte privat og
            offentlig AFP har egne vilkår, levealdersjustering og samordning.
          </li>
          <li>
            <strong>Egen sparing:</strong> fremtidig verdi av månedlig sparing + saldo,
            deretter annuitet.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Scenarioer</h2>
        <p className="text-slate-600 leading-relaxed">
          Pessimistisk / basis / optimistisk justerer lønns-/G-vekst og forventet
          avkastning. Poenget er å vise usikkerhet — ikke å predikere markedet.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Kilder å sjekke</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600">
          <li>
            <a
              className="underline hover:text-teal-800"
              href="https://www.nav.no/pensjon"
              target="_blank"
              rel="noopener noreferrer"
            >
              nav.no/pensjon
            </a>
          </li>
          <li>
            <a
              className="underline hover:text-teal-800"
              href="https://www.norskpensjon.no"
              target="_blank"
              rel="noopener noreferrer"
            >
              norskpensjon.no
            </a>
          </li>
          <li>
            <a
              className="underline hover:text-teal-800"
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
        <h2 className="text-lg font-semibold text-slate-900">Kjente forenklinger</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>Ikke full kohort-spesifikk delingstall fra NAV/SSB.</li>
          <li>Ikke gammel opptjeningsmodell (før 1963) i detalj.</li>
          <li>Ikke BankID, Altinn eller Norsk Pensjon-API.</li>
          <li>Ikke full AFP-regelverk eller offentlig tjenestepensjon (bruttoordninger).</li>
          <li>Nettoanslag er svært grovt og erstatter ikke skattereglene.</li>
          <li>Historisk opptjening anslås fra dagens lønn — ikke faktisk inntektshistorikk.</li>
        </ul>
      </section>
    </div>
  );
}
