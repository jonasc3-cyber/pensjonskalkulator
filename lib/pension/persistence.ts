import { defaultInputs } from "./calculate";
import { ensureSingleActiveContribution } from "./tp";
import type {
  AfpType,
  CalculatorInputs,
  SavingAccount,
  SavingKind,
  Sivilstatus,
  TpAccount,
  TpKind,
  TpPayoutMode,
} from "./types";

/** localStorage-nøkkel — kun i nettleseren, aldri sendt til server. */
export const STORAGE_KEY = "pensjonskalkulator:inputs:v1";

/** Query-/hash-parameter for delbar tilstand. */
export const URL_STATE_PARAM = "s";

export const PERSISTENCE_VERSION = 1;

/** Fødselsår der ny folketrygdmodell gjelder (1963+). */
export const NEW_FOLKETRYGD_FROM_YEAR = 1963;

type PersistedPayload = {
  v: number;
} & Partial<CalculatorInputs>;

function toBase64Url(utf8: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(utf8, "utf8").toString("base64url");
  }
  const bytes = new TextEncoder().encode(utf8);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(encoded: string): string {
  const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const padded = b64 + pad;
  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function clampNumber(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function asEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function sanitizeSaving(raw: unknown, fallback: SavingAccount): SavingAccount {
  if (!raw || typeof raw !== "object") return fallback;
  const o = raw as Record<string, unknown>;
  const kind = asEnum<SavingKind>(
    o.kind,
    ["ips", "ask", "fond", "bank", "annet"],
    fallback.kind,
  );
  return {
    id: typeof o.id === "string" && o.id ? o.id : fallback.id,
    kind,
    label: typeof o.label === "string" ? o.label : fallback.label,
    provider: typeof o.provider === "string" ? o.provider : fallback.provider,
    balance: isFiniteNumber(o.balance)
      ? Math.max(0, o.balance)
      : fallback.balance,
    monthly: isFiniteNumber(o.monthly)
      ? Math.max(0, o.monthly)
      : fallback.monthly,
    expectedReturn: isFiniteNumber(o.expectedReturn)
      ? clampNumber(o.expectedReturn, 0, 0.2)
      : fallback.expectedReturn,
  };
}

function sanitizeTp(raw: unknown, fallback: TpAccount): TpAccount {
  if (!raw || typeof raw !== "object") return fallback;
  const o = raw as Record<string, unknown>;
  const kind = asEnum<TpKind>(
    o.kind,
    ["innskudd", "ytelse", "hybrid", "offentlig", "annet"],
    fallback.kind,
  );
  const estimate =
    isFiniteNumber(o.yearlyPensionEstimate) && o.yearlyPensionEstimate > 0
      ? o.yearlyPensionEstimate
      : undefined;
  return {
    id: typeof o.id === "string" && o.id ? o.id : fallback.id,
    kind,
    label: typeof o.label === "string" ? o.label : fallback.label,
    provider: typeof o.provider === "string" ? o.provider : fallback.provider,
    balance: isFiniteNumber(o.balance)
      ? Math.max(0, o.balance)
      : fallback.balance,
    contributionRate: isFiniteNumber(o.contributionRate)
      ? clampNumber(o.contributionRate, 0, 0.2)
      : fallback.contributionRate,
    expectedReturn: isFiniteNumber(o.expectedReturn)
      ? clampNumber(o.expectedReturn, 0, 0.2)
      : fallback.expectedReturn,
    activeContribution: Boolean(o.activeContribution),
    yearlyPensionEstimate: estimate,
  };
}

/**
 * Slå sammen rå payload med standardverdier.
 * Ugyldige felt ignoreres; mangler fylles fra defaults.
 */
export function mergePersistedInputs(
  raw: unknown,
  defaults: CalculatorInputs = defaultInputs(),
): CalculatorInputs {
  if (!raw || typeof raw !== "object") return { ...defaults };

  const o = raw as PersistedPayload;
  const next: CalculatorInputs = { ...defaults };

  if (isFiniteNumber(o.birthYear)) {
    next.birthYear = clampNumber(Math.round(o.birthYear), 1940, 2010);
  }
  if (isFiniteNumber(o.annualSalary)) {
    next.annualSalary = Math.max(0, o.annualSalary);
  }
  if (isFiniteNumber(o.wageGrowth)) {
    next.wageGrowth = clampNumber(o.wageGrowth, 0, 0.15);
  }
  if (isFiniteNumber(o.retirementAge)) {
    next.retirementAge = clampNumber(Math.round(o.retirementAge), 62, 75);
  }
  if (isFiniteNumber(o.tpPayoutYears)) {
    next.tpPayoutYears = clampNumber(Math.round(o.tpPayoutYears), 5, 25);
  }
  if (isFiniteNumber(o.savingPayoutYears)) {
    next.savingPayoutYears = clampNumber(
      Math.round(o.savingPayoutYears),
      5,
      30,
    );
  }
  if (isFiniteNumber(o.gGrowth)) {
    next.gGrowth = clampNumber(o.gGrowth, 0, 0.15);
  }
  if (isFiniteNumber(o.inflation)) {
    next.inflation = clampNumber(o.inflation, 0, 0.1);
  }
  if (isFiniteNumber(o.folketrygdBalance)) {
    next.folketrygdBalance = Math.max(0, o.folketrygdBalance);
  }

  next.tpPayoutMode = asEnum<TpPayoutMode>(
    o.tpPayoutMode,
    ["aar", "livsvarig"],
    defaults.tpPayoutMode,
  );
  next.savingPayoutMode = asEnum<TpPayoutMode>(
    o.savingPayoutMode,
    ["aar", "livsvarig"],
    defaults.savingPayoutMode,
  );
  next.afpType = asEnum<AfpType>(
    o.afpType,
    ["privat", "offentlig", "ingen"],
    defaults.afpType,
  );
  next.sivilstatus = asEnum<Sivilstatus>(
    o.sivilstatus,
    ["enslig", "gift"],
    defaults.sivilstatus,
  );
  if (typeof o.showNet === "boolean") next.showNet = o.showNet;

  if (Array.isArray(o.savings)) {
    const fb = defaults.savings[0];
    next.savings = o.savings.map((item, i) =>
      sanitizeSaving(
        item,
        fb ?? {
          id: `s-${i}`,
          kind: "fond",
          balance: 0,
          monthly: 0,
          expectedReturn: 0.05,
        },
      ),
    );
  }

  if (Array.isArray(o.tpAccounts)) {
    const fb = defaults.tpAccounts[0];
    const list = o.tpAccounts.map((item, i) =>
      sanitizeTp(
        item,
        fb ?? {
          id: `tp-${i}`,
          kind: "innskudd",
          balance: 0,
          contributionRate: 0.02,
          expectedReturn: 0.045,
          activeContribution: i === 0,
        },
      ),
    );
    next.tpAccounts = ensureSingleActiveContribution(list);
  }

  return next;
}

/** Serialiser kalkulatorinput til kompakt base64url-streng (JSON). */
export function serializeInputs(inputs: CalculatorInputs): string {
  const payload: PersistedPayload = {
    v: PERSISTENCE_VERSION,
    birthYear: inputs.birthYear,
    annualSalary: inputs.annualSalary,
    wageGrowth: inputs.wageGrowth,
    retirementAge: inputs.retirementAge,
    tpAccounts: inputs.tpAccounts,
    tpPayoutMode: inputs.tpPayoutMode,
    tpPayoutYears: inputs.tpPayoutYears,
    afpType: inputs.afpType,
    savings: inputs.savings,
    savingPayoutMode: inputs.savingPayoutMode,
    savingPayoutYears: inputs.savingPayoutYears,
    sivilstatus: inputs.sivilstatus,
    showNet: inputs.showNet,
    gGrowth: inputs.gGrowth,
    inflation: inputs.inflation,
    folketrygdBalance: inputs.folketrygdBalance,
  };
  return toBase64Url(JSON.stringify(payload));
}

/** Deserialiser base64url-streng til CalculatorInputs, eller null ved feil. */
export function deserializeInputs(encoded: string): CalculatorInputs | null {
  if (!encoded || typeof encoded !== "string") return null;
  try {
    const json = fromBase64Url(encoded.trim());
    const raw = JSON.parse(json) as unknown;
    return mergePersistedInputs(raw);
  } catch {
    return null;
  }
}

/** Les tilstand fra query-streng (?s=…) eller hash (#s=…). */
export function parseStateFromLocationParts(
  search: string,
  hash: string,
): CalculatorInputs | null {
  const fromParams = (raw: string): CalculatorInputs | null => {
    const cleaned = raw.startsWith("?") || raw.startsWith("#") ? raw.slice(1) : raw;
    if (!cleaned) return null;
    try {
      const params = new URLSearchParams(cleaned);
      const value = params.get(URL_STATE_PARAM);
      if (!value) return null;
      return deserializeInputs(value);
    } catch {
      return null;
    }
  };

  return fromParams(search) ?? fromParams(hash);
}

export function buildShareSearch(inputs: CalculatorInputs): string {
  return `?${URL_STATE_PARAM}=${serializeInputs(inputs)}`;
}

/** Skal advarsel for gammel kohort vises? */
export function shouldShowCohortWarning(birthYear: number): boolean {
  return Number.isFinite(birthYear) && birthYear < NEW_FOLKETRYGD_FROM_YEAR;
}

/** Finn om noen sparekonto er IPS. */
export function hasIpsAccount(savings: SavingAccount[]): boolean {
  return savings.some((a) => a.kind === "ips");
}

/* ——— Browser-only helpers (trygg å importere; no-op uten window) ——— */

export function loadInputsFromLocalStorage(): CalculatorInputs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    // Støtt både rå JSON og base64url-payload
    if (raw.trim().startsWith("{")) {
      return mergePersistedInputs(JSON.parse(raw));
    }
    return deserializeInputs(raw);
  } catch {
    return null;
  }
}

