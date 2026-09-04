/**
 * Forenklet delingstall-tabell for ny folketrygd.
 *
 * VERIFY: Offisielle delingstall publiseres av NAV/SSB per fødselskohort.
 * Tallene under er en avrundet interpolasjon typisk for kohorter ca. 1963–1990
 * og skal IKKE brukes som erstatning for NAV-kalkulatoren.
 *
 * Kilde-idé: nav.no «delingstall» / SSB levealderjustering.
 */

const DELINGSTALL_TABLE: Record<number, number> = {
  62: 21.48,
  63: 20.69,
  64: 19.92,
  65: 19.17,
  66: 18.44,
  67: 17.72,
  68: 17.02,
  69: 16.34,
  70: 15.68,
  71: 15.04,
  72: 14.42,
  73: 13.82,
  74: 13.24,
  75: 12.68,
};

/** Returnerer tilnærmet delingstall for uttaksalder 62–75. */
export function getDelingstall(uttaksalder: number): number {
  const age = Math.round(Math.min(75, Math.max(62, uttaksalder)));
  return DELINGSTALL_TABLE[age] ?? 17.72;
}

export function listDelingstall(): { age: number; delingstall: number }[] {
  return Object.entries(DELINGSTALL_TABLE).map(([age, delingstall]) => ({
    age: Number(age),
    delingstall,
  }));
}
