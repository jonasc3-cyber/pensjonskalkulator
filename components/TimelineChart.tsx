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

/** First age where TP+sparing drop to ~0 after having been positive. */
function findTpSavingEndAge(
  points: { age: number; TP: number; Sparing: number }[],
): number | null {
  let hadTpOrSaving = false;
  for (const p of points) {
    const tpSaving = p.TP + p.Sparing;
    if (tpSaving > 1) {
      hadTpOrSaving = true;
      continue;
    }
    if (hadTpOrSaving && tpSaving <= 1) {
      return p.age;
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
  const dropAge = findTpSavingEndAge(chartData);

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
                  value: "TP/sparing slutt",
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
