export function Banner() {
  return (
    <div
      className="border-b border-amber-200 bg-amber-50"
      role="status"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 text-sm text-amber-950 sm:px-6">
        <strong className="font-semibold">Forenklet modell.</strong>{" "}
        Vi bruker tilnærmede delingstall og forenklede AFP-/garantipensjonsregler.
        Resultatene er <em>intervaller</em> (pessimistisk / basis / optimistisk), ikke ett «fasitsvar».
        Sjekk alltid{" "}
        <a
          href="https://www.nav.no/dinpensjon"
          className="underline hover:text-amber-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          Din pensjon hos NAV
        </a>{" "}
        for offisielle tall.
      </div>
    </div>
  );
}
