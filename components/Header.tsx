"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

function navClass(active: boolean): string {
  const base =
    "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3";
  if (active) {
    return `${base} bg-white/15 text-white`;
  }
  return `${base} text-white/85 hover:bg-white/10 hover:text-white`;
}

function menuItemClass(active: boolean): string {
  const base =
    "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";
  if (active) {
    return `${base} bg-primary-soft text-primary`;
  }
  return `${base} text-slate-700 hover:bg-muted`;
}

function CheckMarkIcon() {
  return (
    <span
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#2563eb] sm:h-8 sm:w-8"
      aria-hidden
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const onGuider = pathname === "/guider" || pathname.startsWith("/guider/");
  const onOm = pathname === "/om" || pathname.startsWith("/om/");
  const onPersonvern =
    pathname === "/personvern" || pathname.startsWith("/personvern/");
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
    <header className="sticky top-0 z-40 bg-primary shadow-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:h-16 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2 sm:gap-2.5"
          aria-label="sjekkpensjon.no — forsiden"
        >
          <CheckMarkIcon />
          <span className="truncate text-sm font-semibold tracking-tight text-white sm:text-base">
            sjekkpensjon.no
          </span>
        </Link>

        <nav
          className="hidden min-[480px]:flex shrink-0 items-center gap-0.5 text-sm sm:gap-1"
          aria-label="Hovednavigasjon"
        >
          <Link
            href="/guider"
            className={navClass(onGuider)}
            aria-current={onGuider ? "page" : undefined}
          >
            Slik fungerer det
          </Link>
          <Link
            href="/om"
            className={navClass(onOm)}
            aria-current={onOm ? "page" : undefined}
          >
            Om pensjon
          </Link>
          <Link
            href="/personvern"
            className={navClass(onPersonvern)}
            aria-current={onPersonvern ? "page" : undefined}
          >
            Personvern
          </Link>
        </nav>

        <div className="relative min-[480px]:hidden">
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/15"
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
              className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg"
            >
              <Link
                href="/guider"
                role="menuitem"
                className={menuItemClass(onGuider)}
                aria-current={onGuider ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                Slik fungerer det
              </Link>
              <Link
                href="/om"
                role="menuitem"
                className={menuItemClass(onOm)}
                aria-current={onOm ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                Om pensjon
              </Link>
              <Link
                href="/personvern"
                role="menuitem"
                className={menuItemClass(onPersonvern)}
                aria-current={onPersonvern ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                Personvern
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
