import { describe, expect, it } from "vitest";
import { parseCurrencyInput } from "@/components/CurrencyInput";

describe("parseCurrencyInput", () => {
  it("parses plain digits", () => {
    expect(parseCurrencyInput("650000")).toBe(650000);
  });

  it("parses nb-NO thousand separators", () => {
    expect(parseCurrencyInput("650 000")).toBe(650000);
    expect(parseCurrencyInput("650\u00a0000")).toBe(650000);
    expect(parseCurrencyInput("650\u202f000")).toBe(650000);
  });

  it("ignores kr suffix and rounds", () => {
    expect(parseCurrencyInput("12 500 kr")).toBe(12500);
  });

  it("returns null for empty", () => {
    expect(parseCurrencyInput("")).toBeNull();
    expect(parseCurrencyInput("  ")).toBeNull();
  });
});
