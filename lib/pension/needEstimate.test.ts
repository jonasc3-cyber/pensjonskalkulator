import { describe, expect, it } from "vitest";
import {
  DEFAULT_NEED_RATIO,
  computeLoanRelease,
  computeMonthlyReleased,
  phaseBSpend,
  selectedPhaseSpend,
  suggestedPensionNeed,
  totalLoanMonths,
} from "./needEstimate";

describe("suggestedPensionNeed", () => {
  it("returns 0 when spend is empty or non-positive", () => {
    expect(suggestedPensionNeed(0, 85)).toBe(0);
    expect(suggestedPensionNeed(-1, 85)).toBe(0);
  });

  it("applies 70 / 85 / 100 % ratios", () => {
    expect(suggestedPensionNeed(25_000, 70)).toBe(17_500);
    expect(suggestedPensionNeed(25_000, 85)).toBe(21_250);
    expect(suggestedPensionNeed(25_000, 100)).toBe(25_000);
  });

  it("defaults ratio constant is 85", () => {
    expect(DEFAULT_NEED_RATIO).toBe(85);
    expect(suggestedPensionNeed(18_000, DEFAULT_NEED_RATIO)).toBe(15_300);
  });

  it("rounds to whole kroner", () => {
    expect(suggestedPensionNeed(10_001, 85)).toBe(8_501);
  });
});

describe("totalLoanMonths", () => {
  it("sums years and months", () => {
    expect(totalLoanMonths(10, 0)).toBe(120);
    expect(totalLoanMonths(10, 6)).toBe(126);
    expect(totalLoanMonths(0, 6)).toBe(6);
  });

  it("clamps negatives and non-finite to 0", () => {
    expect(totalLoanMonths(-2, 3)).toBe(3);
    expect(totalLoanMonths(2, -3)).toBe(24);
    expect(totalLoanMonths(Number.NaN, 6)).toBe(6);
  });
});

describe("computeMonthlyReleased", () => {
  it("returns null when loan fields are empty (MVP unchanged)", () => {
    expect(
      computeMonthlyReleased({
        remainingDebt: 0,
        yearsRemaining: 0,
        monthsRemaining: 0,
        monthlyPayment: 0,
      }),
    ).toBeNull();
  });

  it("uses monthly payment when set (overrides debt)", () => {
    expect(
      computeMonthlyReleased({
        remainingDebt: 1_200_000,
        yearsRemaining: 10,
        monthsRemaining: 0,
        monthlyPayment: 12_000,
      }),
    ).toEqual({ monthlyReleased: 12_000, simplifiedFromDebt: false });
  });

  it("divides restgjeld by months when no payment", () => {
    expect(
      computeMonthlyReleased({
        remainingDebt: 1_200_000,
        yearsRemaining: 10,
        monthsRemaining: 0,
        monthlyPayment: 0,
      }),
    ).toEqual({ monthlyReleased: 10_000, simplifiedFromDebt: true });
  });

  it("returns null when debt without time (and no payment)", () => {
    expect(
      computeMonthlyReleased({
        remainingDebt: 1_200_000,
        yearsRemaining: 0,
        monthsRemaining: 0,
        monthlyPayment: 0,
      }),
    ).toBeNull();
  });
});

describe("computeLoanRelease", () => {
  it("returns X and Y when time and Y are available", () => {
    expect(
      computeLoanRelease({
        remainingDebt: 1_200_000,
        yearsRemaining: 10,
        monthsRemaining: 0,
        monthlyPayment: 0,
      }),
    ).toEqual({
      yearsApprox: 10,
      monthlyReleased: 10_000,
      simplifiedFromDebt: true,
    });
  });

  it("rounds yearsApprox to one decimal", () => {
    expect(
      computeLoanRelease({
        remainingDebt: 0,
        yearsRemaining: 10,
        monthsRemaining: 6,
        monthlyPayment: 8_000,
      }),
    ).toEqual({
      yearsApprox: 10.5,
      monthlyReleased: 8_000,
      simplifiedFromDebt: false,
    });
  });

  it("returns null without time even if payment is set", () => {
    expect(
      computeLoanRelease({
        remainingDebt: 0,
        yearsRemaining: 0,
        monthsRemaining: 0,
        monthlyPayment: 12_000,
      }),
    ).toBeNull();
  });
});

describe("phaseBSpend", () => {
  it("subtracts Y from Fase A", () => {
    expect(phaseBSpend(25_000, 10_000)).toBe(15_000);
  });

  it("uses manual after-loan when set", () => {
    expect(phaseBSpend(25_000, 10_000, 18_000)).toBe(18_000);
  });

  it("clamps negative to 0", () => {
    expect(phaseBSpend(5_000, 10_000)).toBe(0);
  });
});

describe("selectedPhaseSpend", () => {
  it("returns Fase A when no loan / no manual (MVP)", () => {
    expect(
      selectedPhaseSpend({
        faseA: 25_000,
        monthlyReleased: 0,
        phase: "B",
      }),
    ).toBe(25_000);
  });

  it("defaults to Fase B when Y is present", () => {
    expect(
      selectedPhaseSpend({
        faseA: 25_000,
        monthlyReleased: 10_000,
        phase: "B",
      }),
    ).toBe(15_000);
  });

  it("can toggle back to Fase A", () => {
    expect(
      selectedPhaseSpend({
        faseA: 25_000,
        monthlyReleased: 10_000,
        phase: "A",
      }),
    ).toBe(25_000);
  });

  it("allows manual Fase B without Y", () => {
    expect(
      selectedPhaseSpend({
        faseA: 25_000,
        monthlyReleased: 0,
        manualAfterLoan: 18_000,
        phase: "B",
      }),
    ).toBe(18_000);
  });
});
