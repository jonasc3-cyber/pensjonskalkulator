"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScenarioResult } from "@/lib/pension/types";
import { chartSeries, palette } from "@/lib/theme";
import { ChartFrame } from "./ChartFrame";
import { ChartLegendContent } from "./ChartLegend";
import { ChartTableToggle } from "./ChartTableToggle";
import { ChartTooltip } from "./ChartTooltip";

function isEmptyBreakdown(data: Array<Record<string, number | string>>): boolean {
  if (data.length === 0) return true;
  return data.every((row) =>
    chartSeries.every((s) => {
      const v = row[s.key];
      return typeof v !== "number" || v === 0;
    }),
  );
}

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

  const empty = isEmptyBreakdown(data);

  const columns = chartSeries.map((s) => ({
    key: s.key,
    header: s.label,
  }));

  const rows = data.map((row) => ({
    label: row.name,
    values: {
      Folketrygd: row.Folketrygd,
      TP: row.TP,
      AFP: row.AFP,
      Sparing: row.Sparing,
    },
  }));

  const chart = (
    <ChartFrame
      aria-label="Stolpediagram over pensjonskilder per scenario"
      empty={empty}
      emptyMessage="Ingen pensjonsbeløp å vise ennå. Oppgi lønn og øvrige tall for å se fordeling per scenario."
    >
      {({ width, height }) => (
        /* Explicit pixel size — avoid ResponsiveContainer 0×0 race */
        <BarChart
          width={width}
          height={height}
          data={data}
          margin={{ top: 8, right: 8, left: 4, bottom: 28 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={palette.chart.grid} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 13, fill: palette.slate }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: palette.slate }}
            width={48}
            tickFormatter={(v) =>
              new Intl.NumberFormat("nb-NO", {
                notation: "compact",
                compactDisplay: "short",
              }).format(v)
            }
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend
            verticalAlign="bottom"
            content={<ChartLegendContent />}
            wrapperStyle={{ paddingTop: 4 }}
          />
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
      )}
    </ChartFrame>
  );

  return (
    <ChartTableToggle
      chart={chart}
      columns={columns}
      rows={rows}
      caption="Pensjonskilder per scenario (årlig, kr)"
    />
  );
}
