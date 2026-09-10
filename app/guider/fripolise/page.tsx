import type { Metadata } from "next";
import { MdGuidePage } from "@/components/MdGuidePage";

const path = "/guider/fripolise";
const title = "Fripolise: hva det er, og hva du gjør med den";
const description =
  "Hva er en fripolise? Forskjellen mot pensjonskapitalbevis, hvordan du finner den via Norsk Pensjon, og hvordan du tar den med i en pensjonskalkulator uten BankID.";

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

export default function Page() {
  return (
    <MdGuidePage
      slug="fripolise"
      path={path}
      h1="Fripolise: hva det er, og hva du gjør med den"
    />
  );
}
