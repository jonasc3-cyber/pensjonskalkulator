import Link from "next/link";

/** Calm, non-affiliate hint for pasting balances from Norsk Pensjon. */
export function NorskPensjonHint() {
  return (
    <>
      Du kan slå opp og lime inn saldo fra{" "}
      <Link
        href="/guider/pensjonskapitalbevis"
        className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
      >
        pensjonskapitalbevis
      </Link>{" "}
      /{" "}
      <Link
        href="/guider/fripolise"
        className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
      >
        fripolise
      </Link>{" "}
      via{" "}
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
