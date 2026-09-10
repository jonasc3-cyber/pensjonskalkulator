import type { Metadata } from "next";
import Link from "next/link";
import { GUIDE_GROUPS, GUIDES } from "@/lib/guides";

const guiderTitle = "Guider | Sjekkpensjon";
const guiderDescription =
  "Korte guider om pensjon — folketrygd, tjenestepensjon, AFP og sparing. Lenker til uinnlogget kalkulator på sjekkpensjon.no.";

export const metadata: Metadata = {
  title: guiderTitle,
  description: guiderDescription,
  alternates: { canonical: "/guider" },
  openGraph: {
    title: guiderTitle,
    description: guiderDescription,
    url: "https://sjekkpensjon.no/guider",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    title: guiderTitle,
    description: guiderDescription,
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
