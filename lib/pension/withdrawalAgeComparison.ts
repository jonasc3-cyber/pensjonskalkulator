import { CURRENT_YEAR } from "../constants";
import { calculatePension } from "./calculate";
import type { CalculatorInputs } from "./types";

/** Faste uttaksaldre for side-by-side-sammenligning. */
export const COMPARISON_AGES = [62, 67, 70] as const;

export type ComparisonAge = (typeof COMPARISON_AGES)[number];

export interface WithdrawalAgeComparisonRow {
  age: ComparisonAge;
  /** False når brukeren allerede har passert denne alderen. */
  available: boolean;
  /** Basis-scenario månedlig pensjon; null hvis utilgjengelig. */
  monthly: number | null;
  yearly: number | null;
  replacementRate: number | null;
  /** Matcher brukerens valgte uttaksalder. */
  isSelected: boolean;
}

/**
 * Kjører calculatePension tre ganger med samme input, kun uttaksalder endret.
 * Alder som allerede er passert markeres som utilgjengelig (ingen beregning).
 */
export function compareWithdrawalAges(
  inputs: CalculatorInputs,
): WithdrawalAgeComparisonRow[] {
  const currentAge = CURRENT_YEAR - inputs.birthYear;

  return COMPARISON_AGES.map((age) => {
    const isSelected = inputs.retirementAge === age;

    if (age < currentAge) {
      return {
        age,
        available: false,
        monthly: null,
        yearly: null,
        replacementRate: null,
        isSelected,
      };
    }

    const result = calculatePension({ ...inputs, retirementAge: age });
    const base = result.scenarios.base;

    return {
      age,
      available: true,
      monthly: base.totalMonthly,
      yearly: base.totalYearly,
      replacementRate: base.replacementRate,
      isSelected,
    };
  });
}
