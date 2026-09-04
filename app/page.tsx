import { Calculator } from "@/components/Calculator";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Pensjonskalkulator
        </h1>
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          Estimer alderspensjon fra folketrygd, tjenestepensjon, AFP og egen sparing.
          Du får et <strong className="font-semibold text-foreground">intervall</strong> — ikke ett falskt
          presist tall. Alle beregninger skjer hos deg i nettleseren.
        </p>
      </div>
      <Calculator />
    </div>
  );
}
