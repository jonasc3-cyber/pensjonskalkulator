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

export default function Page() {
  return (
    <MdGuidePage
      slug="afp-privat"
      path={path}
      h1="Hva er AFP privat?"
    />
  );
}
