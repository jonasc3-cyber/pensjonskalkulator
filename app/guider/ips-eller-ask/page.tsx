import type { Metadata } from "next";
import { MdGuidePage } from "@/components/MdGuidePage";

const path = "/guider/ips-eller-ask";
const title = "IPS eller aksjesparekonto (ASK)? | Pensjonssparing 2026";
const description =
  "IPS vs aksjesparekonto for pensjonssparing: skattefordeler, binding, risiko og når hvilken passer. Oppdatert med IPS-grense 25 000 kr i 2026.";

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
      slug="ips-eller-ask"
      path={path}
      h1="IPS eller aksjesparekonto (ASK) for pensjonssparing?"
    />
  );
}
