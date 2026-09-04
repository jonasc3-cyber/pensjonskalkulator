import {
  CURRENT_YEAR,
  DEFAULT_LEVETID_ANNUITET,
  GROV_NETTO_ANDEL,
  SCENARIO_AVKASTNING_DELTA,
} from "../constants";
import { annuityPresentValue } from "./tp";
import { defaultReturnForKind } from "./saving";
import type {
  CalculationResult,
  CalculatorInputs,
  SavingAccount,
  ScenarioKey,
  TpPayoutMode,
} from "./types";

const SCENARIO_LABELS: Record<ScenarioKey, string> = {
  low: "Pessimistisk",
  base: "Basis",
  high: "Optimistisk",
};

/** Syntetisk konto-id når brukeren ikke har (eller ikke velger) en eksisterende sparekonto. */
export const SYNTHETIC_GOAL_ACCOUNT_ID = "__synthetic_fond__";

export interface GoalSeekAccountOption {
  id: string;
  label: string;
  balance: number;
  monthly: number;
  expectedReturn: number;
  synthetic: boolean;
}

/**
 * Inverterer innskuddsløkken balance = (balance + C) * (1+r) over Y år.
 * Returnerer nødvendig årlig innskudd C for å nå FV.
 */
export function requiredAnnualContribution(
  futureValue: number,
  existingBalance: number,
  rate: number,
  years: number,
): number {
  const fv = Math.max(0, futureValue);
  const b0 = Math.max(0, existingBalance);
  const y = Math.max(0, years);

  if (y === 0) {
    return Math.max(0, fv - b0);
  }

  if (Math.abs(rate) < 1e-9) {
    return (fv - b0) / y;
  }

  const growth = Math.pow(1 + rate, y);
  const denominator = ((1 + rate) * (growth - 1)) / rate;
  if (Math.abs(denominator) < 1e-12) {
    return Math.max(0, (fv - b0) / y);
  }
  return (fv - b0 * growth) / denominator;
}

export interface RequiredMonthlySavingParams {
  /** Gap i dagens kroner (samme basis som vist total — brutto eller netto). */
  gapMonthlyReal: number;
  yearsToRetirement: number;
  inflation: number;
  existingBalance: number;
  expectedReturn: number;
  payoutMode: TpPayoutMode;
  payoutYears: number;
  retirementAge: number;
  /** 1 for brutto, GROV_NETTO_ANDEL når showNet (siden sparing projiseres brutto). */
  netFactor: number;
}

/**
 * Nødvendig månedlig sparing for å lukke et månedlig gap (dagens kroner).
 * Speiler projectSaving baklengs (inkl. utbetalingsrente 0,6·r og inflasjonsdeflatering).
 */
export function requiredMonthlySaving(
  params: RequiredMonthlySavingParams,
): number {
  const {
    gapMonthlyReal,
    yearsToRetirement,
    inflation,
    existingBalance,
    expectedReturn,
    payoutMode,
    payoutYears,
    retirementAge,
    netFactor,
  } = params;

  const gReal = Math.max(0, gapMonthlyReal);
  if (gReal <= 0) return 0;

  const y = Math.max(0, yearsToRetirement);
  const nf = netFactor > 0 ? netFactor : 1;
  const inflationFactor =
    y > 0 ? Math.pow(1 + Math.max(0, inflation), y) : 1;

  // Nominelt årlig brutto-behov ved uttak (invers av toReal * netFactor)
  const gNomYear = (12 * gReal * inflationFactor) / nf;

  const n =
    payoutMode === "livsvarig"
      ? Math.max(1, DEFAULT_LEVETID_ANNUITET - retirementAge)
      : Math.max(1, payoutYears);

  const r = Math.max(0, expectedReturn);
  const rPayout = r * 0.6;
  const fv = annuityPresentValue(gNomYear, rPayout, n);

  const annual = requiredAnnualContribution(fv, existingBalance, r, y);
  return Math.max(0, annual / 12);
}

export interface GoalSeekResult {
  targetMonthly: number;
  coveredMonthly: number;
  gapMonthly: number;
  alreadyMet: boolean;
  marginMonthly: number;
  yearsToRetirement: number;
  currentMonthlySaving: number;
  /** Basis nødvendig sparing minus nåværende sparing på målkontoen. */
  monthlyDiff: number;
  required: Record<
    ScenarioKey,
    { key: ScenarioKey; label: string; monthly: number }
  >;
  account: GoalSeekAccountOption;
}

function pickDefaultAccount(
  savings: SavingAccount[],
): SavingAccount | null {
  const preferred = savings.find(
    (a) => a.kind === "fond" || a.kind === "ips",
  );
  if (preferred) return preferred;
  return savings[0] ?? null;
}

