import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { G_NOK } from "@/lib/constants";
import { formatNOK } from "@/lib/format";

const guideTitle = "Hva får jeg i pensjon? Oversikt + kalkulator uten innlogging";
const guideDescription =
  "Hva får jeg i pensjon fra folketrygd, tjenestepensjon, AFP og sparing? Enkel oversikt — og estimat uten BankID på sjekkpensjon.no.";

export const metadata: Metadata = {
  title: guideTitle,
  description: guideDescription,
  alternates: { canonical: "/guider/hvor-mye-far-jeg-i-pensjon" },
  openGraph: {
    title: guideTitle,
    description: guideDescription,
    url: "https://sjekkpensjon.no/guider/hvor-mye-far-jeg-i-pensjon",
    locale: "nb_NO",
    type: "article",
  },
  twitter: {
    title: guideTitle,
    description: guideDescription,
  },
};

function Cta({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4">
      <Link
        href="/"
        className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-mid"
      >
        {children}
      </Link>
    </p>
  );
}

export default function GuideHvorMyePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <JsonLd
        data={articleJsonLd({
          headline: 'Hva får jeg i pensjon?',
          description: 'Hva får jeg i pensjon fra folketrygd, tjenestepensjon, AFP og sparing? Enkel oversikt — og estimat uten BankID på sjekkpensjon.no.',
          url: "https://sjekkpensjon.no/guider/hvor-mye-far-jeg-i-pensjon",
          dateModified: "2026-09-17",
          authorName: "Jonas Sætre",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd({
          name: 'Hva får jeg i pensjon?',
          path: '/guider/hvor-mye-far-jeg-i-pensjon',
        })}
      />
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
          Om modellen
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">
        Hva får jeg i pensjon?
      </h1>

      <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span>
          Av{" "}
          <Link
            href="/om#hvem"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          >
            Jonas Sætre
          </Link>
        </span>
        <span>
          Sist oppdatert:{" "}
          <time dateTime="2026-09-17">17. september 2026</time>
        </span>
      </p>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Det finnes ikke ett fasitsvar. Pensjonen din er summen av flere kilder,
        og beløpet endrer seg med lønn, hvor lenge du jobber, og når du tar den
        ut. Her er oversikten — og en måte å få et raskt anslag uten BankID.
      </p>

      <Cta>Prøv pensjonskalkulatoren →</Cta>
      <p className="mt-2 text-xs text-muted-foreground">
        Uinnlogget, alt i nettleseren
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-primary">
          Pensjonen kommer vanligvis fra tre steder
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            <strong className="text-foreground">Folketrygden (Nav)</strong> —
            det offentlige fundamentet
          </li>
          <li>
            <strong className="text-foreground">Tjenestepensjon</strong> — det
            arbeidsgiver sparer for deg
          </li>
          <li>
            <strong className="text-foreground">Egen sparing</strong> — IPS,
            aksjesparekonto, fond, bank
          </li>
        </ol>
        <p className="text-slate-600 leading-relaxed">
          Mange har også <strong className="text-foreground">AFP</strong>{" "}
          (avtalefestet pensjon) hvis arbeidsplassen er med i ordningen. AFP er
          ikke «ekstra lønn for alle», men kan utgjøre mye hvis du kvalifiserer —
          se{" "}
          <Link
            href="/guider/afp-privat"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          >
            AFP privat
          </Link>
          .
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-primary">
          Folketrygden — kort fortalt
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Er du født <strong className="text-foreground">1963 eller senere</strong>,
          tjener du opp pensjon etter ny modell: hvert år går en andel av
          inntekten (opp til et tak målt i G) inn i en pensjonsbeholdning. Når
          du tar ut pensjon, deles beholdningen på et{" "}
          <Link
            href="/guider/delingstall"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          >
            delingstall
          </Link>{" "}
          som blant annet henger sammen med forventet levealder. Mer om
          uttakstidspunkt:{" "}
          <Link
            href="/guider/nar-ta-ut-pensjon"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          >
            Når ta ut pensjon?
          </Link>
          .
        </p>
        <p className="text-slate-600 leading-relaxed">
          <strong className="text-foreground">Grunnbeløpet (G)</strong> fra 1.
          mai 2026 er <strong className="text-foreground">{formatNOK(G_NOK)}</strong>.
          G brukes i mange pensjons- og trygderegler, og oppdateres vanligvis
          hvert år.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Tommelfingerregler du ser ute på nettet (for eksempel «omtrent halvparten av
          lønnen») er bare grove anslag. Din egen historikk, uttaksalder og
          AFP/tjenestepensjon kan gi et helt annet bilde.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-primary">Tjenestepensjon</h2>
        <p className="text-slate-600 leading-relaxed">
          De fleste arbeidsgivere sparer til pensjon for deg (OTP / innskudd,
          ytelse, hybrid eller offentlig ordning). Hvor mye du får, avhenger av
          sats, lønn, antall år og avkastning. Har du byttet jobb, kan du ha
          flere saldoer (for eksempel pensjonskapitalbevis) — det er lett å glemme
          dem.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-primary">Egen sparing</h2>
        <p className="text-slate-600 leading-relaxed">
          Folketrygd + tjenestepensjon dekker sjelden ønsket levestandard alene.
          Egen sparing (IPS, ASK, fond, bank) er ofte det som lukker gapet. På
          sjekkpensjon.no kan du bruke{" "}
          <strong className="text-foreground">Spar for mål</strong> for å se
          omtrent hvor mye du må spare månedlig.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-primary">
          Hvorfor tallene spriker mellom kalkulatorer
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            Noen henter <strong className="text-foreground">dine</strong> tall
            (Nav innlogget, bank/KLP/SPK)
          </li>
          <li>
            Andre er{" "}
            <strong className="text-foreground">forenklede anslag</strong> uten
            innlogging
          </li>
          <li>
            Forutsetninger om avkastning, lønnsvekst og AFP varierer
          </li>
        </ul>
        <p className="text-slate-600 leading-relaxed">
          Et ærlig anslag viser derfor ofte et{" "}
          <strong className="text-foreground">intervall</strong>, ikke ett
          «fasitbeløp».
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-primary">
          Slik får du et nyttig tall raskt
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            Start med et{" "}
            <strong className="text-foreground">uinnlogget estimat</strong> som
            samler folketrygd, tjenestepensjon, AFP og sparing —{" "}
            <Link
              href="/"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              sjekkpensjon.no
            </Link>
          </li>
          <li>
            Sjekk deretter{" "}
            <strong className="text-foreground">offisielle tall</strong> hos{" "}
            <a
              href="https://www.nav.no/dinpensjon"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nav — Din pensjon
            </a>{" "}
            (innlogging)
          </li>
          <li>
            Hent oversikt over private avtaler via{" "}
            <a
              href="https://norskpensjon.no"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
              target="_blank"
              rel="noopener noreferrer"
            >
              Norsk Pensjon
            </a>{" "}
            der det er relevant
          </li>
        </ol>
        <p className="text-slate-600 leading-relaxed">
          Les mer om hvordan vår modell fungerer på{" "}
          <Link
            href="/om"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          >
            Om kalkulatoren
          </Link>
          .
        </p>
      </section>

      <section className="mt-8 space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-primary">Kort oppsummert</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            Pensjon = folketrygd + tjenestepensjon (+ AFP) + egen sparing
          </li>
          <li>Uttaksalder og levealdersjustering påvirker årlig beløp</li>
          <li>
            Bruk et raskt anslag for oversikt, og Nav for det offisielle
          </li>
        </ul>
        <Cta>Estimer pensjonen din uten innlogging →</Cta>
      </section>


      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-primary">Relaterte guider</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            <Link
              href="/guider/afp-privat"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              AFP privat
            </Link>{" "}
            — vilkår, uttak fra 62 og hvordan AFP påvirker estimatet
          </li>
          <li>
            <Link
              href="/guider/nar-ta-ut-pensjon"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              Når ta ut pensjon?
            </Link>{" "}
            — 62, 67 eller senere, og delingstall
          </li>
          <li>
            <Link
              href="/guider/uinnlogget-vs-nav"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            >
              Uinnlogget vs Nav
            </Link>{" "}
            — når raskt anslag er nok
          </li>
        </ul>
      </section>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        Veiledende informasjon, ikke personlig rådgivning. Satser og regler
        endres — verifiser mot Nav ved viktige beslutninger.
      </p>
    </article>
  );
}
