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

export default function Page() {
  return (
    <MdGuidePage
      slug="pensjonskalkulator-uten-innlogging"
      path={path}
      h1="Pensjonskalkulator uten innlogging (uten BankID)"
    />
  );
}
