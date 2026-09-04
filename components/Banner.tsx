import {
  CONSTANTS_SOURCE_LINKS,
  CONSTANTS_UPDATED_LABEL,
} from "@/lib/constants";

export function Banner() {
  return (
    <div className="border-b border-info-border bg-info-bg" role="status">
      <div className="mx-auto max-w-6xl px-4 py-2.5 text-sm leading-relaxed text-info-text sm:px-6">
        <strong className="font-semibold text-primary">Forenklet modell.</strong>{" "}
        Vi bruker tilnærmede delingstall og forenklede AFP-/garantipensjonsregler.
        Resultatene er <em>intervaller</em> (pessimistisk / basis / optimistisk), ikke
        ett «fasitsvar». Sjekk alltid{" "}
        <a
          href="https://www.nav.no/dinpensjon"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Din pensjon hos NAV
        </a>{" "}
        for offisielle tall.{" "}
        <span className="whitespace-nowrap">
          Satser sist kontrollert:{" "}
          <strong className="font-semibold text-primary">
            {CONSTANTS_UPDATED_LABEL}
          </strong>
        </span>
        {" · "}
        <a
          href={CONSTANTS_SOURCE_LINKS[0].href}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          target="_blank"
          rel="noopener noreferrer"
        >
          NAV G
        </a>
      </div>
    </div>
  );
}
