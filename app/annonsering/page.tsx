import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Annonsering og affiliate | sjekkpensjon.no";
const description =
  "Ærlig informasjon om annonsering og affiliate på sjekkpensjon.no: ingen aktive affiliate-lenker i dag. Hvordan reklame merkes hvis den kommer.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/annonsering" },
  openGraph: {
    title,
    description,
    url: "https://sjekkpensjon.no/annonsering",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    title,
    description,
  },
};

function Card({
  title: heading,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-primary">{heading}</h2>
      <div className="mt-4 space-y-3 text-slate-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function AnnonseringPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-sm text-muted-foreground">
        <Link
          href="/"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          ← Tilbake til kalkulatoren
        </Link>
        {" · "}
        <Link
          href="/om"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          Om
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">
        Annonsering og affiliate
      </h1>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Åpenhet om hvordan siden finansieres — og hva som gjelder hvis
        annonsering eller affiliate kommer senere.
      </p>

      <div className="mt-8 space-y-5">
        <Card title="Status i dag">
          <p>
            sjekkpensjon.no har <strong>ingen aktive affiliate-lenker</strong>{" "}
            og ingen betalte produktplasseringer i kalkulatoren eller guidene
            akkurat nå. Kalkulatoren er gratis å bruke.
          </p>
          <p>
            Siden er et uavhengig prosjekt. Eventuell fremtidig finansiering
            skal ikke endre at estimatene er forenklinger og at innholdet ikke
            er personlig rådgivning.
          </p>
        </Card>

        <Card title="Hvis affiliate eller annonser kommer">
          <p>Da gjelder minst følgende:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Betalt eller provisjonsbasert innhold merkes tydelig med{" "}
              <strong>«Annonse»</strong> (eller tilsvarende).
            </li>
            <li>
              Vi gir <strong>ikke</strong> personlig råd om hvilken bank,
              fond eller pensjonsleverandør du bør velge.
            </li>
            <li>
              Risiko og begrensninger forklares ærlig — pensjon og sparing er
              YMYL-tema; ingenting her er et vedtak eller en anbefaling tilpasset
              deg.
            </li>
            <li>
              Affiliate erstatter ikke Nav, Norsk Pensjon eller autorisert
              rådgiver.
            </li>
          </ul>
        </Card>

        <Card title="Forholdet til den gratis kalkulatoren">
          <p>
            Kalkulatoren skal forbli et{" "}
            <strong>gratis, uinnlogget verktøy</strong> som kjører i
            nettleseren din. Annonsering — hvis den kommer — skal ikke kreve
            betaling for å bruke estimatet, og skal ikke skjule begrensningene i
            modellen.
          </p>
          <p>
            Målet er fortsatt ærlig informasjon: intervallanslag, åpne
            antagelser, og tydelig skillet mellom generell info og personlige
            tall hos Nav.
          </p>
        </Card>

        <Card title="Spørsmål">
          <p>
            Har du spørsmål om annonsering eller samarbeid? Send e-post til{" "}
            <a
              href="mailto:sjekkpensjon@outlook.com"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              sjekkpensjon@outlook.com
            </a>
            .
          </p>
          <p>
            Se også{" "}
            <Link
              href="/redaksjon"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              redaksjonell policy
            </Link>{" "}
            og{" "}
            <Link
              href="/om"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              om siden
            </Link>
            .
          </p>
        </Card>
      </div>
    </div>
  );
}
