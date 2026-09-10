import type { Metadata } from "next";
import Link from "next/link";
import { GUIDE_GROUPS, GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guider | Sjekkpensjon",
  description:
    "Korte guider om pensjon — folketrygd, tjenestepensjon, AFP og sparing. Lenker til uinnlogget kalkulator på sjekkpensjon.no.",
  alternates: { canonical: "/guider" },
  openGraph: {
    title: "Guider | Sjekkpensjon",
    description:
      "Korte guider om pensjon — folketrygd, tjenestepensjon, AFP og sparing. Lenker til uinnlogget kalkulator på sjekkpensjon.no.",
    url: "https://sjekkpensjon.no/guider",
    locale: "nb_NO",
    type: "website",
  },
};

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

      <div className="mt-8 space-y-8">
        {GUIDE_GROUPS.map((group) => {
          const items = GUIDES.filter((g) => g.group === group.id);
          if (items.length === 0) return null;
          return (
            <section key={group.id} aria-labelledby={`group-${group.id}`}>
              <h2
                id={`group-${group.id}`}
                className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {group.title}
              </h2>
              <ul className="mt-3 space-y-3">
                {items.map((g) => (
                  <li key={g.path}>
                    <Link
                      href={g.path}
                      className="block rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary-soft/40 sm:p-5"
                    >
                      <span className="font-semibold text-primary">
                        {g.title}
                      </span>
                      <span className="mt-1 block text-sm text-slate-600">
                        {g.blurb}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
