"use client";

import type { DefaultLegendContentProps } from "recharts";
import { chartSeries, chartSeriesOrder, type ChartSeriesKey } from "@/lib/theme";

const colorByKey = Object.fromEntries(
  chartSeries.map((s) => [s.key, s.color]),
) as Record<ChartSeriesKey, string>;

/** Shared square legend — order = stack bottom→top on both charts */
export function ChartLegendContent({ payload }: DefaultLegendContentProps) {
  if (!payload?.length) return null;

  const byValue = new Map(
    payload.map((entry) => [String(entry.value), entry] as const),
  );

  const ordered = chartSeriesOrder
    .map((key) => byValue.get(key))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 pt-1 text-[13px] sm:gap-x-4 sm:text-xs">
      {ordered.map((entry) => {
        const key = String(entry.value) as ChartSeriesKey;
        const fill = colorByKey[key] ?? String(entry.color ?? "#64748B");
        const label =
          chartSeries.find((s) => s.key === key)?.label ?? key;
        return (
          <li
            key={key}
            className="inline-flex items-center gap-1.5 font-medium text-slate-700"
          >
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: fill }}
              aria-hidden
            />
            <span>{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
