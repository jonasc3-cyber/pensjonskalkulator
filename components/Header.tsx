"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function navClass(active: boolean): string {
  const base =
    "rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3";
  if (active) {
    return `${base} bg-primary-soft text-primary shadow-sm ring-1 ring-primary/15`;
  }
  return `${base} text-slate-700 hover:bg-primary-soft/70 hover:text-primary`;
}

export function Header() {
  const pathname = usePathname();
  const onKalkulator = pathname === "/";
  const onOm = pathname === "/om" || pathname.startsWith("/om/");
  const onGuider = pathname === "/guider" || pathname.startsWith("/guider/");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-3 px-4 sm:h-14 sm:gap-4 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pk-mark.svg"
            alt=""
            width={36}
            height={36}
            className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
          />
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
            className={navClass(onKalkulator)}
            aria-current={onKalkulator ? "page" : undefined}
          >
            Kalkulator
          </Link>
          <Link
            href="/guider"
            className={navClass(onGuider)}
            aria-current={onGuider ? "page" : undefined}
          >
            Guider
          </Link>
          <Link
            href="/om"
            className={navClass(onOm)}
            aria-current={onOm ? "page" : undefined}
          >
            Om
            <span className="hidden sm:inline"> modellen</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
