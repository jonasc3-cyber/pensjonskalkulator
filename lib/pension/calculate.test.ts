import { describe, expect, it } from "vitest";
import { G_NOK, FOLKETRYGD_OPPTJENINGSSATS, FOLKETRYGD_MAKS_G } from "../constants";
import { getDelingstall } from "./delingstall";
import { yearlyAccrual, projectFolketrygd } from "./folketrygd";
import {
  annuityPayment,
  createTpAccount,
  ensureSingleActiveContribution,
  projectTp,
  projectTpAccounts,
} from "./tp";
import {
  createSavingAccount,
  projectSaving,
  projectSavings,
} from "./saving";
import { calculatePension, defaultInputs } from "./calculate";

describe("yearlyAccrual", () => {
  it("opptjener 18,1 % av lønn under 7,1 G", () => {
    const salary = 500_000;
    expect(yearlyAccrual(salary)).toBeCloseTo(salary * FOLKETRYGD_OPPTJENINGSSATS, 5);
  });

  it("capper opptjening ved 7,1 G", () => {
    const cap = FOLKETRYGD_MAKS_G * G_NOK;
    const expected = FOLKETRYGD_OPPTJENINGSSATS * cap;
    expect(yearlyAccrual(cap)).toBeCloseTo(expected, 5);
    expect(yearlyAccrual(cap * 2)).toBeCloseTo(expected, 5);
  });
});

describe("delingstall", () => {
  it("gir lavere delingstall ved høyere uttaksalder", () => {
    expect(getDelingstall(62)).toBeGreaterThan(getDelingstall(67));
    expect(getDelingstall(67)).toBeGreaterThan(getDelingstall(75));
  });

  it("klipper alder til 62–75", () => {
    expect(getDelingstall(50)).toBe(getDelingstall(62));
    expect(getDelingstall(90)).toBe(getDelingstall(75));
  });

  it("bruker NAV-tall @ 67 for kjente kohorter", () => {
    expect(getDelingstall(67, 1963)).toBeCloseTo(16.18, 2);
    expect(getDelingstall(67, 1965)).toBeCloseTo(16.34, 2);
    expect(getDelingstall(67, 1980)).toBeCloseTo(17.78, 2);
    expect(getDelingstall(67, 2000)).toBeCloseTo(19.85, 2);
  });
});

describe("annuityPayment", () => {
  it("uten rente er principal / år", () => {
    expect(annuityPayment(1_000_000, 0, 10)).toBeCloseTo(100_000, 5);
  });

  it("med rente er årlig beløp høyere enn lineær", () => {
    const linear = annuityPayment(1_000_000, 0, 10);
    const withRate = annuityPayment(1_000_000, 0.04, 10);
    expect(withRate).toBeGreaterThan(linear);
  });
});

describe("projectSavings (multi-konto)", () => {
  const baseOpts = {
    birthYear: 1985,
    retirementAge: 67,
    payoutMode: "aar" as const,
    payoutYears: 15,
  };

  it("tom liste gir null utbetaling", () => {
    const result = projectSavings([], baseOpts);
    expect(result.yearlyPayout).toBe(0);
    expect(result.balanceAtRetirement).toBe(0);
    expect(result.accounts).toHaveLength(0);
  });

  it("summerer flere kontoer", () => {
    const a = createSavingAccount("fond", {
      monthly: 2000,
      balance: 100_000,
      expectedReturn: 0.05,
    });
    const b = createSavingAccount("bank", {
      monthly: 1000,
      balance: 50_000,
      expectedReturn: 0.02,
    });

    const multi = projectSavings([a, b], baseOpts);
    const onlyA = projectSaving({
      birthYear: baseOpts.birthYear,
      retirementAge: baseOpts.retirementAge,
      monthlyContribution: a.monthly,
      existingBalance: a.balance,
      expectedReturn: a.expectedReturn,
      payoutMode: baseOpts.payoutMode,
      payoutYears: baseOpts.payoutYears,
    });
    const onlyB = projectSaving({
      birthYear: baseOpts.birthYear,
      retirementAge: baseOpts.retirementAge,
      monthlyContribution: b.monthly,
      existingBalance: b.balance,
      expectedReturn: b.expectedReturn,
      payoutMode: baseOpts.payoutMode,
      payoutYears: baseOpts.payoutYears,
    });

    expect(multi.accounts).toHaveLength(2);
    expect(multi.balanceAtRetirement).toBeCloseTo(
      onlyA.balanceAtRetirement + onlyB.balanceAtRetirement,
      5,
    );
    expect(multi.yearlyPayout).toBeCloseTo(
      onlyA.yearlyPayout + onlyB.yearlyPayout,
      5,
    );
  });

  it("returnDelta justerer avkastning per konto", () => {
    const account = createSavingAccount("fond", {
      monthly: 1000,
      balance: 0,
      expectedReturn: 0.05,
    });
    const base = projectSavings([account], baseOpts);
    const high = projectSavings([account], {
      ...baseOpts,
      returnDelta: 0.015,
    });
    expect(high.balanceAtRetirement).toBeGreaterThan(base.balanceAtRetirement);
  });
});

