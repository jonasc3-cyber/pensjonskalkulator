import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Annonsering og affiliate | sjekkpensjon.no";
const description =
  "Ærlig informasjon om annonsering og affiliate på sjekkpensjon.no: live Saxo-affiliate via Adtraction, merket Annonse. Hvordan reklame merkes.";

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
        Åpenhet om hvordan siden finansieres — og hvordan betalt eller
        provisjonsbasert innhold merkes.
      </p>

      <div className="mt-8 space-y-5">
        <Card title="Status i dag">
          <p>
            sjekkpensjon.no har en{" "}
            <strong>live affiliate-CTA for Saxo Bank (Norge)</strong> via
            Adtraction. Den er merket tydelig med <strong>«Annonse»</strong> og
            vises som en native kortplassering etter beregningsresultater og etter
            «Spar for mål» — ikke som skillebånd eller skjult banner.
          </p>
          <p>
            Hvis du klikker og åpner konto, kan vi motta provisjon. Det påvirker
            ikke pensjonsestimatene, som fortsatt beregnes lokalt i nettleseren.
            Kalkulatoren er gratis å bruke.
          </p>
          <p>
            Siden er et uavhengig prosjekt. Affiliate erstatter ikke at
            estimatene er forenklinger, og at innholdet ikke er personlig
            rådgivning.
          </p>
        </Card>

        <Card title="Slik merkes Annonse og affiliate">
          <p>Minst følgende gjelder:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Betalt eller provisjonsbasert innhold merkes tydelig med{" "}
              <strong>«Annonse»</strong> — også CTA-knapper og partnerlenker.
            </li>
            <li>
              Vi gir <strong>ikke</strong> personlig råd om hvilken bank, fond
              eller pensjonsleverandør du bør velge.
            </li>
            <li>
              <strong>Risiko:</strong> pensjon og sparing er YMYL-tema.
              Historisk avkastning er ingen garanti; estimater kan avvike fra
              dine faktiske rettigheter. Ingenting her er et vedtak eller en
              anbefaling tilpasset deg.
            </li>
            <li>
              Affiliate erstatter ikke Nav, Norsk Pensjon eller autorisert
              rådgiver. Les alltid vilkår hos leverandøren før du handler.
            </li>
          </ul>
          <p>
            Saxo-lenken går via Adtraction-sporing. Vi overdriver ikke
            avkastning, og vi markedsfører ikke crypto, CFD eller FX i denne
            CTA-en.
          </p>
        </Card>

        <Card title="Forholdet til den gratis kalkulatoren">
          <p>
            Kalkulatoren skal forbli et{" "}
            <strong>gratis, uinnlogget verktøy</strong> som kjører i
            nettleseren din. Annonsering skal ikke kreve betaling for å bruke
            estimatet, og skal ikke skjule begrensningene i modellen.
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
