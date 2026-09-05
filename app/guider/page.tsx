import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guider | Sjekkpensjon",
  description:
    "Korte guider om pensjon — folketrygd, tjenestepensjon, AFP og sparing. Lenker til uinnlogget kalkulator på sjekkpensjon.no.",
  alternates: { canonical: "/guider" },
};

const GUIDES = [
  {
    href: "/guider/hvor-mye-far-jeg-i-pensjon",
    title: "Hvor mye får jeg i pensjon?",
    blurb:
      "Tre pilarer + AFP, hvorfor tall spriker, og hvordan du får et raskt anslag uten BankID.",
  },
] as const;

export default function GuiderIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-sm text-muted-foreground">
        <Link
          href="/"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          ← Tilbake til kalkulatoren
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">
        Guider
      </h1>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Korte forklaringer som peker tilbake til kalkulatoren — uten innlogging
        og uten affiliate.
      </p>
      <ul className="mt-6 space-y-3">
        {GUIDES.map((g) => (
          <li key={g.href}>
            <Link
              href={g.href}
              className="block rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary-soft/40 sm:p-5"
            >
              <span className="font-semibold text-primary">{g.title}</span>
              <span className="mt-1 block text-sm text-slate-600">{g.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