function accountLabel(account: SavingAccount): string {
  if (account.label?.trim()) return account.label.trim();
  const kindLabels: Record<string, string> = {
    ips: "IPS",
    ask: "Aksjesparekonto (ASK)",
    fond: "Fond",
    bank: "Bankinnskudd",
    annet: "Annet",
  };
  const kindLabel = kindLabels[account.kind] ?? account.kind;
  if (account.provider?.trim() && account.provider !== "Annet") {
    return `${kindLabel} (${account.provider})`;
  }
  return kindLabel;
}

/** Bygg valg for målkonto: eksisterende + evt. syntetisk «ny fondskonto». */
export function goalAccountOptions(
  savings: SavingAccount[],
): GoalSeekAccountOption[] {
  const options: GoalSeekAccountOption[] = savings.map((a) => ({
    id: a.id,
    label: accountLabel(a),
    balance: a.balance,
    monthly: a.monthly,
    expectedReturn: a.expectedReturn,
    synthetic: false,
  }));

  options.push({
    id: SYNTHETIC_GOAL_ACCOUNT_ID,
    label:
      savings.length === 0
        ? "Ny fondskonto (standard avkastning)"
        : "Ny målspareløsning (fond)",
    balance: 0,
    monthly: 0,
    expectedReturn: defaultReturnForKind("fond"),
    synthetic: true,
  });

  return options;
}

export function defaultGoalAccountId(savings: SavingAccount[]): string {
  const picked = pickDefaultAccount(savings);
  return picked?.id ?? SYNTHETIC_GOAL_ACCOUNT_ID;
}

/**
 * Månedlig pensjon allerede dekket uten målkontoen (FT+TP+AFP + øvrig sparing),
 * i samme basis som resultattallene (dagens kroner, brutto/netto).
 */
export function coveredOtherMonthly(
  result: CalculationResult,
  targetAccountId: string,
): number {
  const base = result.scenarios.base;
  const ftTpAfp =
    base.folketrygd.monthly + base.tp.monthly + base.afp.monthly;

  const breakdown = base.savingBreakdown ?? [];
  const otherSaving = breakdown
    .filter((a) => a.id !== targetAccountId)
    .reduce((sum, a) => sum + a.yearly / 12, 0);

  return ftTpAfp + otherSaving;
}

export function computeGoalSeek(opts: {
  targetMonthly: number;
  inputs: CalculatorInputs;
  result: CalculationResult;
  accountId: string;
}): GoalSeekResult | null {
  const { targetMonthly, inputs, result, accountId } = opts;
  if (!(targetMonthly > 0)) return null;

  const options = goalAccountOptions(inputs.savings);
  const account =
    options.find((o) => o.id === accountId) ??
    options.find((o) => o.id === defaultGoalAccountId(inputs.savings)) ??
    options[options.length - 1];

  const yearsToRetirement = result.yearsToRetirement;
  const covered = coveredOtherMonthly(result, account.id);
  const gap = Math.max(0, targetMonthly - covered);
  const alreadyMet = targetMonthly <= covered;
  const marginMonthly = alreadyMet ? covered - targetMonthly : 0;
  const netFactor = inputs.showNet ? GROV_NETTO_ANDEL : 1;

  const keys: ScenarioKey[] = ["low", "base", "high"];
  const required = {} as GoalSeekResult["required"];

  for (const key of keys) {
    const r =
      Math.max(0, account.expectedReturn + SCENARIO_AVKASTNING_DELTA[key]);
    const monthly = alreadyMet
      ? 0
      : requiredMonthlySaving({
          gapMonthlyReal: gap,
          yearsToRetirement,
          inflation: inputs.inflation,
          existingBalance: account.balance,
          expectedReturn: r,
          payoutMode: inputs.savingPayoutMode,
          payoutYears: inputs.savingPayoutYears,
          retirementAge: inputs.retirementAge,
          netFactor,
        });
    required[key] = {
      key,
      label: SCENARIO_LABELS[key],
      monthly,
    };
  }

  const baseRequired = required.base.monthly;
  return {
    targetMonthly,
    coveredMonthly: covered,
    gapMonthly: gap,
    alreadyMet,
    marginMonthly,
    yearsToRetirement,
    currentMonthlySaving: account.monthly,
    monthlyDiff: baseRequired - account.monthly,
    required,
    account,
  };
}

/** Hjelper til tester: alder i CURRENT_YEAR-modellen. */
export function yearsUntilRetirement(
  birthYear: number,
  retirementAge: number,
): number {
  const age = CURRENT_YEAR - birthYear;
  return Math.max(0, retirementAge - age);
}
