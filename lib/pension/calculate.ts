import {
  CURRENT_YEAR,
  GROV_NETTO_ANDEL,
  SCENARIO_AVKASTNING_DELTA,
  SCENARIO_VEKST_DELTA,
} from "../constants";
import { estimateAfp } from "./afp";
import { projectFolketrygd } from "./folketrygd";
import { projectSaving } from "./saving";
import { projectTp } from "./tp";
import type {
  CalculationResult,
  CalculatorInputs,
  ScenarioKey,
  ScenarioResult,
  TimelinePoint,
} from "./types";

const SCENARIO_LABELS: Record<ScenarioKey, string> = {
  low: "Pessimistisk",
  base: "Basis",
  high: "Optimistisk",
};

const AFP_SCENARIO_FACTOR: Record<ScenarioKey, number> = {
  low: 0.85,
  base: 1,
  high: 1.1,
};

export function calculatePension(inputs: CalculatorInputs): CalculationResult {
  const age = CURRENT_YEAR - inputs.birthYear;
  const yearsToRetirement = Math.max(0, inputs.retirementAge - age);

  const keys: ScenarioKey[] = ["low", "base", "high"];
  const scenarios = {} as Record<ScenarioKey, ScenarioResult>;

  for (const key of keys) {
    scenarios[key] = buildScenario(inputs, key);
  }

  const timeline = buildTimeline(inputs, scenarios.base);

  const explanation = [
    `Ny folketrygd: 18,1 % av inntekt opp til 7,1 G legges til pensjonsbeholdningen hvert år.`,
    `Ved uttak divideres beholdningen med forenklet delingstall for alder ${inputs.retirementAge}.`,
    `Tjenestepensjon: ${((inputs.tpRate * 100).toFixed(1)).replace(".", ",")} % av lønn opp til 12 G, fremskrevet med valgt avkastning.`,
    inputs.afpType === "ingen"
      ? "AFP er ikke inkludert."
      : `AFP (${inputs.afpType}) er et forenklet tillegg — ikke offisielle satser.`,
    `Intervallene speiler ulike antagelser om lønnsvekst og avkastning (pessimistisk / basis / optimistisk).`,
    inputs.showNet
      ? `Netto er et grovt anslag (${Math.round(GROV_NETTO_ANDEL * 100)} % av brutto) og erstatter ikke skattemelding.`
      : "Beløpene vises brutto før skatt.",
  ];

  return {
    age,
    yearsToRetirement,
    scenarios,
    timeline,
    explanation,
  };
}

