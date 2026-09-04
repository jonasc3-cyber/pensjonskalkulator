export type Sivilstatus = "enslig" | "gift";
export type AfpType = "privat" | "offentlig" | "ingen";
export type TpPayoutMode = "aar" | "livsvarig";
export type ScenarioKey = "low" | "base" | "high";

export interface CalculatorInputs {
  birthYear: number;
  annualSalary: number;
  wageGrowth: number;
  retirementAge: number;
  tpRate: number;
  tpBalance: number;
  tpReturn: number;
  tpPayoutMode: TpPayoutMode;
  tpPayoutYears: number;
  afpType: AfpType;
  savingMonthly: number;
  savingBalance: number;
  savingReturn: number;
  savingPayoutMode: TpPayoutMode;
  savingPayoutYears: number;
  sivilstatus: Sivilstatus;
  showNet: boolean;
  gGrowth: number;
  inflation: number;
}

export interface ScenarioAssumptions {
  wageGrowth: number;
  gGrowth: number;
  tpReturn: number;
  savingReturn: number;
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
