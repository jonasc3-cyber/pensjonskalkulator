import type { Metadata } from "next";
import Link from "next/link";

const personvernTitle = "Personvern | Pensjonskalkulator";
const personvernDescription =
  "Personvern for sjekkpensjon.no: pensjonstall beregnes lokalt i nettleseren og sendes ikke til våre servere. Kort om Analytics og anonymisert sidebruk.";

export const metadata: Metadata = {
  title: personvernTitle,
  description: personvernDescription,
  alternates: { canonical: "/personvern" },
  openGraph: {
    title: personvernTitle,
    description: personvernDescription,
    url: "https://sjekkpensjon.no/personvern",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    title: personvernTitle,
    description: personvernDescription,
  },
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
          Om → Personvern
        </Link>
        .
      </p>

      <section className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-primary">
          Hva skjer med tallene dine?
        </h2>
        <div className="mt-4 space-y-4 text-slate-600 leading-relaxed">
          <p>
            Pensjonstall og øvrige inndata du skriver inn beregnes og lagres{" "}
            <strong>lokalt i nettleseren</strong> (localStorage). Vi har ingen
            innlogging og ingen database for dine pensjonsdata. Tallene sendes{" "}
            <strong>ikke</strong> til våre servere for beregning.
          </p>
          <p>
            For at du ikke skal miste alt når du lukker fanen, lagres inndata
            lokalt. URL-en kan også inneholde en komprimert kopi av inndataene
            (query-parameter), slik at du kan bokmerke eller dele en lenke — da
            følger tallene med i lenken du selv velger å sende. Bruk «Nullstill»
            i kalkulatoren for å tømme lokal lagring og fjerne tilstanden fra
            URL-en. Behandle delte lenker som personlige opplysninger.
          </p>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-primary">
          Analyse / cookies
        </h2>
        <div className="mt-4 space-y-4 text-slate-600 leading-relaxed">
          <p>
            Vi bruker <strong>Google Analytics 4</strong> (måle-ID{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-slate-800">
              G-1PLB6P9STY
            </code>
            ) via gtag for å forstå hvordan siden brukes. Formålet er
            sidevisninger, trafikk og hvilke sider som besøkes —{" "}
            <strong>ikke</strong> pensjonstallene eller inndataene dine.
          </p>
          <p>
            IP-adressen anonymiseres (<code className="rounded bg-muted px-1 text-sm">anonymize_ip</code>
            ). Kalkulator-input sendes fortsatt ikke til våre servere; beregning
            skjer lokalt i nettleseren.
          </p>
          <p>
            Vi bruker også <strong>Vercel Analytics</strong> for anonyme
            sidevisninger (hostingplattformen). Det er sidebruk, ikke
            pensjonsdata.
          </p>
          <p className="text-sm text-muted-foreground">
            Mer om Googles behandling:{" "}
            <a
              href="https://policies.google.com/privacy"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google personvern
            </a>
            . Du kan også bruke{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics opt-out-tillegget
            </a>
            .
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
