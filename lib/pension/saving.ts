import { CURRENT_YEAR, DEFAULT_LEVETID_ANNUITET } from "../constants";
import { annuityPayment } from "./tp";
import type { SavingAccount, SavingKind, TpPayoutMode } from "./types";

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

export interface SavingAccountResult extends SavingResult {
  id: string;
  label: string;
}

export interface MultiSavingResult extends SavingResult {
  accounts: SavingAccountResult[];
}

/** Sensible default expected return (decimal) by account kind. */
export function defaultReturnForKind(kind: SavingKind): number {
  switch (kind) {
    case "ips":
    case "ask":
    case "fond":
      return 0.06;
    case "bank":
      return 0.025;
    case "annet":
    default:
      return 0.04;
  }
}

export const SAVING_KIND_LABELS: Record<SavingKind, string> = {
  ips: "IPS",
  ask: "Aksjesparekonto (ASK)",
  fond: "Fond",
  bank: "Bankinnskudd",
  annet: "Annet",
};

export const SAVING_PROVIDERS = [
  "Nordnet",
  "DNB",
  "Storebrand",
  "Nordea",
  "KLP",
  "Danske Bank",
  "Annet",
] as const;

/** Fremskriv én sparekonto med månedlig innskudd (forenklet til årssteg). */
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

  // Litt lavere rente i utbetalingsfase (forenklet forsiktighet)
  const yearly = annuityPayment(balance, params.expectedReturn * 0.6, payoutYears);

  return {
    balanceAtRetirement: balance,
    yearlyPayout: yearly,
    monthlyPayout: yearly / 12,
  };
}

function accountDisplayLabel(account: SavingAccount): string {
  if (account.label?.trim()) return account.label.trim();
  const kindLabel = SAVING_KIND_LABELS[account.kind];
  if (account.provider?.trim() && account.provider !== "Annet") {
    return `${kindLabel} (${account.provider})`;
  }
  return kindLabel;
}

/**
 * Fremskriv flere sparekontoer hver for seg og summer saldo/utbetaling.
 * `returnDelta` legges til hver kontos forventede avkastning (scenariojustering).
 */
export function projectSavings(
  accounts: SavingAccount[],
  opts: {
    birthYear: number;
    retirementAge: number;
    payoutMode: TpPayoutMode;
    payoutYears: number;
    returnDelta?: number;
  },
): MultiSavingResult {
  const delta = opts.returnDelta ?? 0;
  const projected: SavingAccountResult[] = accounts.map((account) => {
    const result = projectSaving({
      birthYear: opts.birthYear,
      retirementAge: opts.retirementAge,
      monthlyContribution: account.monthly,
      existingBalance: account.balance,
      expectedReturn: Math.max(0, account.expectedReturn + delta),
      payoutMode: opts.payoutMode,
      payoutYears: opts.payoutYears,
    });
    return {
      id: account.id,
      label: accountDisplayLabel(account),
      ...result,
    };
  });

  const balanceAtRetirement = projected.reduce(
    (sum, a) => sum + a.balanceAtRetirement,
    0,
  );
  const yearlyPayout = projected.reduce((sum, a) => sum + a.yearlyPayout, 0);

  return {
    balanceAtRetirement,
    yearlyPayout,
    monthlyPayout: yearlyPayout / 12,
    accounts: projected,
  };
}

let savingIdCounter = 0;

/** Create a new saving account with defaults for the given kind. */
export function createSavingAccount(
  kind: SavingKind = "fond",
  overrides: Partial<Omit<SavingAccount, "id" | "kind">> = {},
): SavingAccount {
  savingIdCounter += 1;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `saving-${Date.now()}-${savingIdCounter}`;

  return {
    id,
    kind,
    label: overrides.label ?? "",
    provider: overrides.provider ?? "",
    balance: overrides.balance ?? 0,
    monthly: overrides.monthly ?? 0,
    expectedReturn: overrides.expectedReturn ?? defaultReturnForKind(kind),
  };
}
