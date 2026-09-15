import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Redaksjonell policy | sjekkpensjon.no";
const description =
  "Hvordan vi skriver på sjekkpensjon.no: hvem som står bak, kilder, rettelser, uavhengighet — og at innholdet ikke er personlig pensjonsrådgivning.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/redaksjon" },
  openGraph: {
    title,
    description,
    url: "https://sjekkpensjon.no/redaksjon",
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

export default function RedaksjonPage() {
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
        Redaksjonell policy
      </h1>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Kort om hvordan innholdet på sjekkpensjon.no lages, hvilke kilder vi
        bruker, og hva du kan forvente — på en YMYL-side om pensjon.
      </p>

      <div className="mt-8 space-y-5">
        <Card title="Hvem skriver">
          <p>
            Innholdet skrives og vedlikeholdes av{" "}
            <strong>Jonas Sætre</strong> (eier og utvikler av sjekkpensjon.no).
            Det finnes ingen separat redaksjon eller team bak siden.
          </p>
          <p>
            Guider og forklaringer publiseres under redaksjonen{" "}
            <strong>sjekkpensjon.no</strong>. Formålet er å gjøre pensjonsregler
            og estimater mer forståelige — ikke å selge produkter.
          </p>
        </Card>

        <Card title="Kilder">
          <p>
            Vi baserer oss på offentlige og offisielle kilder der det er mulig,
            blant annet:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <a
                className="underline underline-offset-2 hover:text-primary"
                href="https://www.nav.no"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nav
              </a>{" "}
              (regler, satser, Din pensjon, delingstall)
            </li>
            <li>
              <a
                className="underline underline-offset-2 hover:text-primary"
                href="https://www.skatteetaten.no"
                target="_blank"
                rel="noopener noreferrer"
              >
                Skatteetaten
              </a>
            </li>
            <li>
              Folketrygdloven og andre relevante lover via{" "}
              <a
                className="underline underline-offset-2 hover:text-primary"
                href="https://lovdata.no"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lovdata
              </a>
            </li>
            <li>
              <a
                className="underline underline-offset-2 hover:text-primary"
                href="https://www.afp.no"
                target="_blank"
                rel="noopener noreferrer"
              >
                afp.no
              </a>{" "}
              for AFP i privat sektor
            </li>
            <li>
              <a
                className="underline underline-offset-2 hover:text-primary"
                href="https://www.norskpensjon.no"
                target="_blank"
                rel="noopener noreferrer"
              >
                Norsk Pensjon
              </a>{" "}
              for oversikt over pensjonskapital
            </li>
          </ul>
          <p>
            Satser og modellkonstanter dokumenteres på{" "}
            <Link
              href="/satser"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              /satser
            </Link>{" "}
            og under{" "}
            <Link
              href="/om#metode"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              Om → Metode og kilder
            </Link>
            .
          </p>
        </Card>

        <Card title="Rettinger">
          <p>
            Fant du en feil, utdatert sats eller uklar formulering? Send e-post
            til{" "}
            <a
              href="mailto:sjekkpensjon@outlook.com"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              sjekkpensjon@outlook.com
            </a>
            . Vi retter feil så raskt vi kan og oppdaterer «sist oppdatert» på
            guider når innholdet endres vesentlig.
          </p>
          <p>
            Små språklige justeringer merkes ikke alltid. Vesentlige
            regelendringer eller korreksjoner prioriteres.
          </p>
        </Card>

        <Card title="Uavhengighet — ikke personlig råd">
          <p>
            sjekkpensjon.no er en <strong>uavhengig</strong> side. Vi er ikke
            tilknyttet Nav, bank eller forsikringsselskap. Innholdet er{" "}
            <strong>generell informasjon</strong> og forenklede estimater —{" "}
            <strong>ikke</strong> personlig pensjons-, skatte- eller
            investeringsrådgivning.
          </p>
          <p>
            For personlige tall og vedtak: bruk{" "}
            <a
              className="underline underline-offset-2 hover:text-primary"
              href="https://www.nav.no/dinpensjon"
              target="_blank"
              rel="noopener noreferrer"
            >
              Din pensjon (Nav)
            </a>
            , Norsk Pensjon og eventuelt en autorisert rådgiver.
          </p>
          <p>
            Mer om eierskap og begrensninger:{" "}
            <Link
              href="/om"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              Om sjekkpensjon.no
            </Link>
            . Om annonsering og affiliate:{" "}
            <Link
              href="/annonsering"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              Annonsering
            </Link>
            .
          </p>
        </Card>
      </div>
    </div>
  );
}
