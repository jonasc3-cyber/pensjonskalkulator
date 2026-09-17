/** Andel av dagens forbruk som mål for pensjon (ikke fasit). */
export const NEED_RATIOS = [70, 85, 100] as const;
export type NeedRatio = (typeof NEED_RATIOS)[number];
export const DEFAULT_NEED_RATIO: NeedRatio = 85;

export const SPEND_TEMPLATES: ReadonlyArray<{
  label: string;
  monthly: number;
}> = [
  { label: "Enslig, lavt forbruk", monthly: 18_000 },
  { label: "Enslig typisk", monthly: 25_000 },
  { label: "Par typisk", monthly: 35_000 },
  { label: "Høyt forbruk", monthly: 45_000 },
];

/** Hvilken fase 70/85/100 % og «Fyll Spar for mål» bruker. */
export type SpendPhase = "A" | "B";

export type LoanPayoffInput = {
  /** Restgjeld i kroner (0 = tomt). */
  remainingDebt: number;
  /** Gjenværende år (0 = tomt). */
  yearsRemaining: number;
  /** Ekstra måneder utover hele år (0 = tomt). */
  monthsRemaining: number;
  /** Månedsbeløp på lån (0 = tomt). Overstyrer rest/tid for Y. */
  monthlyPayment: number;
};

export type LoanRelease = {
  /** Ca. år til lånet er ferdig (X). */
  yearsApprox: number;
  /** Frigjort beløp per måned når lånet er ferdig (Y). */
  monthlyReleased: number;
  /**
   * True når Y er restgjeld / måneder (forenklet, ikke amortisering).
   * False når Y kommer direkte fra oppgitt månedsbeløp.
   */
  simplifiedFromDebt: boolean;
};

/** Foreslått månedlig pensjonsbehov i dagens kroner = forbruk × andel. */
export function suggestedPensionNeed(
  spendMonthly: number,
  ratioPct: NeedRatio,
): number {
  if (!(spendMonthly > 0)) return 0;
  return Math.round(spendMonthly * (ratioPct / 100));
}

/** Total gjenværende løpetid i hele måneder. */
export function totalLoanMonths(
  yearsRemaining: number,
  monthsRemaining: number,
): number {
  const y = Number.isFinite(yearsRemaining) ? Math.max(0, yearsRemaining) : 0;
  const m = Number.isFinite(monthsRemaining)
    ? Math.max(0, monthsRemaining)
    : 0;
  return Math.round(y * 12 + m);
}

/**
 * Frigjort beløp Y (kr/mnd) når lånet er nedbetalt.
 * - Oppgitt månedsbeløp → Y = det beløpet
 * - Kun rest + tid → Y = rest / måneder (forenklet, ikke rente)
 * - Ellers null (tomt lån = uendret MVP)
 */
export function computeMonthlyReleased(
  input: LoanPayoffInput,
): { monthlyReleased: number; simplifiedFromDebt: boolean } | null {
  const payment = Number.isFinite(input.monthlyPayment)
    ? Math.max(0, input.monthlyPayment)
    : 0;
  if (payment > 0) {
    return {
      monthlyReleased: Math.round(payment),
      simplifiedFromDebt: false,
    };
  }

  const debt = Number.isFinite(input.remainingDebt)
    ? Math.max(0, input.remainingDebt)
    : 0;
  const months = totalLoanMonths(
    input.yearsRemaining,
    input.monthsRemaining,
  );
  if (debt > 0 && months > 0) {
    return {
      monthlyReleased: Math.round(debt / months),
      simplifiedFromDebt: true,
    };
  }

  return null;
}

/**
 * Synlig «Om ca. X år frigjøres ~Y …» når vi har både tid (X) og Y.
 * Månedsbeløp alene uten tid gir Y til fase B, men ingen X-linje.
 */
export function computeLoanRelease(
  input: LoanPayoffInput,
): LoanRelease | null {
  const months = totalLoanMonths(
    input.yearsRemaining,
    input.monthsRemaining,
  );
  if (!(months > 0)) return null;

  const released = computeMonthlyReleased(input);
  if (!released || !(released.monthlyReleased > 0)) return null;

  return {
    yearsApprox: Math.round((months / 12) * 10) / 10,
    monthlyReleased: released.monthlyReleased,
    simplifiedFromDebt: released.simplifiedFromDebt,
  };
}

/**
 * Fase B-forbruk (etter lån): manuelt felt hvis satt, ellers fase A − Y.
 * Negativt resultat clamps til 0.
 */
export function phaseBSpend(
  faseA: number,
  monthlyReleased: number,
  manualAfterLoan = 0,
): number {
  if (manualAfterLoan > 0) return Math.round(manualAfterLoan);
  const a = Number.isFinite(faseA) ? Math.max(0, faseA) : 0;
  const y = Number.isFinite(monthlyReleased)
    ? Math.max(0, monthlyReleased)
    : 0;
  return Math.max(0, Math.round(a - y));
}

/**
 * Forbruk som 70/85/100 % og «Fyll Spar for mål» skal bruke.
 * Uten Y (og uten manuelt fase B) = uendret MVP: bare fase A.
 */
export function selectedPhaseSpend(opts: {
  faseA: number;
  monthlyReleased: number;
  manualAfterLoan?: number;
  phase: SpendPhase;
}): number {
  const {
    faseA,
    monthlyReleased,
    manualAfterLoan = 0,
    phase,
  } = opts;
  const hasTwoPhase =
    monthlyReleased > 0 || (manualAfterLoan > 0 && faseA > 0);
  if (!hasTwoPhase || phase === "A") {
    return faseA > 0 ? Math.round(faseA) : 0;
  }
  return phaseBSpend(faseA, monthlyReleased, manualAfterLoan);
}
