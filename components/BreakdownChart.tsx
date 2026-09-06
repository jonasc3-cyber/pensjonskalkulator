"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScenarioResult } from "@/lib/pension/types";
import { chartSeries, palette } from "@/lib/theme";
import { ChartFrame } from "./ChartFrame";
import { ChartLegendContent } from "./ChartLegend";
import { ChartTooltip } from "./ChartTooltip";

export function BreakdownChart({
  scenarios,
}: {
  scenarios: ScenarioResult[];
}) {
  const data = scenarios.map((s) => ({
    name: s.label,
    Folketrygd: Math.round(s.folketrygd.yearly),
    TP: Math.round(s.tp.yearly),
    AFP: Math.round(s.afp.yearly),
    Sparing: Math.round(s.saving.yearly),
  }));

  return (
    <ChartFrame aria-label="Stolpediagram over pensjonskilder per scenario">
      {({ width, height }) => (
        <ResponsiveContainer width={width} height={height} debounce={50}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.chart.grid} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: palette.slate }} />
            <YAxis
              tick={{ fontSize: 11, fill: palette.slate }}
              tickFormatter={(v) =>
                new Intl.NumberFormat("nb-NO", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(v)
              }
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend content={<ChartLegendContent />} />
            {chartSeries.map((series, index) => (
              <Bar
                key={series.key}
                dataKey={series.key}
                stackId="a"
                fill={series.color}
                radius={
                  index === chartSeries.length - 1
                    ? ([4, 4, 0, 0] as [number, number, number, number])
                    : undefined
                }
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartFrame>
  );
}
