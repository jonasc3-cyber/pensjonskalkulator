import { Calculator } from "@/components/Calculator";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8">
      <div className="mb-4 max-w-2xl sm:mb-8">
        <h1 className="text-xl font-bold tracking-tight text-primary sm:text-3xl">
          Pensjonskalkulator
        </h1>
        <p className="mt-1 text-sm leading-snug text-slate-600 sm:mt-2 sm:text-base sm:leading-relaxed">
          <span className="sm:hidden">
            Estimer pensjon som et intervall. Alt regnes i nettleseren.
          </span>
          <span className="hidden sm:inline">
            Estimer alderspensjon fra folketrygd, tjenestepensjon, AFP og egen
            sparing. Du får et{" "}
            <strong className="font-semibold text-foreground">intervall</strong>{" "}
            — ikke ett falskt presist tall. Alle beregninger skjer hos deg i
            nettleseren.
          </span>
        </p>
      </div>
      <Calculator />
    </div>
  );
}
