import { Calculator } from "@/components/Calculator";
import { FaqSection } from "@/components/FaqSection";
import { Hero } from "@/components/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="mx-auto mt-2 max-w-6xl px-4 py-6 sm:mt-0 sm:px-6 sm:py-8">
        <Calculator />
        <FaqSection />
      </div>
    </>
  );
}
