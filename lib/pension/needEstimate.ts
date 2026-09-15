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

/** Foreslått månedlig pensjonsbehov i dagens kroner = forbruk × andel. */
export function suggestedPensionNeed(
  spendMonthly: number,
  ratioPct: NeedRatio,
): number {
  if (!(spendMonthly > 0)) return 0;
  return Math.round(spendMonthly * (ratioPct / 100));
}
