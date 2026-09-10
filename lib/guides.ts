export type GuideMeta = {
  slug: string;
  path: string;
  title: string;
  description: string;
  blurb: string;
  group: "start" | "forsta" | "sparing";
  /** YYYY-MM-DD for sitemap lastmod */
  lastmod: string;
};

/** Single registry: hub listing + sitemap. */
export const GUIDES: readonly GuideMeta[] = [
  {
    slug: "hvor-mye-far-jeg-i-pensjon",
    path: "/guider/hvor-mye-far-jeg-i-pensjon",
    title: "Hvor mye får jeg i pensjon?",
    description:
      "Se hva som bestemmer pensjonen din — folketrygd, tjenestepensjon, AFP og egen sparing. Estimer uten innlogging på sjekkpensjon.no.",
    blurb:
      "Tre pilarer + AFP, hvorfor tall spriker, og hvordan du får et raskt anslag uten BankID.",
    group: "start",
    lastmod: "2026-09-10",
  },
  {
    slug: "pensjonskalkulator-uten-innlogging",
    path: "/guider/pensjonskalkulator-uten-innlogging",
    title: "Pensjonskalkulator uten innlogging",
    description:
      "Finn en pensjonskalkulator uten BankID eller innlogging. Se hvordan sjekkpensjon.no skiller seg fra Nav og bankene — privat, raskt og med intervallestimat.",
    blurb:
      "Uten BankID: når uinnlogget anslag er nok, og hvordan sjekkpensjon.no skiller seg fra Nav og bankene.",
    group: "start",
    lastmod: "2026-09-10",
  },
  {
    slug: "uinnlogget-vs-nav",
    path: "/guider/uinnlogget-vs-nav",
    title: "Uinnlogget pensjonskalkulator vs Nav",
    description:
      "Forskjellen på uinnlogget anslag og Navs innloggede pensjonskalkulator — og når du bør bruke hvilken.",
    blurb:
      "Når uinnlogget anslag er nok — og når du bør bruke Navs innloggede kalkulator.",
    group: "start",
    lastmod: "2026-09-10",
  },
  {
    slug: "hva-er-tjenestepensjon",
    path: "/guider/hva-er-tjenestepensjon",
    title: "Hva er tjenestepensjon?",
    description:
      "Forklaring av tjenestepensjon, OTP, innskuddspensjon og ytelsespensjon — og hvordan du bruker tallene i en pensjonskalkulator uten BankID.",
    blurb:
      "OTP, innskudd vs ytelse, pensjonskapitalbevis — og hvordan du legger tallene inn i kalkulatoren.",
    group: "forsta",
    lastmod: "2026-09-10",
  },
  {
    slug: "ips-eller-ask",
    path: "/guider/ips-eller-ask",
    title: "IPS eller aksjesparekonto (ASK)?",
    description:
      "IPS vs aksjesparekonto for pensjonssparing: skattefordeler, binding, risiko og når hvilken passer. Oppdatert med IPS-grense 25 000 kr i 2026.",
    blurb:
      "IPS-tak 25 000 kr i 2026, binding vs fleksibilitet, og når ASK er smartere.",
    group: "sparing",
    lastmod: "2026-09-10",
  },
] as const;

export const GUIDE_GROUPS = [
  { id: "start" as const, title: "Kom i gang" },
  { id: "forsta" as const, title: "Forstå pensjonen" },
  { id: "sparing" as const, title: "Egen sparing" },
];

export function getGuide(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
