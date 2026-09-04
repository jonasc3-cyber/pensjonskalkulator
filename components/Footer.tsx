import Link from "next/link";
import {
  CONSTANTS_SOURCE_LINKS,
  CONSTANTS_UPDATED_LABEL,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold tracking-wide">Viktig informasjon</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          Dette er en{" "}
          <strong className="text-white">forenklet</strong> pensjonskalkulator for
          illustrasjon. Den erstatter ikke NAV, Norsk Pensjon, pensjonsleverandør
          eller rådgiver. Alle beregninger skjer i nettleseren din — vi lagrer ikke
          dine tall på server. Tallene er intervaller basert på antagelser, ikke
          eksakte rettigheter.
        </p>
        <p className="mt-3 text-sm text-slate-300">
          Satser sist kontrollert:{" "}
          <strong className="text-white">{CONSTANTS_UPDATED_LABEL}</strong>
          {" · "}
          {CONSTANTS_SOURCE_LINKS.map((link, i) => (
            <span key={link.href}>
              {i > 0 ? " · " : null}
              <a
                href={link.href}
                className="underline underline-offset-2 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </span>
          ))}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
          <Link
            href="/om"
            className="underline underline-offset-2 hover:text-white"
          >
            Om modell, kilder og personvern
          </Link>
          <a
            href="https://github.com/jonasc3-cyber/pensjonskalkulator/issues"
            className="underline underline-offset-2 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tilbakemelding (GitHub)
          </a>
          <a
            href="https://www.nav.no/pensjon"
            className="underline underline-offset-2 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            NAV pensjon
          </a>
          <a
            href="https://www.norskpensjon.no"
            className="underline underline-offset-2 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Norsk Pensjon
          </a>
        </div>
        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-400">
          Uavhengig indie-prototype for personlig bruk — ikke tilknyttet NAV, bank
          eller pensjonsleverandør. Tilbakemelding via{" "}
          <a
            href="https://github.com/jonasc3-cyber/pensjonskalkulator/issues"
            className="underline underline-offset-2 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub issues
          </a>
          .
        </p>
        <p className="mt-3 text-xs text-slate-400">
          Foto:{" "}
          <a
            href="https://unsplash.com/photos/ouXNRL9DW8E"
            className="underline underline-offset-2 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
        </p>
      </div>
    </footer>
  );
}
