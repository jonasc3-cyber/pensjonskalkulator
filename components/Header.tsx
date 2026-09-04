import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-3 px-4 sm:h-14 sm:gap-4 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-sm sm:h-9 sm:w-9 sm:text-sm"
            aria-hidden
          >
            PK
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-primary group-hover:text-primary-mid sm:text-base">
              Pensjonskalkulator
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Forenklet modell · personvern først
            </p>
          </div>
        </Link>
        <nav
          className="flex shrink-0 items-center gap-0.5 text-sm sm:gap-1"
          aria-label="Hovednavigasjon"
        >
          <Link
            href="/"
            className="hidden rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-primary-soft hover:text-primary sm:inline-block sm:px-3"
          >
            Kalkulator
          </Link>
          <Link
            href="/om"
            className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-primary-soft hover:text-primary sm:px-3"
          >
            Om
            <span className="hidden sm:inline"> modellen</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
