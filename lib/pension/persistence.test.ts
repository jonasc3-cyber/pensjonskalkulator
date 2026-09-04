import { describe, expect, it } from "vitest";
import { defaultInputs } from "./calculate";
import { createSavingAccount } from "./saving";
import {
  NEW_FOLKETRYGD_FROM_YEAR,
  buildShareSearch,
  deserializeInputs,
  hasIpsAccount,
  mergePersistedInputs,
  parseStateFromLocationParts,
  serializeInputs,
  shouldShowCohortWarning,
  URL_STATE_PARAM,
} from "./persistence";

describe("shouldShowCohortWarning", () => {
  it("shows for birth years before 1963", () => {
    expect(shouldShowCohortWarning(1962)).toBe(true);
    expect(shouldShowCohortWarning(1950)).toBe(true);
  });

  it("hides for 1963 and later", () => {
    expect(shouldShowCohortWarning(1963)).toBe(false);
    expect(shouldShowCohortWarning(1985)).toBe(false);
    expect(NEW_FOLKETRYGD_FROM_YEAR).toBe(1963);
  });
});

describe("hasIpsAccount", () => {
  it("detects ips kind", () => {
    expect(hasIpsAccount([])).toBe(false);
    expect(hasIpsAccount([createSavingAccount("fond")])).toBe(false);
    expect(hasIpsAccount([createSavingAccount("ips")])).toBe(true);
  });
});

describe("serializeInputs / deserializeInputs", () => {
  it("round-trips default inputs", () => {
    const original = defaultInputs();
    const encoded = serializeInputs(original);
    expect(encoded.length).toBeGreaterThan(20);
    expect(encoded).not.toMatch(/[+/=]/);
    const restored = deserializeInputs(encoded);
    expect(restored).not.toBeNull();
    expect(restored!.birthYear).toBe(original.birthYear);
    expect(restored!.annualSalary).toBe(original.annualSalary);
    expect(restored!.retirementAge).toBe(original.retirementAge);
    expect(restored!.afpType).toBe(original.afpType);
    expect(restored!.savings).toHaveLength(original.savings.length);
    expect(restored!.tpAccounts).toHaveLength(original.tpAccounts.length);
  });

  it("preserves IPS account and custom salary", () => {
    const inputs = defaultInputs();
    inputs.annualSalary = 800_000;
    inputs.birthYear = 1960;
    inputs.savings = [
      createSavingAccount("ips", { balance: 100_000, monthly: 1500 }),
    ];
    const restored = deserializeInputs(serializeInputs(inputs))!;
    expect(restored.birthYear).toBe(1960);
    expect(restored.annualSalary).toBe(800_000);
    expect(restored.savings[0]?.kind).toBe("ips");
    expect(restored.savings[0]?.balance).toBe(100_000);
    expect(restored.savings[0]?.monthly).toBe(1500);
  });

  it("returns null for garbage", () => {
    expect(deserializeInputs("")).toBeNull();
    expect(deserializeInputs("%%%not-base64%%%")).toBeNull();
  });

  it("fills missing fields from defaults via merge", () => {
    const merged = mergePersistedInputs({ v: 1, birthYear: 1970 });
    expect(merged.birthYear).toBe(1970);
    expect(merged.annualSalary).toBe(defaultInputs().annualSalary);
    expect(merged.savings.length).toBeGreaterThan(0);
  });
});

describe("parseStateFromLocationParts", () => {
  it("reads from query string", () => {
    const inputs = defaultInputs();
    inputs.birthYear = 1990;
    const search = buildShareSearch(inputs);
    const parsed = parseStateFromLocationParts(search, "");
    expect(parsed?.birthYear).toBe(1990);
  });

  it("reads from hash when query empty", () => {
    const inputs = defaultInputs();
    inputs.birthYear = 1975;
    const encoded = serializeInputs(inputs);
    const parsed = parseStateFromLocationParts(
      "",
      `#${URL_STATE_PARAM}=${encoded}`,
    );
    expect(parsed?.birthYear).toBe(1975);
  });

  it("prefers query over hash", () => {
    const a = defaultInputs();
    a.birthYear = 1980;
    const b = defaultInputs();
    b.birthYear = 1999;
    const parsed = parseStateFromLocationParts(
      buildShareSearch(a),
      `#${URL_STATE_PARAM}=${serializeInputs(b)}`,
    );
    expect(parsed?.birthYear).toBe(1980);
  });

  it("returns null when neither present", () => {
    expect(parseStateFromLocationParts("", "")).toBeNull();
    expect(parseStateFromLocationParts("?foo=1", "#bar=2")).toBeNull();
  });
});
