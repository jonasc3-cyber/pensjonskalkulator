import type { Metadata } from "next";
import { MdGuidePage } from "@/components/MdGuidePage";

const path = "/guider/nar-ta-ut-pensjon";
const title = "Når ta ut pensjon? 62, 67 eller 70 – slik tenker du";
const description =
  "Når ta ut alderspensjon — 62, 67 eller senere? Delingstall og levealdersjustering forklart enkelt, pluss hvordan du tester scenarier uten BankID.";

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
      slug="nar-ta-ut-pensjon"
      path={path}
      h1="Når lønner det seg å ta ut pensjon?"
    />
  );
}
