import { describe, expect, it } from "vitest";
import {
  CURRENT_YEAR,
  GROV_NETTO_ANDEL,
  SCENARIO_AVKASTNING_DELTA,
} from "../constants";
import { annuityPayment, annuityPresentValue } from "./tp";
import { projectSaving } from "./saving";
import { calculatePension, defaultInputs } from "./calculate";
import {
  computeGoalSeek,
  coveredOtherMonthly,
  defaultGoalAccountId,
  defaultGoalMonthly,
  GOAL_DEFAULT_ROUND_TO,
  GOAL_REPLACEMENT_RATE,
  requiredAnnualContribution,
  requiredMonthlySaving,
  yearsUntilRetirement,
} from "./goalSeek";

describe("annuityPresentValue", () => {
  it("er invers av annuityPayment (uten rente)", () => {
    const payment = 100_000;
    const pv = annuityPresentValue(payment, 0, 10);
    expect(pv).toBeCloseTo(1_000_000, 5);
    expect(annuityPayment(pv, 0, 10)).toBeCloseTo(payment, 5);
  });

  it("er invers av annuityPayment (med rente)", () => {
    const principal = 1_000_000;
    const rate = 0.04;
    const years = 15;
    const payment = annuityPayment(principal, rate, years);
    expect(annuityPresentValue(payment, rate, years)).toBeCloseTo(
      principal,
      4,
    );
  });
});

describe("requiredAnnualContribution", () => {
  it("uten rente: (FV − B0) / Y", () => {
    expect(requiredAnnualContribution(120_000, 20_000, 0, 10)).toBeCloseTo(
      10_000,
      5,
    );
  });

  it("inverterer balance = (balance + C) * (1+r)", () => {
    const r = 0.05;
    const y = 10;
    const b0 = 50_000;
    const c = 12_000;
    let balance = b0;
    for (let i = 0; i < y; i++) {
      balance = (balance + c) * (1 + r);
    }
    expect(requiredAnnualContribution(balance, b0, r, y)).toBeCloseTo(c, 4);
  });

  it("gir 0 når FV allerede dekket av B0-vekst", () => {
    const r = 0.06;
    const y = 5;
    const b0 = 100_000;
    const grown = b0 * Math.pow(1 + r, y);
    expect(requiredAnnualContribution(grown, b0, r, y)).toBeCloseTo(0, 4);
  });
});

describe("requiredMonthlySaving round-trip", () => {
  it("matcher projectSaving for kjent månedlig innskudd", () => {
    const birthYear = 1985;
    const retirementAge = 67;
    const monthly = 2_000;
    const balance = 100_000;
    const expectedReturn = 0.06;
    const payoutMode = "aar" as const;
    const payoutYears = 15;
    const inflation = 0.02;
    const years = yearsUntilRetirement(birthYear, retirementAge);

    const projected = projectSaving({
      birthYear,
      retirementAge,
      monthlyContribution: monthly,
      existingBalance: balance,
      expectedReturn,
      payoutMode,
      payoutYears,
    });

    const inflationFactor = Math.pow(1 + inflation, years);
    const monthlyReal = projected.monthlyPayout / inflationFactor;

    const needed = requiredMonthlySaving({
      gapMonthlyReal: monthlyReal,
      yearsToRetirement: years,
      inflation,
      existingBalance: balance,
      expectedReturn,
      payoutMode,
      payoutYears,
      retirementAge,
      netFactor: 1,
    });

    expect(needed).toBeCloseTo(monthly, 0);
  });
});

