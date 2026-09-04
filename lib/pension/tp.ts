import {
  CURRENT_YEAR,
  DEFAULT_AVKASTNING_TP,
  DEFAULT_LEVETID_ANNUITET,
  G_NOK,
  TP_DEFAULT_SATS,
  TP_MAKS_G,
} from "../constants";
import type { TpAccount, TpKind, TpPayoutMode } from "./types";

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
  /** Hvis satt > 0, brukes direkte som årlig utbetaling (ytelse-forenkling). */
  yearlyPensionEstimate?: number;
}

export interface TpResult {
  balanceAtRetirement: number;
  yearlyPayout: number;
  monthlyPayout: number;
}

export interface TpAccountResult extends TpResult {
  id: string;
  label: string;
}

export interface MultiTpResult extends TpResult {
  accounts: TpAccountResult[];
}

export const TP_KIND_LABELS: Record<TpKind, string> = {
  innskudd: "Innskuddspensjon",
  ytelse: "Ytelsespensjon",
  hybrid: "Hybridpensjon",
  offentlig: "Offentlig tjenestepensjon",
  annet: "Annet",
};

export const TP_PROVIDERS = [
  "DNB",
  "Storebrand",
  "KLP",
  "SPK",
  "Nordea",
  "Danica",
  "Gjensidige",
  "Annet",
] as const;

export function defaultReturnForTpKind(kind: TpKind): number {
  switch (kind) {
    case "innskudd":
    case "hybrid":
      return DEFAULT_AVKASTNING_TP;
    case "ytelse":
    case "offentlig":
      return 0.03;
    case "annet":
    default:
      return DEFAULT_AVKASTNING_TP;
  }
}

/**
 * Innskuddsbasert tjenestepensjon (OTP-forenkling):
 * årlig innskudd = sats × min(lønn, 12 G), rentes rente til uttak,
 * deretter annuitet over N år eller livsvarig til DEFAULT_LEVETID_ANNUITET.
 *
 * For ytelse/offentlig: hvis yearlyPensionEstimate er satt, brukes det direkte
 * (saldo fremskrives fortsatt med avkastning for balansevisning, men uten nye innskudd
 * med mindre contributionRate > 0).
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

  const estimate = params.yearlyPensionEstimate ?? 0;
  if (estimate > 0) {
    return {
      balanceAtRetirement: balance,
      yearlyPayout: estimate,
      monthlyPayout: estimate / 12,
    };
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

function accountDisplayLabel(account: TpAccount): string {
  if (account.label?.trim()) return account.label.trim();
  const kindLabel = TP_KIND_LABELS[account.kind];
  if (account.provider?.trim() && account.provider !== "Annet") {
    return `${kindLabel} (${account.provider})`;
  }
  return kindLabel;
}

/**
 * Fremskriv flere TP-kontoer.
 *
 * Kun kontoer med `activeContribution === true` får pågående innskudd
 * (contributionRate × min(lønn, 12 G)). Øvrige vokser kun med eksisterende saldo.
 * Hvis flere er merket aktive (feil i UI), brukes kun den første — unngår dobbelttelling.
 *
 * `returnDelta` legges til hver kontos forventede avkastning (scenariojustering).
 */
export function projectTpAccounts(
  accounts: TpAccount[],
  opts: {
    birthYear: number;
    currentSalary: number;
    retirementAge: number;
    wageGrowth: number;
    gGrowth: number;
    payoutMode: TpPayoutMode;
    payoutYears: number;
    returnDelta?: number;
  },
): MultiTpResult {
  const delta = opts.returnDelta ?? 0;
  const activeId =
    accounts.find((a) => a.activeContribution)?.id ?? null;

  const projected: TpAccountResult[] = accounts.map((account) => {
    const isActive = activeId !== null && account.id === activeId;
    const rate = isActive ? Math.max(0, account.contributionRate) : 0;
    const result = projectTp({
      birthYear: opts.birthYear,
      currentSalary: opts.currentSalary,
      retirementAge: opts.retirementAge,
      wageGrowth: opts.wageGrowth,
      gGrowth: opts.gGrowth,
      contributionRate: rate,
      existingBalance: account.balance,
      expectedReturn: Math.max(0, account.expectedReturn + delta),
      payoutMode: opts.payoutMode,
      payoutYears: opts.payoutYears,
      yearlyPensionEstimate:
        account.kind === "ytelse" || account.kind === "offentlig"
          ? account.yearlyPensionEstimate
          : undefined,
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

let tpIdCounter = 0;

/** Create a new TP account with defaults. First account should be marked active by caller. */
export function createTpAccount(
  kind: TpKind = "innskudd",
  overrides: Partial<Omit<TpAccount, "id" | "kind">> = {},
): TpAccount {
  tpIdCounter += 1;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `tp-${Date.now()}-${tpIdCounter}`;

  const isInnskuddLike = kind === "innskudd" || kind === "hybrid" || kind === "annet";

  return {
    id,
    kind,
    label: overrides.label ?? "",
    provider: overrides.provider ?? "",
    balance: overrides.balance ?? 0,
    contributionRate:
      overrides.contributionRate ?? (isInnskuddLike ? TP_DEFAULT_SATS : 0),
    expectedReturn: overrides.expectedReturn ?? defaultReturnForTpKind(kind),
    activeContribution: overrides.activeContribution ?? false,
    yearlyPensionEstimate: overrides.yearlyPensionEstimate,
  };
}

/** Ensure exactly one account is active for contributions (or none if list empty). */
export function ensureSingleActiveContribution(
  accounts: TpAccount[],
  preferredId?: string,
): TpAccount[] {
  if (accounts.length === 0) return accounts;
  const preferred =
    (preferredId && accounts.find((a) => a.id === preferredId)) ||
    accounts.find((a) => a.activeContribution) ||
    accounts[0];
  return accounts.map((a) => ({
    ...a,
    activeContribution: a.id === preferred.id,
  }));
}

/** Invers av annuityPayment: nødvendig hovedstol for gitt årlig utbetaling. */
export function annuityPresentValue(
  payment: number,
  rate: number,
  years: number,
): number {
  if (payment <= 0 || years <= 0) return 0;
  if (Math.abs(rate) < 1e-9) return payment * years;
  const growth = Math.pow(1 + rate, years);
  return (payment * (growth - 1)) / (rate * growth);
}
