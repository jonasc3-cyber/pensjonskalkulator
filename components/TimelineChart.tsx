"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TimelinePoint } from "@/lib/pension/types";
import { chartSeries, palette } from "@/lib/theme";
import { ChartFrame } from "./ChartFrame";
import { ChartLegendContent } from "./ChartLegend";
import { ChartTooltip } from "./ChartTooltip";

/**
 * First age where TP+sparing fall meaningfully (e.g. TP ends ~77 while
 * sparing continues) — not only when both hit ~0 (~82).
 */
function findFirstTpSavingDropAge(
  points: { age: number; TP: number; Sparing: number }[],
): number | null {
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    const prevSum = prev.TP + prev.Sparing;
    const currSum = curr.TP + curr.Sparing;
    // Cliff: lose ≥15% of prior TP+sparing and at least 5k kr
    if (prevSum > 5000 && currSum < prevSum * 0.85 && prevSum - currSum >= 5000) {
      return curr.age;
    }
  }
  return null;
}

/** X-ticks every 5 years from first age (e.g. 67, 72, 77, …). */
function ageTicksEveryFive(ages: number[]): number[] {
  if (ages.length === 0) return [];
  const start = ages[0]!;
  const end = ages[ages.length - 1]!;
  const ticks: number[] = [];
  for (let age = start; age <= end; age += 5) {
    ticks.push(age);
  }
  return ticks;
}

export function TimelineChart({ data }: { data: TimelinePoint[] }) {
  const chartData = data.map((p) => ({
    age: p.age,
    Folketrygd: Math.round(p.folketrygd),
    TP: Math.round(p.tp),
    AFP: Math.round(p.afp),
    Sparing: Math.round(p.saving),
  }));

  const ticks = ageTicksEveryFive(chartData.map((d) => d.age));
  const dropAge = findFirstTpSavingDropAge(chartData);

  return (
    <ChartFrame aria-label="Områdediagram over årlig pensjon over tid (basis-scenario)">
      {({ width, height }) => (
        <ResponsiveContainer width={width} height={height} debounce={50}>
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 12, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={palette.chart.grid} />
            <XAxis
              dataKey="age"
              ticks={ticks}
              tick={{ fontSize: 12, fill: palette.slate }}
              label={{
                value: "Alder",
                position: "insideBottom",
                offset: -2,
                fontSize: 11,
                fill: palette.slate,
              }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: palette.slate }}
              tickFormatter={(v) =>
                new Intl.NumberFormat("nb-NO", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(v)
              }
            />
            <Tooltip content={<ChartTooltip labelPrefix="Alder" />} />
            <Legend content={<ChartLegendContent />} />
            {dropAge != null ? (
              <ReferenceLine
                x={dropAge}
                stroke={palette.slate}
                strokeDasharray="4 4"
                strokeOpacity={0.7}
                label={{
                  value: "TP/sparing avtar",
                  position: "insideTopRight",
                  fill: palette.slate,
                  fontSize: 10,
                }}
              />
            ) : null}
            {chartSeries.map((series) => (
              <Area
                key={series.key}
                type="monotone"
                dataKey={series.key}
                stackId="1"
                stroke={series.color}
                fill={series.color}
                fillOpacity={0.88}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartFrame>
  );
}
