import type { Metadata } from "next";
import { LegalMdPage } from "@/components/LegalMdPage";
import { loadContentMarkdown } from "@/lib/loadGuide";

const path = "/vilkar";
const { title, description } = loadContentMarkdown("vilkar");

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `https://sjekkpensjon.no${path}`,
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    title,
    description,
  },
};

export default function VilkarPage() {
  return (
    <LegalMdPage
      slug="vilkar"
      path={path}
      h1="Vilkår for bruk"
      related={[
        { href: "/personvern", label: "Personvern" },
        { href: "/om", label: "Om" },
      ]}
    />
  );
}
