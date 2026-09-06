/** Calm, non-affiliate hint for pasting balances from Norsk Pensjon. */
export function NorskPensjonHint() {
  return (
    <>
      Du kan slå opp og lime inn saldo fra pensjonskapitalbevis /{" "}
      <a
        href="https://norskpensjon.no"
        className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
        target="_blank"
        rel="noopener noreferrer"
      >
        Norsk Pensjon
      </a>
      .
    </>
  );
}
