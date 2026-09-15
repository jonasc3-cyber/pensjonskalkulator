import { Calculator } from "@/components/Calculator";
import { FaqSection } from "@/components/FaqSection";
import { GuideLinksBlock } from "@/components/GuideLinksBlock";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { NorskPensjonClarification } from "@/components/NorskPensjonClarification";
import { PopularGuides } from "@/components/PopularGuides";
import { webApplicationJsonLd } from "@/lib/jsonld";

export default function HomePage() {
  return (
    <>
      <JsonLd data={webApplicationJsonLd()} />
      <Hero />
      <PopularGuides />
      <section
        id="kalkulator"
        className="scroll-mt-20 border-t border-border/50"
        aria-labelledby="kalkulator-heading"
      >
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:py-16">
          <div className="mb-8 max-w-2xl sm:mb-10">
            <h2
              id="kalkulator-heading"
              className="text-xl font-semibold tracking-tight text-primary sm:text-2xl"
            >
              Kalkulatoren
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Prøv kalkulatoren her. Ingen innlogging. Pensjonstallene regnes
              lokalt.
            </p>
          </div>
          <Calculator />
        </div>
      </section>
      <div className="mx-auto max-w-6xl space-y-12 px-4 pb-12 sm:space-y-14 sm:px-6 sm:pb-16 lg:space-y-16">
        <NorskPensjonClarification />
        <GuideLinksBlock />
        <FaqSection />
      </div>
    </>
  );
}
