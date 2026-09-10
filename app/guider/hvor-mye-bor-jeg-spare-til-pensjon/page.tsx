import type { Metadata } from "next";
import { MdGuidePage } from "@/components/MdGuidePage";

const path = "/guider/hvor-mye-bor-jeg-spare-til-pensjon";
const title = "Hvor mye bør jeg spare til pensjon? Enkel tommelfingerregel";
const description =
  "Finn pensjonsgapet ditt og en enkel tommelfingerregel for sparing. Knytt til Spar for mål på sjekkpensjon.no — uten BankID, uten produktpress.";

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
      slug="hvor-mye-bor-jeg-spare-til-pensjon"
      path={path}
      h1="Hvor mye bør jeg spare til pensjon? Enkel tommelfingerregel"
    />
  );
}
