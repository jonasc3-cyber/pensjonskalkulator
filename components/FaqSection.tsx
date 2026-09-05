const FAQ_ITEMS = [
  {
    q: "Må jeg logge inn for å bruke kalkulatoren?",
    a: "Nei. sjekkpensjon.no er uinnlogget. Du fyller inn tallene selv, og alt regnes i nettleseren din. Ingenting sendes til server.",
  },
  {
    q: "Hva dekker estimatet?",
    a: "Folketrygd (forenklet ny modell), tjenestepensjon, AFP (forenklet) og egen sparing (IPS, ASK, fond, bank). Du får et intervall (pessimistisk / basis / optimistisk), ikke ett fasitsvar.",
  },
  {
    q: "Er dette det samme som Navs pensjonskalkulator?",
    a: "Nei. Navs innloggede kalkulator henter dine offisielle tall. Vår er et raskt, uinnlogget anslag med flere kilder samlet. Bruk alltid Din pensjon hos Nav for offisielle tall.",
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
    a: "Du oppgir ønsket pensjon per måned, så regner vi ut hvor mye du må spare for å lukke gapet mot folketrygd, tjenestepensjon, AFP og øvrig sparing.",
  },
  {
    q: "Kan jeg stole på satser og regler?",
    a: "Vi bruker offisielle satser (blant annet G) og viser når de sist ble kontrollert. Modellen er forenklet — blant annet AFP og garantipensjon — så resultatet er veiledende.",
  },
  {
    q: "Fungerer kalkulatoren hvis jeg er født før 1963?",
    a: "Ja, men merk banneret om eldre regelverk. For offisiell beregning, spesielt ved overgangsregler, bruk Nav.",
  },
] as const;

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
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
        lagring på server.
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
