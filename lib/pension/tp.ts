import { CURRENT_YEAR, DEFAULT_LEVETID_ANNUITET, G_NOK, TP_MAKS_G } from "../constants";
import type { TpPayoutMode } from "./types";

export interface TpParams {
  birthYear: number;
  currentSalary: number;
  retirementAge: number;
  wageGrowth: number;
  gGrowth: number;
  contributionRate: number;
  existingBalance: number;
  expectedReturn: number;
  payoutMode: TpPayoutMode;
  payoutYears: number;
}

export interface TpResult {
  balanceAtRetirement: number;
  yearlyPayout: number;
  monthlyPayout: number;
}

/**
 * Innskuddsbasert tjenestepensjon (OTP-forenkling):
 * årlig innskudd = sats × min(lønn, 12 G), rentes rente til uttak,
 * deretter annuitet over N år eller livsvarig til DEFAULT_LEVETID_ANNUITET.
 */
export function projectTp(params: TpParams): TpResult {
  const age = CURRENT_YEAR - params.birthYear;
  const years = Math.max(0, params.retirementAge - age);
  let g = G_NOK;
  let salary = params.currentSalary;
  let balance = Math.max(0, params.existingBalance);

  for (let i = 0; i < years; i++) {
    const base = Math.min(Math.max(0, salary), TP_MAKS_G * g);
    const contribution = params.contributionRate * base;
    balance = (balance + contribution) * (1 + params.expectedReturn);
    salary *= 1 + params.wageGrowth;
    g *= 1 + params.gGrowth;
  }

  const payoutYears =
    params.payoutMode === "livsvarig"
      ? Math.max(1, DEFAULT_LEVETID_ANNUITET - params.retirementAge)
      : Math.max(1, params.payoutYears);

  const yearly = annuityPayment(balance, params.expectedReturn, payoutYears);

  return {
    balanceAtRetirement: balance,
    yearlyPayout: yearly,
    monthlyPayout: yearly / 12,
  };
}

/** Ordinary annuity: betalinger i slutten av året, renter under utbetaling. */
export function annuityPayment(
  principal: number,
  rate: number,
  years: number,
): number {
  if (principal <= 0 || years <= 0) return 0;
  if (Math.abs(rate) < 1e-9) return principal / years;
  const factor = (rate * Math.pow(1 + rate, years)) / (Math.pow(1 + rate, years) - 1);
  return principal * factor;
}
