import type { Metadata } from "next";
import { MdGuidePage } from "@/components/MdGuidePage";

const path = "/guider/pensjonskapitalbevis";
const title =
  "Pensjonskapitalbevis: hva det er, og hvordan det skiller seg fra fripolise";
const description =
  "Hva er et pensjonskapitalbevis? Forskjellen mot fripolise, hvordan du finner det via Norsk Pensjon, og hvordan du legger saldoen inn i en pensjonskalkulator uten BankID.";

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
    question: "Hva er et pensjonskapitalbevis?",
    answer:
      "Et pensjonskapitalbevis (PKB) er opptjent innskuddspensjon fra en tidligere jobb — den saldoen arbeidsgiver har betalt inn (pluss avkastning/kostnader), som blir stående hos pensjonsleverandøren når du slutter. Det er en kapitalsaldo som følger markedet, ikke et løfte om en bestemt årlig pensjon.",
  },
  {
    question: "Hva er forskjellen på pensjonskapitalbevis og fripolise?",
    answer:
      "Pensjonskapitalbevis kommer fra innskuddspensjon og er en kapitalsaldo med markedsrisiko. Fripolise kommer fra ytelsespensjon og har ofte en garantert ytelse. PKB kan som regel samles på egen pensjonskonto (EPK); fripolise står for seg.",
  },
  {
    question: "Forsvinner pensjonen når jeg bytter jobb?",
    answer:
      "Nei — opptjent innskudd skal normalt følge deg som pensjonskapitalbevis (eller samles på EPK). Finn oversikten via Norsk Pensjon og detaljer hos leverandøren.",
  },
  {
    question: "Er saldoen på beviset det samme som årlig pensjon?",
    answer:
      "Nei. Saldoen er kapital. Årlig utbetaling avhenger av uttaksregler, periode, avkastning og kostnader. Et estimat i en kalkulator er et intervall, ikke et vedtak.",
  },
] as const;

export default function Page() {
  return (
    <MdGuidePage
      slug="pensjonskapitalbevis"
      path={path}
      h1="Pensjonskapitalbevis: hva det er, og hvordan det skiller seg fra fripolise"
      faq={faq}
    />
  );
}
