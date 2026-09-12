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

export default function Page() {
  return (
    <MdGuidePage
      slug="pensjonskapitalbevis"
      path={path}
      h1="Pensjonskapitalbevis: hva det er, og hvordan det skiller seg fra fripolise"
    />
  );
}
