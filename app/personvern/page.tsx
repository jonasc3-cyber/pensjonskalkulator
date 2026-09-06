import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personvern | Pensjonskalkulator",
  description:
    "Personvern for sjekkpensjon.no: alle tall beregnes lokalt i nettleseren. Ingen innlogging, ingen serverlagring av lønn eller alder.",
  alternates: { canonical: "/personvern" },
};

export default function PersonvernPage() {
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
        Personvern
      </h1>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Kort oversikt. Full forklaring av modell og begrensninger finner du under{" "}
        <Link
          href="/om#personvern"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          Om modellen → Personvern
        </Link>
        .
      </p>

      <section className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-primary">
          Hva skjer med tallene dine?
        </h2>
        <div className="mt-4 space-y-4 text-slate-600 leading-relaxed">
          <p>
            Alle tall du skriver inn brukes kun til beregning i nettleseren din. Vi
            har ingen innlogging, ingen database for dine data, og ingen
            serverlagring av lønn eller alder. Data sendes aldri til en server.
          </p>
          <p>
            For at du ikke skal miste alt når du lukker fanen, lagres inndata{" "}
            <strong>lokalt</strong> i nettleserens localStorage. URL-en kan også
            inneholde en komprimert kopi av inndataene (query-parameter), slik at
            du kan bokmerke eller dele en lenke — da følger tallene med i lenken
            du selv velger å sende. Bruk «Nullstill» i kalkulatoren for å tømme
            lokal lagring og fjerne tilstanden fra URL-en. Behandle delte lenker
            som personlige opplysninger.
          </p>
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          Se også{" "}
          <Link
            href="/om#personvern"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          >
            /om#personvern
          </Link>{" "}
          og{" "}
          <Link
            href="/satser"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          >
            satser og kilder
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
