import type { Metadata } from "next";
import { MdGuidePage } from "@/components/MdGuidePage";

const path = "/guider/hva-er-tjenestepensjon";
const title = "Hva er tjenestepensjon? | OTP, innskudd og ytelse";
const description =
  "Forklaring av tjenestepensjon, OTP, innskuddspensjon og ytelsespensjon — og hvordan du bruker tallene i en pensjonskalkulator uten BankID.";

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
      slug="hva-er-tjenestepensjon"
      path={path}
      h1="Hva er tjenestepensjon?"
    />
  );
}
