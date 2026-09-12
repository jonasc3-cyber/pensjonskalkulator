import type { Metadata } from "next";
import { MdGuidePage } from "@/components/MdGuidePage";

const path = "/guider/jobbe-ved-siden-av-pensjon";
const title =
  "Jobbe ved siden av pensjon: alderspensjon, AFP og skatt — kort forklart";
const description =
  "Kan du jobbe ved siden av pensjonen? Alderspensjon avkortes normalt ikke av jobb (Nav), pluss gradert uttak, AFP privat og skatt — uten BankID-estimat.";

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
      slug="jobbe-ved-siden-av-pensjon"
      path={path}
      h1="Jobbe ved siden av pensjon: alderspensjon, AFP og skatt — kort forklart"
    />
  );
}
