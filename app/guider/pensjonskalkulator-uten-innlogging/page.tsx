import type { Metadata } from "next";
import { MdGuidePage } from "@/components/MdGuidePage";

const path = "/guider/pensjonskalkulator-uten-innlogging";
const title = "Pensjonskalkulator uten innlogging | Uten BankID";
const description =
  "Finn en pensjonskalkulator uten BankID eller innlogging. Se hvordan sjekkpensjon.no skiller seg fra Nav og bankene — privat, raskt og med intervallestimat.";

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