function buildScenario(
  inputs: CalculatorInputs,
  key: ScenarioKey,
): ScenarioResult {
  const wageGrowth = inputs.wageGrowth + SCENARIO_VEKST_DELTA[key];
  const gGrowth = inputs.gGrowth + SCENARIO_VEKST_DELTA[key];
  const tpReturn = inputs.tpReturn + SCENARIO_AVKASTNING_DELTA[key];
  const savingReturn = inputs.savingReturn + SCENARIO_AVKASTNING_DELTA[key];

  const ft = projectFolketrygd({
    birthYear: inputs.birthYear,
    currentSalary: inputs.annualSalary,
    retirementAge: inputs.retirementAge,
    wageGrowth,
    gGrowth,
    sivilstatus: inputs.sivilstatus,
  });

  const tp = projectTp({
    birthYear: inputs.birthYear,
    currentSalary: inputs.annualSalary,
    retirementAge: inputs.retirementAge,
    wageGrowth,
    gGrowth,
    contributionRate: inputs.tpRate,
    existingBalance: inputs.tpBalance,
    expectedReturn: tpReturn,
    payoutMode: inputs.tpPayoutMode,
    payoutYears: inputs.tpPayoutYears,
  });

  const afp = estimateAfp({
    birthYear: inputs.birthYear,
    currentSalary: inputs.annualSalary,
    retirementAge: inputs.retirementAge,
    afpType: inputs.afpType,
    scenarioFactor: AFP_SCENARIO_FACTOR[key],
  });

  const saving = projectSaving({
    birthYear: inputs.birthYear,
    retirementAge: inputs.retirementAge,
    monthlyContribution: inputs.savingMonthly,
    existingBalance: inputs.savingBalance,
    expectedReturn: savingReturn,
    payoutMode: inputs.savingPayoutMode,
    payoutYears: inputs.savingPayoutYears,
  });

  const netFactor = inputs.showNet ? GROV_NETTO_ANDEL : 1;

  const folketrygd = {
    yearly: ft.yearlyGross * netFactor,
    monthly: ft.monthlyGross * netFactor,
    balanceAtRetirement: ft.balanceAtRetirement,
  };
  const tpC = {
    yearly: tp.yearlyPayout * netFactor,
    monthly: tp.monthlyPayout * netFactor,
    balanceAtRetirement: tp.balanceAtRetirement,
  };
  const afpC = {
    yearly: afp.yearly * netFactor,
    monthly: afp.monthly * netFactor,
  };
  const savingC = {
    yearly: saving.yearlyPayout * netFactor,
    monthly: saving.monthlyPayout * netFactor,
    balanceAtRetirement: saving.balanceAtRetirement,
  };

  const totalYearly =
    folketrygd.yearly + tpC.yearly + afpC.yearly + savingC.yearly;
  const totalMonthly = totalYearly / 12;

  // Erstatningsgrad mot dagens lønn (ikke siste prosjektlønn) — mer forståelig
  const salaryRef = inputs.showNet
    ? inputs.annualSalary * GROV_NETTO_ANDEL
    : inputs.annualSalary;
  const replacementRate = salaryRef > 0 ? totalYearly / salaryRef : 0;

  return {
    key,
    label: SCENARIO_LABELS[key],
    folketrygd,
    tp: tpC,
    afp: afpC,
    saving: savingC,
    totalYearly,
    totalMonthly,
    replacementRate,
    garantipensjonApplied: ft.garantipensjonApplied,
  };
}

function buildTimeline(
  inputs: CalculatorInputs,
  base: ScenarioResult,
): TimelinePoint[] {
  const points: TimelinePoint[] = [];
  const startAge = inputs.retirementAge;
  const endAge = Math.min(90, startAge + 20);

  // TP/sparing: hvis utbetaling over N år, trapp ned etterpå
  const tpYears =
    inputs.tpPayoutMode === "aar" ? inputs.tpPayoutYears : 99;
  const savingYears =
    inputs.savingPayoutMode === "aar" ? inputs.savingPayoutYears : 99;

  for (let age = startAge; age <= endAge; age++) {
    const yearsInto = age - startAge;
    const tpFactor = yearsInto < tpYears ? 1 : 0;
    const savingFactor = yearsInto < savingYears ? 1 : 0;
    const folketrygd = base.folketrygd.yearly;
    const tp = base.tp.yearly * tpFactor;
    const afp = base.afp.yearly; // forenklet: flat
    const saving = base.saving.yearly * savingFactor;
    points.push({
      age,
      year: CURRENT_YEAR + (age - (CURRENT_YEAR - inputs.birthYear)),
      folketrygd,
      tp,
      afp,
      saving,
      total: folketrygd + tp + afp + saving,
    });
  }
  return points;
}

export function defaultInputs(): CalculatorInputs {
  return {
    birthYear: 1985,
    annualSalary: 650_000,
    wageGrowth: 0.03,
    retirementAge: 67,
    tpRate: 0.02,
    tpBalance: 0,
    tpReturn: 0.045,
    tpPayoutMode: "aar",
    tpPayoutYears: 10,
    afpType: "privat",
    savingMonthly: 2000,
    savingBalance: 0,
    savingReturn: 0.05,
    savingPayoutMode: "aar",
    savingPayoutYears: 15,
    sivilstatus: "enslig",
    showNet: false,
    gGrowth: 0.03,
    inflation: 0.02,
  };
}
