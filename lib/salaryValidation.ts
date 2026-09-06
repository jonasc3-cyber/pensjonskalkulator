import { formatNumber } from "@/lib/format";

/** Matches CurrencyInput min on årslønn — must be > 0 for a sensible estimate. */
export const ANNUAL_SALARY_MIN = 1;

/**
 * Upper bound for årslønn (kr). Keeps the field from accepting absurd values
 * that still produce a confusing garantipensjon-only result.
 */
export const ANNUAL_SALARY_MAX = 50_000_000;

export type SalaryValidation =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Client-side validation for årslønn brutto.
 * Empty / 0 / negative → error (would otherwise show only garantipensjon).
 */
export function validateAnnualSalary(salary: number): SalaryValidation {
  if (!Number.isFinite(salary) || salary <= 0) {
    return {
      ok: false,
      message: "Oppgi en årslønn større enn 0 kr for å få et meningsfullt estimat.",
    };
  }
  if (salary > ANNUAL_SALARY_MAX) {
    return {
      ok: false,
      message: `Årslønn kan ikke være over ${formatNumber(ANNUAL_SALARY_MAX)} kr.`,
    };
  }
  return { ok: true };
}

export function isValidAnnualSalary(salary: number): boolean {
  return validateAnnualSalary(salary).ok;
}
