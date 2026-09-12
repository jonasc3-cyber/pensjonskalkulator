import Link from "next/link";
import type { ReactNode } from "react";

type FaqItem = { q: string; a: ReactNode };

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Må jeg logge inn for å bruke kalkulatoren?",
    a: (
      <>
        Nei. sjekkpensjon.no er uinnlogget. Du fyller inn tallene selv, og alt
        regnes i nettleseren din. Ingenting sendes til server. Les mer i{" "}
        <Link
          href="/guider/pensjonskalkulator-uten-innlogging"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          pensjonskalkulator uten innlogging
        </Link>
        .
      </>
    ),
  },
  {
    q: "Hva dekker estimatet?",
    a: (
      <>
        Folketrygd (forenklet ny modell),{" "}
        <Link
          href="/guider/hva-er-tjenestepensjon"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          tjenestepensjon
        </Link>
        {" "}
        (inkl.{" "}
        <Link
          href="/guider/fripolise"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          fripolise
        </Link>
        {" "}
        og{" "}
        <Link
          href="/guider/pensjonskapitalbevis"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          pensjonskapitalbevis
        </Link>
        ),{" "}
        <Link
          href="/guider/afp-privat"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          AFP
        </Link>{" "}
        (forenklet) og egen sparing (IPS, ASK, fond, bank). Du får et intervall
        (pessimistisk / basis / optimistisk), ikke ett fasitsvar. Se også{" "}
        <Link
          href="/guider/hvor-mye-far-jeg-i-pensjon"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          hvor mye får jeg i pensjon?
        </Link>
        ,{" "}
        <Link
          href="/guider/nar-ta-ut-pensjon"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          når ta ut pensjon?
        </Link>{" "}
        og{" "}
        <Link
          href="/guider/ips-eller-ask"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          IPS eller ASK?
        </Link>
        .
      </>
    ),
  },
  {
    q: "Er dette det samme som Navs pensjonskalkulator?",
    a: (
      <>
        Nei. Navs innloggede kalkulator henter dine offisielle tall. Vår er et
        raskt, uinnlogget anslag med flere kilder samlet. Bruk alltid Din pensjon
        hos Nav for offisielle tall. Sammenligning:{" "}
        <Link
          href="/guider/uinnlogget-vs-nav"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          uinnlogget vs Nav
        </Link>
        .
      </>
    ),
  },
  {
    q: "Er dette det samme som Norsk Pensjon?",
    a: (
      <>
        Nei. sjekkpensjon.no er ikke Norsk Pensjon. Norsk Pensjon samler private
        pensjonsavtaler (ofte med innlogging). Vi gir et uinnlogget estimat
        basert på tallene du oppgir. Mer:{" "}
        <Link
          href="/guider/uinnlogget-vs-nav"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          uinnlogget vs Nav og Norsk Pensjon
        </Link>
        .
      </>
    ),
  },
  {
    q: "Lagres tallene mine?",
    a: "Nei på server. Tall kan bli liggende i nettleseren din (localStorage) eller i en lenke du selv deler — du styrer det.",
  },
  {
    q: "Hvorfor viser dere intervall i stedet for ett tall?",
    a: "Pensjon avhenger av avkastning, lønnsvekst, inflasjon og forenklede regler. Intervall gjør usikkerheten synlig, i stedet for falsk presisjon.",
  },
  {
    q: "Hva er «Spar for mål»?",
    a: (
      <>
        Du oppgir ønsket pensjon per måned, så regner vi ut hvor mye du må spare
        for å lukke gapet mot folketrygd, tjenestepensjon, AFP og øvrig sparing.
        Les mer:{" "}
        <Link
          href="/guider/hvor-mye-bor-jeg-spare-til-pensjon"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          hvor mye bør jeg spare til pensjon?
        </Link>
        {" "}
        Selvstendig?{" "}
        <Link
          href="/guider/pensjon-selvstendig-naringsdrivende"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          pensjon for selvstendig næringsdrivende
        </Link>
        .
      </>
    ),
  },
  {
    q: "Kan jeg jobbe ved siden av pensjonen?",
    a: (
      <>
        For alderspensjon fra folketrygden kan du normalt jobbe så mye du vil
        uten at pensjonen avkortes. AFP privat og skatt har egne regler. Les mer:{" "}
        <Link
          href="/guider/jobbe-ved-siden-av-pensjon"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          jobbe ved siden av pensjon
        </Link>
        .
      </>
    ),
  },
  {
    q: "Kan jeg stole på satser og regler?",
    a: "Vi bruker offisielle satser (blant annet G) og viser når de sist ble kontrollert. Modellen er forenklet — blant annet AFP og garantipensjon — så resultatet er veiledende.",
  },
  {
    q: "Fungerer kalkulatoren hvis jeg er født før 1963?",
    a: "Ja, men merk banneret om eldre regelverk. For offisiell beregning, spesielt ved overgangsregler, bruk Nav.",
  },
];

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          typeof item.a === "string"
            ? item.a
            : // Flatten simple link answers for schema (readable bokmål without JSX)
              stripForSchema(item.q),
      },
    })),
  };
}

