/**
 * Forenklet delingstall for ny folketrygd.
 *
 * Ved alder 67 brukes NAV-tall per fødselskohort (endelige for 1954–1965,
 * prognoser for yngre kull — NAV Delingstall.xlsx 26. juni 2026).
 * Andre uttaksaldre skalerer relativt til en forenklet alderskurve.
 *
 * Dette erstatter IKKE NAV-kalkulatoren / offisiell kohorttabell i full bredde.
 */

import { DELINGSTALL_AT_67_SAMPLES } from "../constants";

/** Relativ alderskurve (faktor vs. 67). Forenklet form — ikke offisiell tabell. */
const AGE_FACTOR_VS_67: Record<number, number> = {
  62: 21.48 / 17.72,
  63: 20.69 / 17.72,
  64: 19.92 / 17.72,
  65: 19.17 / 17.72,
  66: 18.44 / 17.72,
  67: 1,
  68: 17.02 / 17.72,
  69: 16.34 / 17.72,
  70: 15.68 / 17.72,
  71: 15.04 / 17.72,
  72: 14.42 / 17.72,
  73: 13.82 / 17.72,
  74: 13.24 / 17.72,
  75: 12.68 / 17.72,
};

/** Kohort → delingstall @ 67 (endelige + utvalgte prognoser). */
const COHORT_AT_67: { birthYear: number; delingstall: number }[] = (() => {
  const map = new Map<number, number>([
    [1960, 15.88],
    [1961, 16.01],
    [1962, 16.08],
    [1964, 16.26],
    [1966, 16.43],
    [1975, 17.23],
    [1990, 18.85],
    [1995, 19.36],
  ]);
  for (const s of DELINGSTALL_AT_67_SAMPLES) {
    map.set(s.birthYear, s.delingstall);
  }
  return [...map.entries()]
    .map(([birthYear, delingstall]) => ({ birthYear, delingstall }))
    .sort((a, b) => a.birthYear - b.birthYear);
})();

/** Lineær interpolasjon (ekstrapolasjon klippes til endepunkter). */
function delingstallAt67ForCohort(birthYear: number): number {
  const sorted = COHORT_AT_67;
  if (birthYear <= sorted[0].birthYear) return sorted[0].delingstall;
  if (birthYear >= sorted[sorted.length - 1].birthYear) {
    return sorted[sorted.length - 1].delingstall;
  }
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (birthYear === a.birthYear) return a.delingstall;
    if (birthYear > a.birthYear && birthYear < b.birthYear) {
      const t = (birthYear - a.birthYear) / (b.birthYear - a.birthYear);
      return a.delingstall + t * (b.delingstall - a.delingstall);
    }
  }
  return sorted[sorted.length - 1].delingstall;
}

/**
 * Tilnærmet delingstall for uttaksalder 62–75.
 * `birthYear` brukes til å ankre nivået ved 67 (NAV kohort/prognose).
 * Uten birthYear brukes 1985-prognosen (18,32) som standard anker.
 */
export function getDelingstall(
  uttaksalder: number,
  birthYear: number = 1985,
): number {
  const age = Math.round(Math.min(75, Math.max(62, uttaksalder)));
  const at67 = delingstallAt67ForCohort(birthYear);
  const factor = AGE_FACTOR_VS_67[age] ?? 1;
  return at67 * factor;
}

export function listDelingstall(
  birthYear: number = 1985,
): { age: number; delingstall: number }[] {
  return Object.keys(AGE_FACTOR_VS_67)
    .map(Number)
    .sort((a, b) => a - b)
    .map((age) => ({
      age,
      delingstall: getDelingstall(age, birthYear),
    }));
}
