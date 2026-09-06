import { describe, expect, it } from "vitest";
import {
  AFP_NOT_INCLUDED_LABEL,
  formatChartSeriesValue,
  isAfpNotIncluded,
} from "@/lib/format";

describe("AFP display when yearly rounds to 0", () => {
  it("detects AFP not included", () => {
    expect(isAfpNotIncluded(0)).toBe(true);
    expect(isAfpNotIncluded(0.4)).toBe(true);
    expect(isAfpNotIncluded(0.5)).toBe(false);
    expect(isAfpNotIncluded(1200)).toBe(false);
  });

  it("formats AFP as Ikke inkludert", () => {
    expect(formatChartSeriesValue("AFP", 0)).toBe(AFP_NOT_INCLUDED_LABEL);
    expect(formatChartSeriesValue("AFP", 0.2)).toBe(AFP_NOT_INCLUDED_LABEL);
  });

  it("still formats other series as NOK including zero", () => {
    expect(formatChartSeriesValue("TP", 0)).toMatch(/0/);
    expect(formatChartSeriesValue("Folketrygd", 1000)).toMatch(/1/);
  });

  it("formats non-zero AFP as NOK", () => {
    expect(formatChartSeriesValue("AFP", 50000)).not.toBe(AFP_NOT_INCLUDED_LABEL);
  });
});
