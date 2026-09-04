import { describe, expect, it } from "vitest";
import { G_NOK, FOLKETRYGD_OPPTJENINGSSATS, FOLKETRYGD_MAKS_G } from "../constants";
import { getDelingstall } from "./delingstall";
import { yearlyAccrual, projectFolketrygd } from "./folketrygd";
import { annuityPayment, projectTp } from "./tp";
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
    // Mer opptjening + lavere delingstall → høyere årlig
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
});
