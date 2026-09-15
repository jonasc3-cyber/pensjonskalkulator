import { describe, expect, it } from "vitest";
import {
  DEFAULT_NEED_RATIO,
  suggestedPensionNeed,
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