function stripForSchema(q: string): string {
  const plain: Record<string, string> = {
    "Må jeg logge inn for å bruke kalkulatoren?":
      "Nei. sjekkpensjon.no er uinnlogget. Du fyller inn tallene selv, og alt regnes i nettleseren din. Ingenting sendes til server.",
    "Hva dekker estimatet?":
      "Folketrygd (forenklet ny modell), tjenestepensjon, AFP (forenklet) og egen sparing (IPS, ASK, fond, bank). Du får et intervall (pessimistisk / basis / optimistisk), ikke ett fasitsvar.",
    "Er dette det samme som Navs pensjonskalkulator?":
      "Nei. Navs innloggede kalkulator henter dine offisielle tall. Vår er et raskt, uinnlogget anslag med flere kilder samlet. Bruk alltid Din pensjon hos Nav for offisielle tall.",
    "Er dette det samme som Norsk Pensjon?":
      "Nei. sjekkpensjon.no er ikke Norsk Pensjon. Norsk Pensjon samler private pensjonsavtaler (ofte med innlogging). Vi gir et uinnlogget estimat basert på tallene du oppgir.",
    "Kan jeg jobbe ved siden av pensjonen?":
      "For alderspensjon fra folketrygden kan du normalt jobbe så mye du vil uten at pensjonen avkortes. AFP privat og skatt har egne regler.",
  };
  return plain[q] ?? "";
}

export function FaqSection() {
  return (
    <section
      className="mt-10 border-t border-border pt-8 sm:mt-12 sm:pt-10"
      aria-labelledby="faq-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      <h2
        id="faq-heading"
        className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
      >
        Ofte stilte spørsmål
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Kort om hvordan sjekkpensjon.no fungerer — uten innlogging og uten
        lagring på server. Guider:{" "}
        <Link
          href="/guider/pensjonskalkulator-uten-innlogging"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          uten BankID
        </Link>
        {" · "}
        <Link
          href="/guider/uinnlogget-vs-nav"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          vs Nav
        </Link>
        {" · "}
        <Link
          href="/guider/ips-eller-ask"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          IPS eller ASK
        </Link>
        {" · "}
        <Link
          href="/guider/hvor-mye-far-jeg-i-pensjon"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          hvor mye i pensjon
        </Link>
        {" · "}
        <Link
          href="/guider/nar-ta-ut-pensjon"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          uttaksalder
        </Link>
        {" · "}
        <Link
          href="/guider/afp-privat"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          AFP privat
        </Link>
        {" · "}
        <Link
          href="/guider/fripolise"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          fripolise
        </Link>
        {" · "}
        <Link
          href="/guider/pensjonskapitalbevis"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          pensjonskapitalbevis
        </Link>
        {" · "}
        <Link
          href="/guider/jobbe-ved-siden-av-pensjon"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          jobb + pensjon
        </Link>
        {" · "}
        <Link
          href="/guider/hvor-mye-bor-jeg-spare-til-pensjon"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          spare til pensjon
        </Link>
        {" · "}
        <Link
          href="/guider/pensjon-selvstendig-naringsdrivende"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          selvstendig
        </Link>
        .
      </p>
      <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card">
        {FAQ_ITEMS.map((item) => (
          <details key={item.q} className="group px-4 py-1 sm:px-5">
            <summary className="cursor-pointer list-none py-3 text-sm font-medium text-foreground outline-none marker:content-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span>{item.q}</span>
                <span
                  className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </span>
            </summary>
            <p className="pb-4 pr-8 text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
