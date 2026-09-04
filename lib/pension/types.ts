export type Sivilstatus = "enslig" | "gift";
export type AfpType = "privat" | "offentlig" | "ingen";
export type TpPayoutMode = "aar" | "livsvarig";
export type ScenarioKey = "low" | "base" | "high";

export type SavingKind = "ips" | "ask" | "fond" | "bank" | "annet";

export interface SavingAccount {
  id: string;
  kind: SavingKind;
  label?: string;
  provider?: string;
  balance: number;
  monthly: number;
  /** Forventet årlig avkastning som desimal (f.eks. 0.06 = 6 %). */
  expectedReturn: number;
}

export type TpKind = "innskudd" | "ytelse" | "hybrid" | "offentlig" | "annet";

export interface TpAccount {
  id: string;
  kind: TpKind;
  label?: string;
  provider?: string;
  /** Eksisterende pensjonskapital / saldo. */
  balance: number;
  /** Innskuddssats som desimal (f.eks. 0.02). Brukes kun når activeContribution er true. */
  contributionRate: number;
  /** Forventet årlig avkastning som desimal. */
  expectedReturn: number;
  /**
   * Kun én konto bør være aktiv for pågående innskudd (rate × lønn opp til 12 G).
   * Øvrige kontoer er «frosne» saldoer som fortsatt får avkastning.
   */
  activeContribution: boolean;
  /**
   * Valgfritt årlig pensjonsanslag for ytelses-/offentlig ordning (forenkling).
   * Hvis satt > 0, brukes det som årlig utbetaling i stedet for annuitet av saldo.
   */
  yearlyPensionEstimate?: number;
}

export interface CalculatorInputs {
  birthYear: number;
  annualSalary: number;
  wageGrowth: number;
  retirementAge: number;
  tpAccounts: TpAccount[];
  tpPayoutMode: TpPayoutMode;
  tpPayoutYears: number;
  afpType: AfpType;
  savings: SavingAccount[];
  savingPayoutMode: TpPayoutMode;
  savingPayoutYears: number;
  sivilstatus: Sivilstatus;
  showNet: boolean;
  gGrowth: number;
  inflation: number;
  /**
   * Valgfri pensjonsbeholdning i folketrygden (NOK) fra NAV / Din pensjon.
   * 0 eller udefinert = estimer historisk opptjening fra lønn.
   */
  folketrygdBalance: number;
}

export interface ScenarioAssumptions {
  wageGrowth: number;
  gGrowth: number;
}

export interface ComponentResult {
  yearly: number;
  monthly: number;
  balanceAtRetirement?: number;
}

export interface ScenarioResult {
  key: ScenarioKey;
  label: string;
  folketrygd: ComponentResult;
  tp: ComponentResult;
  afp: ComponentResult;
  saving: ComponentResult;
  /** Valgfri oppdeling per sparekonto (basis-beløp før netto). */
  savingBreakdown?: { id: string; label: string; yearly: number; balanceAtRetirement: number }[];
  /** Valgfri oppdeling per TP-konto. */
  tpBreakdown?: { id: string; label: string; yearly: number; balanceAtRetirement: number }[];
  totalYearly: number;
  totalMonthly: number;
  replacementRate: number;
  garantipensjonApplied: boolean;
}

export interface TimelinePoint {
  age: number;
  year: number;
  folketrygd: number;
  tp: number;
  afp: number;
  saving: number;
  total: number;
}

export interface CalculationResult {
  age: number;
  yearsToRetirement: number;
  scenarios: Record<ScenarioKey, ScenarioResult>;
  timeline: TimelinePoint[];
  explanation: string[];
}
