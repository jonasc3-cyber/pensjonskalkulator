import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { articleJsonLd } from "@/lib/jsonld";

const guideTitle = "Uinnlogget pensjonskalkulator vs Nav og Norsk Pensjon";
const guideDescription =
  "Forskjellen på sjekkpensjon.no (uinnlogget anslag), Navs Din pensjon og Norsk Pensjon — og når du bør bruke hvilken.";

export const metadata: Metadata = {
  title: guideTitle,
  description: guideDescription,
  alternates: { canonical: "/guider/uinnlogget-vs-nav" },
  openGraph: {
    title: guideTitle,
    description: guideDescription,
    url: "https://sjekkpensjon.no/guider/uinnlogget-vs-nav",
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

export default function GuideUinnloggetVsNavPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <JsonLd
        data={articleJsonLd({
          headline: 'Uinnlogget pensjonskalkulator vs Nav og Norsk Pensjon',
          description: 'Forskjellen på sjekkpensjon.no (uinnlogget anslag), Navs Din pensjon og Norsk Pensjon — og når du bør bruke hvilken.',
          url: "https://sjekkpensjon.no/guider/uinnlogget-vs-nav",
          dateModified: "2026-09-12",
          authorName: "Jonas Sætre",
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
          href="/guider"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          Guider
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">
        Uinnlogget pensjonskalkulator vs Nav og Norsk Pensjon
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
          <time dateTime="2026-09-12">12. september 2026</time>
        </span>
      </p>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Vil du bare ha et raskt bilde — eller trenger du offisielle tall? Her er
        forskjellen på et{" "}
        <strong className="text-foreground">uinnlogget anslag</strong> og{" "}
        <strong className="text-foreground">Navs pensjonskalkulator</strong>, og
        når det lønner seg å bruke hvilken.
      </p>

      <Cta>Prøv uinnlogget estimat på sjekkpensjon.no →</Cta>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-primary">
          To ulike verktøy, to ulike jobber
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-3 py-2.5 font-medium text-muted-foreground" />
                <th className="px-3 py-2.5 font-semibold text-primary">
                  sjekkpensjon.no
                </th>
                <th className="px-3 py-2.5 font-semibold text-primary">Nav</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-border">
                <th className="px-3 py-2.5 align-top font-medium text-foreground">
                  Innlogging
                </th>
                <td className="px-3 py-2.5 align-top">Nei</td>
                <td className="px-3 py-2.5 align-top">
                  Ja for fulle tall (BankID m.m.)
                </td>
              </tr>
              <tr className="border-b border-border">
                <th className="px-3 py-2.5 align-top font-medium text-foreground">
                  Hva du får
                </th>
                <td className="px-3 py-2.5 align-top">
                  Forenklet intervall: folketrygd + tjenestepensjon + AFP + egen
                  sparing
                </td>
                <td className="px-3 py-2.5 align-top">
                  Offisielle anslag basert på dine opplysninger hos Nav
                </td>
              </tr>
              <tr className="border-b border-border">
                <th className="px-3 py-2.5 align-top font-medium text-foreground">
                  Personvern
                </th>
                <td className="px-3 py-2.5 align-top">
                  Alt i nettleseren — ingen serverlagring av tallene dine
                </td>
                <td className="px-3 py-2.5 align-top">
                  Nav behandler personopplysninger etter sine regler
                </td>
              </tr>
              <tr>
                <th className="px-3 py-2.5 align-top font-medium text-foreground">
                  Best til
                </th>
                <td className="px-3 py-2.5 align-top">
                  Rask oversikt, scenarioer, «hva hvis jeg sparer mer?»
                </td>
                <td className="px-3 py-2.5 align-top">
                  Søknad, offisielle tall, beslutninger som krever korrekt
                  opptjening
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Nav har også en{" "}
          <a
            href="https://www.nav.no/pensjon/uinnlogget-kalkulator"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            target="_blank"
            rel="noopener noreferrer"
          >
            uinnlogget kalkulator
          </a>
          . Den er nyttig, men dekker typisk{" "}
          <strong className="text-foreground">
            alderspensjon fra folketrygden og AFP i privat sektor
          </strong>{" "}
          — ikke et fullt bilde av tjenestepensjon og all egen sparing samlet på
          samme måte.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-primary">
          Når uinnlogget er nok
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            Du vil{" "}
            <strong className="text-foreground">forstå nivået</strong> før du
            logger inn et sted
          </li>
          <li>
            Du vil teste{" "}
            <strong className="text-foreground">uttaksalder</strong>, sparing
            eller flere tjenestepensjoner raskt
          </li>
          <li>
            Du vil ikke lime inn sensitive tall i enda en innlogging midt i
            kvelden
          </li>
          <li>
            Du trenger et{" "}
            <strong className="text-foreground">intervall</strong> som viser
            usikkerhet, ikke ett «fasittall»
          </li>
        </ul>
        <p className="text-slate-600 leading-relaxed">
          Da er{" "}
          <Link
            href="/"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          >
            sjekkpensjon.no
          </Link>{" "}
          laget for deg: forenklet modell, tydelige forbehold, personvern først.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-primary">
          Når du bør bruke Nav
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            Du skal <strong className="text-foreground">søke</strong> om pensjon
            eller AFP
          </li>
          <li>
            Du trenger tall knyttet til{" "}
            <strong className="text-foreground">din faktiske opptjening</strong>
          </li>
          <li>
            Du er født før 1963 / har{" "}
            <strong className="text-foreground">overgangsregler</strong> der
            forenklede modeller lett bommer
          </li>
          <li>
            En bank, rådgiver eller Nav-veileder ber om{" "}
            <strong className="text-foreground">offisielle</strong> tall
          </li>
        </ul>
        <p className="text-slate-600 leading-relaxed">
          Start her:{" "}
          <a
            href="https://www.nav.no/dinpensjon"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            target="_blank"
            rel="noopener noreferrer"
          >
            Din pensjon hos Nav
          </a>
          .
        </p>
      </section>


      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-primary">
          Vi er ikke Norsk Pensjon
        </h2>
        <p className="text-slate-600 leading-relaxed">
          <strong className="text-foreground">sjekkpensjon.no er ikke Norsk
          Pensjon</strong> — og vi later ikke som om vi er det.{" "}
          <a
            href="https://www.norskpensjon.no"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
            target="_blank"
            rel="noopener noreferrer"
          >
            Norsk Pensjon
          </a>{" "}
          er en tjeneste som{" "}
          <strong className="text-foreground">
            samler oversikt over private pensjonsavtaler
          </strong>{" "}
          (tjenestepensjon, fripolise, pensjonskapitalbevis m.m.), typisk med
          innlogging. Det er nyttig når du skal hente{" "}
          <em>faktiske</em> saldoer og avtaler.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Vi er et{" "}
          <strong className="text-foreground">uinnlogget estimat</strong>: du
          skriver inn tallene selv (eller limer inn det du har sett hos Norsk
          Pensjon / leverandør), og alt regnes lokalt i nettleseren. Ingen
          Norsk Pensjon-API, ingen BankID hos oss.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            <strong className="text-foreground">Norsk Pensjon</strong> —
            oversikt over private avtaler (innlogging)
          </li>
          <li>
            <strong className="text-foreground">Nav</strong> — offisiell
            folketrygd / AFP (innlogging for fulle tall)
          </li>
          <li>
            <strong className="text-foreground">sjekkpensjon.no</strong> —
            samlet intervallanslag uten innlogging
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-primary">
          Anbefalt rekkefølge
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>
            <strong className="text-foreground">Uinnlogget</strong> — få oversikt
            og still spørsmålene («når kan jeg gå av?», «hvor mye må jeg
            spare?»)
          </li>
          <li>
            <strong className="text-foreground">Nav innlogget</strong> — bekreft
            med dine tall
          </li>
          <li>
            <strong className="text-foreground">Norsk Pensjon</strong> — sjekk
            private avtaler og pensjonskapital der det er relevant:{" "}
            <a
              href="https://norskpensjon.no"
              className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
              target="_blank"
              rel="noopener noreferrer"
            >
              norskpensjon.no
            </a>
          </li>
        </ol>
        <p className="text-slate-600 leading-relaxed">
          Les mer om vår modell og begrensninger på{" "}
          <Link
            href="/om"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          >
            Om kalkulatoren
          </Link>
          , og se den korte oversikten i{" "}
          <Link
            href="/guider/hvor-mye-far-jeg-i-pensjon"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          >
            Hva får jeg i pensjon?
          </Link>
          .
        </p>
      </section>

      <section className="mt-8 space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-primary">Kort oppsummert</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
          <li>Uinnlogget = raskt, samlet bilde, med forenklinger</li>
          <li>
            Nav = offisielt og personlig — bruk det før store beslutninger
          </li>
          <li>
            Norsk Pensjon = private avtaler med innlogging — vi er{" "}
            <strong className="text-foreground">ikke</strong> dem
          </li>
          <li>
            De erstatter ikke hverandre; de{" "}
            <strong className="text-foreground">utfyller</strong> hverandre
          </li>
        </ul>
        <Cta>Estimer uten innlogging →</Cta>
      </section>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        Veiledende informasjon, ikke personlig rådgivning. Verifiser alltid mot
        Nav ved viktige beslutninger.
      </p>
    </article>
  );
}