export function saveInputsToLocalStorage(inputs: CalculatorInputs): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeInputs(inputs));
  } catch {
    // kvote / privat modus — ignorer
  }
}

export function clearInputsLocalStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function readInputsFromUrl(): CalculatorInputs | null {
  if (typeof window === "undefined") return null;
  return parseStateFromLocationParts(window.location.search, window.location.hash);
}

/** Oppdater query uten navigasjon (debounced fra Calculator). */
export function writeInputsToUrl(inputs: CalculatorInputs): void {
  if (typeof window === "undefined") return;
  try {
    const encoded = serializeInputs(inputs);
    const url = new URL(window.location.href);
    url.searchParams.set(URL_STATE_PARAM, encoded);
    // Behold path; fjern hash-state for å unngå dobbel kilde
    url.hash = "";
    window.history.replaceState(null, "", url.toString());
  } catch {
    // ignore
  }
}

export function clearInputsFromUrl(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete(URL_STATE_PARAM);
    url.hash = "";
    window.history.replaceState(null, "", url.toString());
  } catch {
    // ignore
  }
}

/**
 * Last prioritet: URL → localStorage → defaults.
 * Kun for klient (etter mount).
 */
export function resolveInitialInputs(
  defaults: CalculatorInputs = defaultInputs(),
): CalculatorInputs {
  return readInputsFromUrl() ?? loadInputsFromLocalStorage() ?? defaults;
}
