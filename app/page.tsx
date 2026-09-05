import { Calculator } from "@/components/Calculator";
import { FaqSection } from "@/components/FaqSection";
import { Hero } from "@/components/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
        <Calculator />
        <FaqSection />
      </div>
    </>
  );
}
