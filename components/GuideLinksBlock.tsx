import Link from "next/link";

const GUIDES = [
  {
    href: "/guider/pensjonskalkulator-uten-innlogging",
    title: "Pensjonskalkulator uten BankID",
    blurb: "Hvorfor uinnlogget anslag, og hvordan vi skiller oss fra Nav og bankene.",
  },
  {
    href: "/guider/uinnlogget-vs-nav",
    title: "Uinnlogget vs Nav og Norsk Pensjon",
    blurb: "Når raskt estimat er nok — og når du bør logge inn et annet sted.",
  },
  {
    href: "/guider/hvor-mye-far-jeg-i-pensjon",
    title: "Hva får jeg i pensjon?",
    blurb: "Folketrygd, tjenestepensjon, AFP og sparing — kort oversikt.",
  },
  {
    href: "/guider/nar-ta-ut-pensjon",
    title: "Når ta ut pensjon?",
    blurb: "62, 67 eller senere: delingstall og hvordan du tester scenarier.",
  },
  {
    href: "/guider/pensjonskapitalbevis",
    title: "Pensjonskapitalbevis",
    blurb: "PKB vs fripolise, Norsk Pensjon, og hvordan du tar saldoen med i estimatet.",
  },
  {
    href: "/guider/jobbe-ved-siden-av-pensjon",
    title: "Jobbe ved siden av pensjon",
    blurb: "Alderspensjon avkortes normalt ikke av jobb — pluss AFP og skatt.",
  },
] as const;

/** Compact, visible internal-link block for homepage SEO (not only FAQ). */
export function GuideLinksBlock() {
  return (
    <section
      className="mt-10 border-t border-border pt-8 sm:mt-12 sm:pt-10"
      aria-labelledby="guides-heading"
    >
      <h2
        id="guides-heading"
        className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
      >
        Populære guider
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Korte forklaringer som peker tilbake til kalkulatoren — uten innlogging.
        Se også{" "}
        <Link
          href="/guider"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          alle guider
        </Link>
        .
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <li key={g.href}>
            <Link
              href={g.href}
              className="flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary-soft/40 sm:p-5"
            >
              <span className="text-sm font-semibold text-primary">{g.title}</span>
              <span className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                {g.blurb}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
