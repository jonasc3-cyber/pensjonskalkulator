import type { Metadata } from "next";
import { MdGuidePage } from "@/components/MdGuidePage";

const path = "/guider/delingstall";
const title = "Delingstall i pensjon: slik påvirker det hva du får utbetalt";
const description =
  "Hva er delingstall? Enkel formel (beholdning ÷ delingstall), tidligere vs senere uttak, årskull og levealdersjustering — med intervallanslag uten BankID.";

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
    question: "Hva er delingstall?",
    answer:
      "Delingstall er tallet Nav bruker til å gjøre pensjonsbeholdningen om til årlig alderspensjon i det nye systemet. Hovedregelen er: årlig inntektspensjon ≈ pensjonsbeholdning ÷ delingstall. Jo høyere delingstall, jo lavere årlig utbetaling.",
  },
  {
    question: "Hvorfor blir årlig pensjon lavere hvis jeg tar ut tidligere?",
    answer:
      "Ved tidlig uttak er delingstallet høyere fordi den samme beholdningen fordeles på flere forventede pensjonsår. Senere uttak gir lavere delingstall og høyere årlig beløp — over færre år. Delingstallene er laget for å være nøytrale over livet.",
  },
  {
    question: "Hvem bruker delingstall?",
    answer:
      "Født 1963 eller senere bruker delingstall (ny modell). Født 1954–1962 har kombinasjon av forholdstall og delingstall. Født 1953 eller tidligere bruker i hovedsak forholdstall. Endelige delingstall fastsettes innen 1. juli det året kullet fyller 61.",
  },
  {
    question: "Kan jeg se effekten av delingstall uten BankID?",
    answer:
      "På sjekkpensjon.no får du intervallanslag for ulike uttaksaldre uten innlogging. Det viser retning og størrelsesorden — ikke Nav-vedtak. Offisielle tall finner du i Din pensjon hos Nav.",
  },
] as const;

export default function Page() {
  return (
    <MdGuidePage
      slug="delingstall"
      path={path}
      h1="Hva er delingstall?"
      faq={faq}
    />
  );
}
