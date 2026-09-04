import { CURRENT_YEAR, DEFAULT_LEVETID_ANNUITET } from "../constants";
import { annuityPayment } from "./tp";
import type { TpPayoutMode } from "./types";

export interface SavingParams {
  birthYear: number;
  retirementAge: number;
  monthlyContribution: number;
  existingBalance: number;
  expectedReturn: number;
  payoutMode: TpPayoutMode;
  payoutYears: number;
}

export interface SavingResult {
  balanceAtRetirement: number;
  yearlyPayout: number;
  monthlyPayout: number;
}

/** Fremskriv egen sparing med månedlig innskudd (forenklet til årssteg). */
export function projectSaving(params: SavingParams): SavingResult {
  const age = CURRENT_YEAR - params.birthYear;
  const years = Math.max(0, params.retirementAge - age);
  const annualContribution = Math.max(0, params.monthlyContribution) * 12;
  let balance = Math.max(0, params.existingBalance);

  for (let i = 0; i < years; i++) {
    balance = (balance + annualContribution) * (1 + params.expectedReturn);
  }

  const payoutYears =
    params.payoutMode === "livsvarig"
      ? Math.max(1, DEFAULT_LEVETID_ANNUITET - params.retirementAge)
      : Math.max(1, params.payoutYears);

  const yearly = annuityPayment(balance, params.expectedReturn * 0.6, payoutYears);
  // Litt lavere rente i utbetalingsfase (forenklet forsiktighet)

  return {
    balanceAtRetirement: balance,
    yearlyPayout: yearly,
    monthlyPayout: yearly / 12,
  };
}
