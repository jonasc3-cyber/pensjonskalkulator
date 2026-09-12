import type { Metadata } from "next";
import { MdGuidePage } from "@/components/MdGuidePage";

const path = "/guider/afp-privat";
const title = "AFP privat: krav, uttak og hva det betyr for pensjonen";
const description =
  "Hva er AFP i privat sektor? Vilkår (7 av 9 år), uttak fra 62, kronetillegg og hvordan AFP påvirker estimater i en pensjonskalkulator uten BankID.";

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
    question: "Hva er AFP privat?",
    answer:
      "AFP (avtalefestet pensjon) i privat sektor er en livsvarig ytelse som kommer i tillegg til alderspensjon fra folketrygden og tjenestepensjon — men bare hvis du jobber i en bedrift tilsluttet ordningen og oppfyller strenge vilkår. Den er ikke det samme som tjenestepensjon/OTP, og ikke det samme som AFP i offentlig sektor.",
  },
  {
    question: "Hvem kan få AFP i privat sektor?",
    answer:
      "Det er to sett krav: ett ved fylte 62 år, og ett på uttakstidspunktet. Hovedtrekk ved 62: ansatt og reell arbeidstaker i minst 20 % stilling i AFP-bedrift i 7 av de siste 9 årene. Ved uttak: fylt 62 år, samtidig uttak av minst 20 % alderspensjon under 70, fortsatt i jobb i AFP-bedrift, og inntekt over 1 G.",
  },
  {
    question: "Hvordan beregnes AFP privat?",
    answer:
      "Privat AFP kan bestå av en livsvarig del (0,314 % av pensjonsgrunnlaget per år, levealdersjustert), kronetillegg (1 600 kr/mnd frem til 67), og kompensasjonstillegg for enkelte årskull født 1944–1962. AFP kan ikke graderes (alltid 100 %), og du kan ha ubegrenset arbeidsinntekt uten at AFP avkortes.",
  },
  {
    question: "Hva betyr AFP i en pensjonskalkulator?",
    answer:
      "På sjekkpensjon.no kan du markere om du antar at du har AFP, og se hvordan det påvirker intervallestimatet — uten BankID. Uinnloggede anslag er forenklinger og erstatter ikke Navs Din pensjon eller afp.no for vilkår og søknad.",
  },
] as const;

export default function Page() {
  return (
    <MdGuidePage
      slug="afp-privat"
      path={path}
      h1="Hva er AFP privat?"
      faq={faq}
    />
  );
}
