import { describe, expect, it } from "vitest";
import {
  ANNUAL_SALARY_MAX,
  isValidAnnualSalary,
  validateAnnualSalary,
} from "./salaryValidation";

describe("validateAnnualSalary", () => {
  it("rejects empty / zero / negative", () => {
    expect(validateAnnualSalary(0).ok).toBe(false);
    expect(validateAnnualSalary(-1).ok).toBe(false);
    expect(validateAnnualSalary(Number.NaN).ok).toBe(false);
    expect(isValidAnnualSalary(0)).toBe(false);
  });

  it("accepts sensible positive salaries", () => {
    expect(validateAnnualSalary(1).ok).toBe(true);
    expect(validateAnnualSalary(650_000).ok).toBe(true);
    expect(validateAnnualSalary(ANNUAL_SALARY_MAX).ok).toBe(true);
  });

  it("rejects above max", () => {
    const result = validateAnnualSalary(ANNUAL_SALARY_MAX + 1);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/kan ikke være over/);
    }
  });

  it("uses bokmål message for zero", () => {
    const result = validateAnnualSalary(0);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/større enn 0/);
    }
  });
});
