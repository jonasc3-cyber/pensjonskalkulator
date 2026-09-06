import { describe, expect, it } from "vitest";
import { calculatePension, defaultInputs } from "./calculate";
import { findFirstTpSavingDrop } from "./timelineDrop";
import type { TimelinePoint } from "./types";

function point(
  age: number,
  tp: number,
  saving: number,
  folketrygd = 200_000,
  afp = 0,
): TimelinePoint {
  return {
    age,
    year: 2050 + (age - 67),
    folketrygd,
    tp,
    afp,
    saving,
    total: folketrygd + tp + afp + saving,
  };
}

describe("findFirstTpSavingDrop", () => {
  it("returns null when TP+sparing are flat", () => {
    const timeline = [
      point(67, 80_000, 40_000),
      point(68, 80_000, 40_000),
      point(69, 80_000, 40_000),
    ];
    expect(findFirstTpSavingDrop(timeline)).toBeNull();
  });

  it("detects first cliff and reports before/after/gap monthly", () => {
    const timeline = [
      point(67, 100_000, 50_000),
      point(76, 100_000, 50_000),
      // TP ends → first cliff
      point(77, 0, 50_000),
      // saving ends later
      point(82, 0, 0),
    ];
    const drop = findFirstTpSavingDrop(timeline);
    expect(drop).not.toBeNull();
    expect(drop!.dropAge).toBe(77);
    expect(drop!.beforeYearly).toBe(350_000);
    expect(drop!.afterYearly).toBe(250_000);
    expect(drop!.gapYearly).toBe(100_000);
    expect(drop!.gapMonthly).toBeCloseTo(100_000 / 12);
    expect(drop!.beforeMonthly).toBeCloseTo(350_000 / 12);
  });

  it("ignores tiny dips under the 5k / 15% thresholds", () => {
    const timeline = [
      point(67, 10_000, 0),
      // lose 1k only
      point(68, 9_000, 0),
    ];
    expect(findFirstTpSavingDrop(timeline)).toBeNull();
  });

  it("finds a drop on default calculator timeline (TP 10 år)", () => {
    const result = calculatePension(defaultInputs());
    const drop = findFirstTpSavingDrop(result.timeline);
    expect(drop).not.toBeNull();
    // retirement 67 + 10 TP years → cliff at 77
    expect(drop!.dropAge).toBe(77);
    expect(drop!.gapMonthly).toBeGreaterThan(0);
    expect(drop!.beforeMonthly).toBeGreaterThan(drop!.afterMonthly);
  });
});

