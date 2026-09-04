import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm"
            aria-hidden
          >
            PK
          </span>
          <div>
            <p className="text-base font-semibold text-primary group-hover:text-primary-mid">
              Pensjonskalkulator
            </p>
            <p className="text-xs text-muted-foreground">
              Forenklet modell · personvern først
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-2" aria-label="Hovednavigasjon">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 font-medium text-slate-700 transition-colors hover:bg-primary-soft hover:text-primary"
          >
            Kalkulator
          </Link>
          <Link
            href="/om"
            className="rounded-lg px-3 py-1.5 font-medium text-slate-700 transition-colors hover:bg-primary-soft hover:text-primary"
          >
            Om modellen
          </Link>
        </nav>
      </div>
    </header>
  );
}
