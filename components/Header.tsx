"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

function navClass(active: boolean): string {
  const base =
    "rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3";
  if (active) {
    return `${base} bg-primary-soft text-primary shadow-sm ring-1 ring-primary/15`;
  }
  return `${base} text-slate-700 hover:bg-primary-soft/70 hover:text-primary`;
}

function menuItemClass(active: boolean): string {
  const base =
    "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";
  if (active) {
    return `${base} bg-primary-soft text-primary`;
  }
  return `${base} text-slate-700 hover:bg-muted`;
}

export function Header() {
  const pathname = usePathname();
  const onKalkulator = pathname === "/";
  const onOm = pathname === "/om" || pathname.startsWith("/om/");
  const onGuider = pathname === "/guider" || pathname.startsWith("/guider/");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    }

    function onPointerDown(e: MouseEvent | TouchEvent) {
      const target = e.target as Node | null;
      if (!target) return;
      if (menuRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setMenuOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-2 px-4 sm:h-14 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2 sm:gap-3"
          aria-label="Pensjonskalkulator — forsiden"
        >
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

        {/* Inline nav — from ~420px so ~390px phones use the menu */}
        <nav
          className="hidden min-[420px]:flex shrink-0 items-center gap-0.5 text-sm sm:gap-1"
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

        {/* Compact menu — narrow phones (~390px) */}
        <div className="relative min-[420px]:hidden">
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-primary shadow-sm transition-colors hover:bg-muted"
            aria-label={menuOpen ? "Lukk meny" : "Åpne meny"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
          {menuOpen ? (
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              aria-label="Navigasjon"
              className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg"
            >
              <Link
                href="/"
                role="menuitem"
                className={menuItemClass(onKalkulator)}
                aria-current={onKalkulator ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                Kalkulator
              </Link>
              <Link
                href="/guider"
                role="menuitem"
                className={menuItemClass(onGuider)}
                aria-current={onGuider ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                Guider
              </Link>
              <Link
                href="/om"
                role="menuitem"
                className={menuItemClass(onOm)}
                aria-current={onOm ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                Om
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
