import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-sm font-bold text-white"
            aria-hidden
          >
            PK
          </span>
          <div>
            <p className="text-base font-semibold text-slate-900 group-hover:text-teal-800">
              Pensjonskalkulator
            </p>
            <p className="text-xs text-slate-500">Forenklet modell · personvern først</p>
          </div>
        </Link>
        <nav className="flex items-center gap-4 text-sm" aria-label="Hovednavigasjon">
          <Link
            href="/"
            className="font-medium text-slate-700 hover:text-teal-800"
          >
            Kalkulator
          </Link>
          <Link
            href="/om"
            className="font-medium text-slate-700 hover:text-teal-800"
          >
            Om modellen
          </Link>
        </nav>
      </div>
    </header>
  );
}