describe("projectTpAccounts (multi-TP)", () => {
  const baseOpts = {
    birthYear: 1985,
    currentSalary: 650_000,
    retirementAge: 67,
    wageGrowth: 0.03,
    gGrowth: 0.03,
    payoutMode: "aar" as const,
    payoutYears: 10,
  };

  it("kun aktiv konto får lønnsinnskudd", () => {
    const active = createTpAccount("innskudd", {
      contributionRate: 0.05,
      balance: 0,
      expectedReturn: 0.045,
      activeContribution: true,
    });
    const frozen = createTpAccount("innskudd", {
      contributionRate: 0.05,
      balance: 100_000,
      expectedReturn: 0.045,
      activeContribution: false,
    });

    const multi = projectTpAccounts(
      ensureSingleActiveContribution([active, frozen], active.id),
      baseOpts,
    );

    const onlyActive = projectTp({
      ...baseOpts,
      contributionRate: 0.05,
      existingBalance: 0,
      expectedReturn: 0.045,
    });
    const onlyFrozenBalance = projectTp({
      ...baseOpts,
      contributionRate: 0,
      existingBalance: 100_000,
      expectedReturn: 0.045,
    });

    expect(multi.accounts).toHaveLength(2);
    expect(multi.balanceAtRetirement).toBeCloseTo(
      onlyActive.balanceAtRetirement + onlyFrozenBalance.balanceAtRetirement,
      0,
    );
    // If frozen also got contributionRate×salary, saldo would be much higher
    const ifFrozenAlsoContributed = projectTp({
      ...baseOpts,
      contributionRate: 0.05,
      existingBalance: 100_000,
      expectedReturn: 0.045,
    });
    expect(multi.accounts.find((a) => a.id === frozen.id)!.balanceAtRetirement)
      .toBeCloseTo(onlyFrozenBalance.balanceAtRetirement, 0);
    expect(multi.accounts.find((a) => a.id === frozen.id)!.balanceAtRetirement)
      .toBeLessThan(ifFrozenAlsoContributed.balanceAtRetirement);
  });

  it("tom liste gir null", () => {
    const result = projectTpAccounts([], baseOpts);
    expect(result.yearlyPayout).toBe(0);
    expect(result.accounts).toHaveLength(0);
  });
});

