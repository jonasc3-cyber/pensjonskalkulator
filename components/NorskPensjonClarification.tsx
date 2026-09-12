import Link from "next/link";

/**
 * Honest disambiguation: we are NOT Norsk Pensjon.
 * Norsk Pensjon aggregates private agreements with login; we are an uinnlogget estimate.
 */
export function NorskPensjonClarification() {
  return (
    <aside
      className="mt-8 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5"
      aria-labelledby="vs-norsk-pensjon-heading"
    >
      <h2
        id="vs-norsk-pensjon-heading"
        className="text-sm font-semibold text-primary sm:text-base"
      >
        Ikke det samme som Norsk Pensjon
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        <strong className="font-medium text-foreground">sjekkpensjon.no</strong>{" "}
        er ikke Norsk Pensjon.{" "}
        <a
          href="https://www.norskpensjon.no"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Norsk Pensjon
        </a>{" "}
        samler private pensjonsavtaler (ofte med innlogging). Vi gir et{" "}
        <strong className="font-medium text-foreground">
          uinnlogget estimat
        </strong>{" "}
        basert på tallene du oppgir selv — lokalt i nettleseren. Les mer:{" "}
        <Link
          href="/guider/uinnlogget-vs-nav"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        >
          uinnlogget vs Nav og Norsk Pensjon
        </Link>
        .
      </p>
    </aside>
  );
}
