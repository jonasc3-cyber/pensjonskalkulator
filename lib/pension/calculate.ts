import {
  CURRENT_YEAR,
  GROV_NETTO_ANDEL,
  SCENARIO_AVKASTNING_DELTA,
  SCENARIO_VEKST_DELTA,
} from "../constants";
import { estimateAfp } from "./afp";
import { projectFolketrygd } from "./folketrygd";
import { createSavingAccount, projectSavings, SAVING_KIND_LABELS } from "./saving";
import {
  createTpAccount,
  ensureSingleActiveContribution,
  projectTpAccounts,
  TP_KIND_LABELS,
} from "./tp";
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

  const savingsSummary =
    inputs.savings.length === 0
      ? "Egen sparing er ikke inkludert."
      : `Egen sparing: ${inputs.savings.length} konto${inputs.savings.length === 1 ? "" : "er"} (${inputs.savings
          .map((s) => SAVING_KIND_LABELS[s.kind])
          .join(", ")}) fremskrives hver for seg og summeres.`;

  const activeTp = inputs.tpAccounts.find((a) => a.activeContribution);
  const tpSummary =
    inputs.tpAccounts.length === 0
      ? "Tjenestepensjon er ikke inkludert."
      : inputs.tpAccounts.length === 1
        ? `Tjenestepensjon: ${TP_KIND_LABELS[inputs.tpAccounts[0].kind]}${
            activeTp
              ? ` med ${((activeTp.contributionRate * 100).toFixed(1)).replace(".", ",")} % innskudd av lønn opp til 12 G`
              : " (kun eksisterende saldo)"
          }, fremskrevet med kontos egen avkastning.`
        : `Tjenestepensjon: ${inputs.tpAccounts.length} kontoer. Kun én aktiv ordning får pågående innskudd (rate × lønn opp til 12 G); øvrige er frosne saldoer som fortsatt får avkastning.`;

  const inflationPct = (inputs.inflation * 100).toFixed(1).replace(".", ",");
  const hasManualFt =
    inputs.folketrygdBalance != null && inputs.folketrygdBalance > 0;

  const explanation = [
    `Ny folketrygd: 18,1 % av inntekt opp til 7,1 G legges til pensjonsbeholdningen hvert år.`,
    `Ved uttak divideres beholdningen med forenklet delingstall for alder ${inputs.retirementAge}.`,
    hasManualFt
      ? `Pensjonsbeholdning starter fra oppgitt saldo (${Math.round(inputs.folketrygdBalance).toLocaleString("nb-NO")} kr) fra NAV / Din pensjon.`
      : "Pensjonsbeholdning før i dag er estimert ut fra dagens lønn (karriere fra 22 år).",
    tpSummary,
    inputs.afpType === "ingen"
      ? "AFP er ikke inkludert."
      : `AFP (${inputs.afpType}) er et forenklet tillegg — ikke offisielle satser.`,
    savingsSummary,
    // Inflasjonsmodell: prognosen kjøres nominelt (lønnsvekst, G-vekst, avkastning),
    // deretter deflateres utbetalinger til dagens kroneverdi:
    // real = nominal / (1 + inflasjon)^årTilUttak.
    `Beløpene vises i dagens kroneverdi: nominell prognose deflateres med inflasjon (${inflationPct} % p.a.) over ${yearsToRetirement} år.`,
    `Erstatningsgrad er total pensjon delt på forventet sluttlønn (siste arbeidsår etter lønnsvekst), ikke dagens lønn.`,
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
  const returnDelta = SCENARIO_AVKASTNING_DELTA[key];

  const years = Math.max(
    0,
    inputs.retirementAge - (CURRENT_YEAR - inputs.birthYear),
  );

  const ft = projectFolketrygd({
    birthYear: inputs.birthYear,
    currentSalary: inputs.annualSalary,
    retirementAge: inputs.retirementAge,
    wageGrowth,
    gGrowth,
    sivilstatus: inputs.sivilstatus,
    existingBalance:
      inputs.folketrygdBalance > 0 ? inputs.folketrygdBalance : undefined,
  });

  const tp = projectTpAccounts(inputs.tpAccounts, {
    birthYear: inputs.birthYear,
    currentSalary: inputs.annualSalary,
    retirementAge: inputs.retirementAge,
    wageGrowth,
    gGrowth,
    payoutMode: inputs.tpPayoutMode,
    payoutYears: inputs.tpPayoutYears,
    returnDelta,
  });

  const afp = estimateAfp({
    birthYear: inputs.birthYear,
    currentSalary: inputs.annualSalary,
    retirementAge: inputs.retirementAge,
    afpType: inputs.afpType,
    scenarioFactor: AFP_SCENARIO_FACTOR[key],
  });

  const saving = projectSavings(inputs.savings, {
    birthYear: inputs.birthYear,
    retirementAge: inputs.retirementAge,
    payoutMode: inputs.savingPayoutMode,
    payoutYears: inputs.savingPayoutYears,
    returnDelta,
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

  const savingBreakdown = saving.accounts.map((a) => ({
    id: a.id,
    label: a.label,
    yearly: a.yearlyPayout * netFactor,
    balanceAtRetirement: a.balanceAtRetirement,
  }));

  const tpBreakdown = tp.accounts.map((a) => ({
    id: a.id,
    label: a.label,
    yearly: a.yearlyPayout * netFactor,
    balanceAtRetirement: a.balanceAtRetirement,
  }));

  // --- P0-1: erstatningsgrad mot forventet sluttlønn (nominell) ---
  // Sluttlønn = dagens lønn fremskrevet med scenariets lønnsvekst til siste arbeidsår.
  const projectedFinalSalary =
    inputs.annualSalary * Math.pow(1 + wageGrowth, years);
  const salaryRef = inputs.showNet
    ? projectedFinalSalary * GROV_NETTO_ANDEL
    : projectedFinalSalary;

  const totalYearlyNominal =
    folketrygd.yearly + tpC.yearly + afpC.yearly + savingC.yearly;
  // Erstatningsgrad beregnes på nominelle tall (samme ratio som real/real).
  const replacementRate =
    salaryRef > 0 ? totalYearlyNominal / salaryRef : 0;

  // --- P0-2: inflasjon — vis i dagens kroneverdi ---
  // Modell: kjør nominell prognose som før, deflater deretter utbetalinger:
  //   real = nominal / (1 + inflation)^yearsToRetirement
  // Lønnsvekst og avkastning forblir nominelle i projeksjonen; inflasjon
  // påvirker kun presentasjonen (og dermed live-resultater når slideren endres).
  const inflationFactor =
    years > 0 ? Math.pow(1 + Math.max(0, inputs.inflation), years) : 1;
  const toReal = (n: number) => n / inflationFactor;

  const folketrygdR = {
    yearly: toReal(folketrygd.yearly),
    monthly: toReal(folketrygd.monthly),
    balanceAtRetirement: folketrygd.balanceAtRetirement,
  };
  const tpR = {
    yearly: toReal(tpC.yearly),
    monthly: toReal(tpC.monthly),
    balanceAtRetirement: tpC.balanceAtRetirement,
  };
  const afpR = {
    yearly: toReal(afpC.yearly),
    monthly: toReal(afpC.monthly),
  };
  const savingR = {
    yearly: toReal(savingC.yearly),
    monthly: toReal(savingC.monthly),
    balanceAtRetirement: savingC.balanceAtRetirement,
  };
  const savingBreakdownR = savingBreakdown.map((a) => ({
    ...a,
    yearly: toReal(a.yearly),
  }));
  const tpBreakdownR = tpBreakdown.map((a) => ({
    ...a,
    yearly: toReal(a.yearly),
  }));

  const totalYearly = toReal(totalYearlyNominal);
  const totalMonthly = totalYearly / 12;

  return {
    key,
    label: SCENARIO_LABELS[key],
    folketrygd: folketrygdR,
    tp: tpR,
    afp: afpR,
    saving: savingR,
    savingBreakdown: savingBreakdownR,
    tpBreakdown: tpBreakdownR,
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
    tpAccounts: ensureSingleActiveContribution([
      createTpAccount("innskudd", {
        contributionRate: 0.02,
        balance: 0,
        activeContribution: true,
        label: "",
      }),
    ]),
    tpPayoutMode: "aar",
    tpPayoutYears: 10,
    afpType: "ingen",
    savings: [
      createSavingAccount("fond", {
        monthly: 2000,
        balance: 0,
        label: "",
      }),
    ],
    savingPayoutMode: "aar",
    savingPayoutYears: 15,
    sivilstatus: "enslig",
    showNet: false,
    gGrowth: 0.03,
    inflation: 0.02,
    folketrygdBalance: 0,
  };
}
