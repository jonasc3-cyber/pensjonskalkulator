import type { Metadata } from "next";
import { MdGuidePage } from "@/components/MdGuidePage";

const path = "/guider/pensjon-selvstendig-naringsdrivende";
const title = "Pensjon for selvstendig næringsdrivende: OTP, IPS og sparing";
const description =
  "Pensjon som ENK eller AS-eier: ingen automatisk OTP, frivillig innskuddspensjon, IPS og hvordan du modellerer det i en pensjonskalkulator uten BankID.";

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
      slug="pensjon-selvstendig-naringsdrivende"
      path={path}
      h1="Pensjon for selvstendig næringsdrivende: OTP, IPS og sparing"
    />
  );
}
