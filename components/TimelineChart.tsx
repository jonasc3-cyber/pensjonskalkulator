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
import { findFirstTpSavingDrop } from "@/lib/pension/timelineDrop";
import { chartSeries, palette } from "@/lib/theme";
import { ChartFrame } from "./ChartFrame";
import { ChartLegendContent } from "./ChartLegend";
import { ChartTableToggle } from "./ChartTableToggle";
import { ChartTooltip } from "./ChartTooltip";

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
  const dropAge = findFirstTpSavingDrop(data)?.dropAge ?? null;

  // Compact table: every 5 years (+ last) so mobile a11y stays readable
  const tickSet = new Set(ticks);
  const lastAge = chartData[chartData.length - 1]?.age;
  const tableRows = chartData
    .filter((row) => tickSet.has(row.age) || row.age === lastAge)
    .map((row) => ({
      label: `${row.age} år`,
      values: {
        Folketrygd: row.Folketrygd,
        TP: row.TP,
        AFP: row.AFP,
        Sparing: row.Sparing,
      },
    }));

  const columns = chartSeries.map((s) => ({
    key: s.key,
    header: s.label,
  }));

  const chart = (
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
              tick={{ fontSize: 13, fill: palette.slate }}
              label={{
                value: "Alder",
                position: "insideBottom",
                offset: -2,
                fontSize: 12,
                fill: palette.slate,
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: palette.slate }}
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
                  fontSize: 11,
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

  return (
    <ChartTableToggle
      chart={chart}
      columns={columns}
      rows={tableRows}
      caption="Årlig pensjon over tid (basis-scenario, kr)"
    />
  );
}
