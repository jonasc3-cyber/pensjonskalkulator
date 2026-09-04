import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm font-medium text-slate-800">Viktig informasjon</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Dette er en <strong>forenklet</strong> pensjonskalkulator for illustrasjon.
          Den erstatter ikke NAV, Norsk Pensjon, pensjonsleverandør eller rådgiver.
          Alle beregninger skjer i nettleseren din — vi lagrer ikke dine tall på server.
          Tallene er intervaller basert på antagelser, ikke eksakte rettigheter.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
          <Link href="/om" className="underline hover:text-teal-800">
            Om modell, kilder og personvern
          </Link>
          <a
            href="https://www.nav.no/pensjon"
            className="underline hover:text-teal-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            NAV pensjon
          </a>
          <a
            href="https://www.norskpensjon.no"
            className="underline hover:text-teal-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            Norsk Pensjon
          </a>
        </div>
      </div>
    </footer>
  );
}
