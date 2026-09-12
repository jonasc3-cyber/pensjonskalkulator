import type { Metadata } from "next";
import { MdGuidePage } from "@/components/MdGuidePage";

const path = "/guider/pensjonskalkulator-uten-innlogging";
const title = "Pensjonskalkulator uten innlogging | Uten BankID";
const description =
  "Finn pensjonskalkulator uten BankID. Folketrygd, tjenestepensjon, AFP og sparing i samme anslag — privat, raskt, intervall. Skiller seg fra Nav (kun FT/AFP uinnlogget).";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `https://sjekkpensjon.no${path}`,
    locale: "nb_NO",
    type: "article",
  },
  twitter: {
    title,
    description,
  },
};

const faq = [
  {
    question: "Er et uinnlogget tall «riktig»?",
    answer:
      "Det er et anslag basert på det du legger inn og forenklede forutsetninger. Det er nyttig for retning og scenariotenkning — ikke som juridisk eller personlig rådgivning.",
  },
  {
    question: "Kan bankenes kalkulatorer brukes uten innlogging?",
    answer:
      "Noen har enkle demonstrasjonskalkulatorer, men de fleste personlige tall krever innlogging. De er ofte knyttet til egne produkter. Det er greit — bare vær klar over formålet.",
  },
  {
    question: "Hva med tjenestepensjon og IPS?",
    answer:
      "Tjenestepensjon er arbeidsgivers del av pensjonen din. Egen sparing (for eksempel IPS eller aksjesparekonto) er det du kan styre selv. Se guidene om tjenestepensjon og IPS eller ASK.",
  },
  {
    question: "Lagrer dere historikken min?",
    answer:
      "På sjekkpensjon.no er poenget at du skal kunne beregne uten å opprette bruker. Se Om-siden for hvordan løsningen er tenkt.",
  },
] as const;

export default function Page() {
  return (
    <MdGuidePage
      slug="pensjonskalkulator-uten-innlogging"
      path={path}
      h1="Pensjonskalkulator uten innlogging (uten BankID)"
      faq={faq}
    />
  );
}