describe("golden-ish cases", () => {
  it("høyere lønn gir høyere folketrygd (under taket)", () => {
    const low = projectFolketrygd({
      birthYear: 1985,
      currentSalary: 400_000,
      retirementAge: 67,
      wageGrowth: 0.03,
      gGrowth: 0.03,
      sivilstatus: "enslig",
      existingBalance: 3_000_000,
    });
    const high = projectFolketrygd({
      birthYear: 1985,
      currentSalary: 700_000,
      retirementAge: 67,
      wageGrowth: 0.03,
      gGrowth: 0.03,
      sivilstatus: "enslig",
      existingBalance: 3_000_000,
    });
    expect(high.balanceAtRetirement).toBeGreaterThan(low.balanceAtRetirement);
    expect(high.yearlyGross).toBeGreaterThan(low.yearlyGross);
  });

  it("senere uttak gir høyere årlig folketrygd via delingstall", () => {
    const early = projectFolketrygd({
      birthYear: 1985,
      currentSalary: 650_000,
      retirementAge: 62,
      wageGrowth: 0.03,
      gGrowth: 0.03,
      sivilstatus: "enslig",
      existingBalance: 2_000_000,
    });
    const late = projectFolketrygd({
      birthYear: 1985,
      currentSalary: 650_000,
      retirementAge: 70,
      wageGrowth: 0.03,
      gGrowth: 0.03,
      sivilstatus: "enslig",
      existingBalance: 2_000_000,
    });
    expect(late.yearlyGross).toBeGreaterThan(early.yearlyGross);
  });

  it("TP-innskudd øker utbetaling", () => {
    const none = projectTp({
      birthYear: 1985,
      currentSalary: 650_000,
      retirementAge: 67,
      wageGrowth: 0.03,
      gGrowth: 0.03,
      contributionRate: 0,
      existingBalance: 0,
      expectedReturn: 0.045,
      payoutMode: "aar",
      payoutYears: 10,
    });
    const some = projectTp({
      birthYear: 1985,
      currentSalary: 650_000,
      retirementAge: 67,
      wageGrowth: 0.03,
      gGrowth: 0.03,
      contributionRate: 0.05,
      existingBalance: 0,
      expectedReturn: 0.045,
      payoutMode: "aar",
      payoutYears: 10,
    });
    expect(none.yearlyPayout).toBe(0);
    expect(some.yearlyPayout).toBeGreaterThan(20_000);
  });

  it("full kalkulasjon: pessimistisk < basis < optimistisk", () => {
    const result = calculatePension(defaultInputs());
    expect(result.scenarios.low.totalYearly).toBeLessThan(
      result.scenarios.base.totalYearly,
    );
    expect(result.scenarios.base.totalYearly).toBeLessThan(
      result.scenarios.high.totalYearly,
    );
    expect(result.scenarios.base.totalMonthly).toBeGreaterThan(10_000);
    expect(result.timeline.length).toBeGreaterThan(5);
  });

  it("flere sparekontoer øker egen sparing i totalen", () => {
    const one = defaultInputs();
    const two = {
      ...defaultInputs(),
      savings: [
        createSavingAccount("fond", {
          monthly: 2000,
          balance: 0,
          expectedReturn: 0.06,
        }),
        createSavingAccount("ips", {
          monthly: 1500,
          balance: 100_000,
          expectedReturn: 0.06,
          provider: "Nordnet",
        }),
      ],
    };
    const r1 = calculatePension(one);
    const r2 = calculatePension(two);
    expect(r2.scenarios.base.saving.yearly).toBeGreaterThan(
      r1.scenarios.base.saving.yearly,
    );
    expect(r2.scenarios.base.savingBreakdown?.length).toBe(2);
  });

  it("null sparekontoer gir null egen sparing", () => {
    const inputs = { ...defaultInputs(), savings: [] };
    const result = calculatePension(inputs);
    expect(result.scenarios.base.saving.yearly).toBe(0);
    expect(result.scenarios.base.savingBreakdown).toEqual([]);
  });

  it("flere TP-kontoer gir breakdown og øker total TP", () => {
    const one = defaultInputs();
    const two = {
      ...defaultInputs(),
      tpAccounts: ensureSingleActiveContribution([
        createTpAccount("innskudd", {
          contributionRate: 0.02,
          balance: 0,
          expectedReturn: 0.045,
          activeContribution: true,
        }),
        createTpAccount("innskudd", {
          contributionRate: 0.02,
          balance: 200_000,
          expectedReturn: 0.045,
          activeContribution: false,
          label: "Tidligere arbeidsgiver",
          provider: "Storebrand",
        }),
      ]),
    };
    const r1 = calculatePension(one);
    const r2 = calculatePension(two);
    expect(r2.scenarios.base.tp.yearly).toBeGreaterThan(
      r1.scenarios.base.tp.yearly,
    );
    expect(r2.scenarios.base.tpBreakdown?.length).toBe(2);
  });
});
