import type { TimelinePoint } from "./types";

/**
 * Detects the first meaningful TP+sparing cliff on the basis timeline
 * (same criteria as the «TP/sparing avtar» reference line).
 *
 * Cliff: lose ≥15 % of prior TP+sparing and at least 5 000 kr (yearly).
 */
export interface TimelineDropInfo {
  /** Age where the first cliff lands (the marked drop year). */
  dropAge: number;
  /** Total yearly pension just before the cliff (dagens kroner, basis). */
  beforeYearly: number;
  /** Total yearly pension at/after the cliff (dagens kroner, basis). */
  afterYearly: number;
  /** Yearly gap = before − after. */
  gapYearly: number;
  /** Monthly gap in today's kroner (basis). */
  gapMonthly: number;
  /**
   * Monthly total just before the cliff — preferred Spar-for-mål prefill
   * («ønsket pensjon per måned» = nivå før fall).
   */
  beforeMonthly: number;
  /** Monthly total after the cliff. */
  afterMonthly: number;
}

/**
 * Find the first TP/sparing drop on a timeline, or null if none.
 * Timeline totals are yearly (same as buildTimeline / TimelineChart).
 */
export function findFirstTpSavingDrop(
  timeline: TimelinePoint[],
): TimelineDropInfo | null {
  for (let i = 1; i < timeline.length; i++) {
    const prev = timeline[i - 1]!;
    const curr = timeline[i]!;
    const prevSum = prev.tp + prev.saving;
    const currSum = curr.tp + curr.saving;
    if (
      prevSum > 5000 &&
      currSum < prevSum * 0.85 &&
      prevSum - currSum >= 5000
    ) {
      const gapYearly = Math.max(0, prev.total - curr.total);
      return {
        dropAge: curr.age,
        beforeYearly: prev.total,
        afterYearly: curr.total,
        gapYearly,
        gapMonthly: gapYearly / 12,
        beforeMonthly: prev.total / 12,
        afterMonthly: curr.total / 12,
      };
    }
  }
  return null;
}
