export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://sjekkpensjon.no/#organization",
    name: "sjekkpensjon.no",
    url: "https://sjekkpensjon.no",
    logo: "https://sjekkpensjon.no/icon.png",
    email: "sjekkpensjon@outlook.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "sjekkpensjon@outlook.com",
      availableLanguage: ["Norwegian", "nb"],
    },
    sameAs: ["https://github.com/jonasc3-cyber/pensjonskalkulator"],
  };
}

export function webApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://sjekkpensjon.no/#organization",
        name: "sjekkpensjon.no",
        url: "https://sjekkpensjon.no",
        logo: "https://sjekkpensjon.no/icon.png",
        email: "sjekkpensjon@outlook.com",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "sjekkpensjon@outlook.com",
          availableLanguage: ["Norwegian", "nb"],
        },
        sameAs: ["https://github.com/jonasc3-cyber/pensjonskalkulator"],
      },
      {
        "@type": "WebApplication",
        "@id": "https://sjekkpensjon.no/#webapp",
        name: "Pensjonskalkulator uten BankID",
        url: "https://sjekkpensjon.no",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        inLanguage: "nb-NO",
        description:
          "Estimer pensjonen din uten BankID. Folketrygd, tjenestepensjon, AFP og egen sparing — som intervall, lokalt i nettleseren.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "NOK",
        },
        publisher: { "@id": "https://sjekkpensjon.no/#organization" },
      },
    ],
  };
}

export function articleJsonLd(opts: {
  headline: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    inLanguage: "nb-NO",
    isPartOf: {
      "@type": "WebSite",
      name: "Sjekkpensjon",
      url: "https://sjekkpensjon.no",
    },
    publisher: {
      "@type": "Organization",
      name: "sjekkpensjon.no",
      url: "https://sjekkpensjon.no",
      logo: "https://sjekkpensjon.no/icon.png",
    },
  };
}
