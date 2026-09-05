import { describe, expect, it } from "vitest";
import { CURRENT_YEAR } from "../constants";
import { calculatePension, defaultInputs } from "./calculate";
import {
  COMPARISON_AGES,
  compareWithdrawalAges,
} from "./withdrawalAgeComparison";

describe("compareWithdrawalAges", () => {
  it("eksponerer 62, 67 og 70", () => {
    expect([...COMPARISON_AGES]).toEqual([62, 67, 70]);
  });

  it("kjører calculatePension for hver tilgjengelig alder med samme input", () => {
    const inputs = defaultInputs(); // birthYear 1985 → alder 41 i 2026
    const rows = compareWithdrawalAges(inputs);

    expect(rows).toHaveLength(3);
    expect(rows.every((r) => r.available)).toBe(true);

    for (const row of rows) {
      const direct = calculatePension({
        ...inputs,
        retirementAge: row.age,
      });
      expect(row.monthly).toBeCloseTo(direct.scenarios.base.totalMonthly, 5);
      expect(row.yearly).toBeCloseTo(direct.scenarios.base.totalYearly, 5);
      expect(row.replacementRate).toBeCloseTo(
        direct.scenarios.base.replacementRate,
        5,
      );
    }
  });

  it("gir høyere månedlig pensjon ved senere uttak (typisk)", () => {
    const rows = compareWithdrawalAges(defaultInputs());
    const m62 = rows.find((r) => r.age === 62)!.monthly!;
    const m67 = rows.find((r) => r.age === 67)!.monthly!;
    const m70 = rows.find((r) => r.age === 70)!.monthly!;
    expect(m67).toBeGreaterThan(m62);
    expect(m70).toBeGreaterThan(m67);
  });

  it("er uavhengig av inputs.retirementAge for beløpene", () => {
    const a = compareWithdrawalAges({
      ...defaultInputs(),
      retirementAge: 62,
    });
    const b = compareWithdrawalAges({
      ...defaultInputs(),
      retirementAge: 70,
    });
    for (let i = 0; i < 3; i++) {
      expect(a[i].monthly).toBeCloseTo(b[i].monthly!, 5);
      expect(a[i].isSelected).toBe(a[i].age === 62);
      expect(b[i].isSelected).toBe(b[i].age === 70);
    }
  });

  it("markerer passerte aldre som utilgjengelige", () => {
    // Alder 65 i CURRENT_YEAR → 62 passert, 67 og 70 tilgjengelig
    const birthYear = CURRENT_YEAR - 65;
    const rows = compareWithdrawalAges({
      ...defaultInputs(),
      birthYear,
      retirementAge: 67,
    });

    const r62 = rows.find((r) => r.age === 62)!;
    const r67 = rows.find((r) => r.age === 67)!;
    const r70 = rows.find((r) => r.age === 70)!;

    expect(r62.available).toBe(false);
    expect(r62.monthly).toBeNull();
    expect(r67.available).toBe(true);
    expect(r67.monthly).toBeGreaterThan(0);
    expect(r70.available).toBe(true);
    expect(r67.isSelected).toBe(true);
  });

  it("tillater uttak ved dagens alder (ikke passert)", () => {
    const birthYear = CURRENT_YEAR - 62;
    const rows = compareWithdrawalAges({
      ...defaultInputs(),
      birthYear,
      retirementAge: 62,
    });
    expect(rows.find((r) => r.age === 62)!.available).toBe(true);
    expect(rows.find((r) => r.age === 62)!.monthly).toBeGreaterThan(0);
  });

  it("markerer alle som utilgjengelige når brukeren er over 70", () => {
    const birthYear = CURRENT_YEAR - 71;
    const rows = compareWithdrawalAges({
      ...defaultInputs(),
      birthYear,
    });
    expect(rows.every((r) => !r.available)).toBe(true);
    expect(rows.every((r) => r.monthly === null)).toBe(true);
  });
});
