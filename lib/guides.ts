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
    title: "Hva får jeg i pensjon?",
    description:
      "Hva får jeg i pensjon fra folketrygd, tjenestepensjon, AFP og sparing? Enkel oversikt — og estimat uten BankID på sjekkpensjon.no.",
    blurb:
      "Tre pilarer + AFP, hvorfor tall spriker, og hvordan du får et raskt anslag uten BankID.",
    group: "start",
    lastmod: "2026-09-12",
  },
  {
    slug: "pensjonskalkulator-uten-innlogging",
    path: "/guider/pensjonskalkulator-uten-innlogging",
    title: "Pensjonskalkulator uten innlogging",
    description:
      "Finn pensjonskalkulator uten BankID. Folketrygd, tjenestepensjon, AFP og sparing i samme anslag — privat, raskt, intervall. Skiller seg fra Nav (kun FT/AFP uinnlogget).",
    blurb:
      "Uten BankID: når uinnlogget anslag er nok, og hvordan sjekkpensjon.no skiller seg fra Nav og bankene.",
    group: "start",
    lastmod: "2026-09-12",
  },
  {
    slug: "uinnlogget-vs-nav",
    path: "/guider/uinnlogget-vs-nav",
    title: "Uinnlogget pensjonskalkulator vs Nav og Norsk Pensjon",
    description:
      "Forskjellen på sjekkpensjon.no (uinnlogget anslag), Navs Din pensjon og Norsk Pensjon — og når du bør bruke hvilken.",
    blurb:
      "Når uinnlogget anslag er nok — og når du bør bruke Navs innloggede kalkulator.",
    group: "start",
    lastmod: "2026-09-12",
  },
  {
    slug: "jobbe-ved-siden-av-pensjon",
    path: "/guider/jobbe-ved-siden-av-pensjon",
    title: "Jobbe ved siden av pensjon: alderspensjon, AFP og skatt — kort forklart",
    description:
      "Kan du jobbe ved siden av pensjonen? Alderspensjon avkortes normalt ikke av jobb (Nav), pluss gradert uttak, AFP privat og skatt — uten BankID-estimat.",
    blurb:
      "Alderspensjon avkortes normalt ikke av jobb — pluss gradert uttak, AFP privat og skatt.",
    group: "start",
    lastmod: "2026-09-12",
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
    slug: "nar-ta-ut-pensjon",
    path: "/guider/nar-ta-ut-pensjon",
    title: "Når ta ut pensjon?",
    description:
      "Når ta ut alderspensjon — 62, 67 eller senere? Delingstall og levealdersjustering forklart enkelt, pluss hvordan du tester scenarier uten BankID.",
    blurb:
      "62, 67 eller senere: delingstall, levealdersjustering og hvordan du tester scenarier uten BankID.",
    group: "forsta",
    lastmod: "2026-09-10",
  },
  {
    slug: "afp-privat",
    path: "/guider/afp-privat",
    title: "AFP privat",
    description:
      "Hva er AFP i privat sektor? Vilkår (7 av 9 år), uttak fra 62, kronetillegg og hvordan AFP påvirker estimater i en pensjonskalkulator uten BankID.",
    blurb:
      "Vilkår (7 av 9 år), uttak fra 62, kronetillegg — og hvordan AFP påvirker estimatet.",
    group: "forsta",
    lastmod: "2026-09-10",
  },
  {
    slug: "fripolise",
    path: "/guider/fripolise",
    title: "Fripolise: hva det er, og hva du gjør med den",
    description:
      "Hva er en fripolise? Forskjellen mot pensjonskapitalbevis, hvordan du finner den via Norsk Pensjon, og hvordan du tar den med i en pensjonskalkulator uten BankID.",
    blurb:
      "Fripolise vs pensjonskapitalbevis, Norsk Pensjon, og hvordan du tar den med i estimatet.",
    group: "forsta",
    lastmod: "2026-09-10",
  },
  {
    slug: "pensjonskapitalbevis",
    path: "/guider/pensjonskapitalbevis",
    title: "Pensjonskapitalbevis: hva det er, og hvordan det skiller seg fra fripolise",
    description:
      "Hva er et pensjonskapitalbevis? Forskjellen mot fripolise, hvordan du finner det via Norsk Pensjon, og hvordan du legger saldoen inn i en pensjonskalkulator uten BankID.",
    blurb:
      "PKB vs fripolise, Norsk Pensjon, og hvordan du legger saldoen inn i estimatet.",
    group: "forsta",
    lastmod: "2026-09-12",
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
  {
    slug: "hvor-mye-bor-jeg-spare-til-pensjon",
    path: "/guider/hvor-mye-bor-jeg-spare-til-pensjon",
    title: "Hvor mye bør jeg spare til pensjon?",
    description:
      "Finn pensjonsgapet ditt og en enkel tommelfingerregel for sparing. Knytt til Spar for mål på sjekkpensjon.no — uten BankID, uten produktpress.",
    blurb:
      "Pensjonsgap, tommelfingerregel for sparing, og «Spar for mål» uten BankID.",
    group: "sparing",
    lastmod: "2026-09-10",
  },
  {
    slug: "pensjon-selvstendig-naringsdrivende",
    path: "/guider/pensjon-selvstendig-naringsdrivende",
    title: "Pensjon for selvstendig næringsdrivende: OTP, IPS og sparing",
    description:
      "Pensjon som ENK eller AS-eier: ingen automatisk OTP, frivillig innskuddspensjon, IPS og hvordan du modellerer det i en pensjonskalkulator uten BankID.",
    blurb:
      "ENK/AS uten automatisk OTP: frivillig innskudd, IPS og hvordan du modellerer gapet.",
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