describe("computeGoalSeek (akseptanse)", () => {
  it("mål = dagens basis-total → nødvendig sparing ≈ nåværende månedlig sparing", () => {
    const inputs = defaultInputs();
    const result = calculatePension(inputs);
    const accountId = defaultGoalAccountId(inputs.savings);
    const target = result.scenarios.base.totalMonthly;

    const seek = computeGoalSeek({
      targetMonthly: target,
      inputs,
      result,
      accountId,
    });

    expect(seek).not.toBeNull();
    expect(seek!.alreadyMet).toBe(false);
    const current = inputs.savings.find((s) => s.id === accountId)!.monthly;
    expect(seek!.required.base.monthly).toBeCloseTo(current, -1); // ±5 kr-ish via -1 digits... use abs
    expect(
      Math.abs(seek!.required.base.monthly - current),
    ).toBeLessThan(25);
  });

  it("høyere mål → høyere nødvendig sparing", () => {
    const inputs = defaultInputs();
    const result = calculatePension(inputs);
    const accountId = defaultGoalAccountId(inputs.savings);
    const baseTotal = result.scenarios.base.totalMonthly;

    const low = computeGoalSeek({
      targetMonthly: baseTotal,
      inputs,
      result,
      accountId,
    })!;
    const high = computeGoalSeek({
      targetMonthly: baseTotal + 10_000,
      inputs,
      result,
      accountId,
    })!;

    expect(high.required.base.monthly).toBeGreaterThan(
      low.required.base.monthly,
    );
  });

  it("lavere avkastning (pessimistisk) → høyere nødvendig sparing", () => {
    const inputs = defaultInputs();
    const result = calculatePension(inputs);
    const accountId = defaultGoalAccountId(inputs.savings);
    const seek = computeGoalSeek({
      targetMonthly: result.scenarios.base.totalMonthly + 5_000,
      inputs,
      result,
      accountId,
    })!;

    expect(seek.required.low.monthly).toBeGreaterThan(
      seek.required.base.monthly,
    );
    expect(seek.required.high.monthly).toBeLessThan(
      seek.required.base.monthly,
    );
    expect(SCENARIO_AVKASTNING_DELTA.low).toBeLessThan(0);
  });

  it("allerede i mål: viser dekket + margin, nødvendig sparing 0", () => {
    const inputs = defaultInputs();
    const result = calculatePension(inputs);
    const accountId = defaultGoalAccountId(inputs.savings);
    const covered = coveredOtherMonthly(result, accountId);
    const seek = computeGoalSeek({
      targetMonthly: Math.max(1, covered - 1_000),
      inputs,
      result,
      accountId,
    })!;

    expect(seek.alreadyMet).toBe(true);
    expect(seek.gapMonthly).toBe(0);
    expect(seek.marginMonthly).toBeGreaterThan(0);
    expect(seek.required.base.monthly).toBe(0);
    expect(seek.required.low.monthly).toBe(0);
  });

  it("respekterer netto-faktor (round-trip med showNet)", () => {
    const inputs = { ...defaultInputs(), showNet: true };
    const result = calculatePension(inputs);
    const accountId = defaultGoalAccountId(inputs.savings);
    const seek = computeGoalSeek({
      targetMonthly: result.scenarios.base.totalMonthly,
      inputs,
      result,
      accountId,
    })!;
    const current = inputs.savings.find((s) => s.id === accountId)!.monthly;
    expect(Math.abs(seek.required.base.monthly - current)).toBeLessThan(30);
    expect(GROV_NETTO_ANDEL).toBeCloseTo(0.78, 5);
  });

  it("Y=0 håndteres uten NaN", () => {
    const inputs = {
      ...defaultInputs(),
      birthYear: CURRENT_YEAR - 67,
      retirementAge: 67,
    };
    const result = calculatePension(inputs);
    expect(result.yearsToRetirement).toBe(0);
    const seek = computeGoalSeek({
      targetMonthly: 50_000,
      inputs,
      result,
      accountId: defaultGoalAccountId(inputs.savings),
    });
    expect(seek).not.toBeNull();
    expect(Number.isFinite(seek!.required.base.monthly)).toBe(true);
  });
});

describe("defaultGoalMonthly", () => {
  it("gir ~75 % av årslønn / 12, avrundet til nærmeste 500", () => {
    // 600 000 * 0.75 / 12 = 37 500 → 37 500
    expect(defaultGoalMonthly(600_000)).toBe(37_500);
    // 550 000 * 0.75 / 12 = 34 375 → 34 500
    expect(defaultGoalMonthly(550_000)).toBe(34_500);
    // 700 000 * 0.75 / 12 = 43 750 → 44 000
    expect(defaultGoalMonthly(700_000)).toBe(44_000);
  });

  it("returnerer 0 ved manglende lønn", () => {
    expect(defaultGoalMonthly(0)).toBe(0);
    expect(defaultGoalMonthly(-10)).toBe(0);
  });

  it("bruker 500-kr steg og 75 % rate", () => {
    expect(GOAL_DEFAULT_ROUND_TO).toBe(500);
    expect(GOAL_REPLACEMENT_RATE).toBe(0.75);
  });
});
