import type { Metadata } from "next";
import { MdGuidePage } from "@/components/MdGuidePage";

const path = "/guider/garantipensjon";
const title = "Garantipensjon: hva det er, satser og hvem det gjelder";
const description =
  "Hva er garantipensjon? Ordinær vs høy sats 2026, trygdetid, avkortning mot inntektspensjon — og hvordan du ser et intervallanslag uten BankID.";

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

const faq = [
  {
    question: "Er garantipensjon det samme som minstepensjon?",
    answer:
      "I dagligtale ja — Nav bruker ofte «minstepensjon» som samlebegrep. Teknisk er garantipensjon kapittel 20 (nye regler, typisk 1963+), mens minste pensjonsnivå er kapittel 19. Hvilken tabell som gjelder, styres av fødselsår.",
  },
  {
    question: "Kan jeg ta ut garantipensjon fra 62?",
    answer:
      "Bare hvis samlet beregnet pensjon (inntekt + garanti) minst tilsvarer garantipensjon med høy sats og full trygdetid. Mange med lav opptjening må vente til 67.",
  },
  {
    question: "Påvirker jobb garantipensjonen?",
    answer:
      "Alderspensjon fra Nav avkortes normalt ikke av arbeidsinntekt etter uttak. Men ny opptjening kan øke inntektspensjonen og dermed skru ned garantitillegget (80 %-regelen) — samtidig som samlet pensjon typisk stiger.",
  },
  {
    question: "Hva er satser for garantipensjon i 2026?",
    answer:
      "Fra 1. mai 2026 med full trygdetid (40 år): høy sats 253 787 kr (typisk enslige), ordinær sats 234 765 kr (gifte/samboere der partner har relevant pensjon eller inntekt over 2 G). Se /satser og Nav for oppdaterte tall.",
  },
] as const;

export default function Page() {
  return (
    <MdGuidePage
      slug="garantipensjon"
      path={path}
      h1="Hva er garantipensjon?"
      faq={faq}
    />
  );
}
