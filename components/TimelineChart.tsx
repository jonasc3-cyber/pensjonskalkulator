"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TimelinePoint } from "@/lib/pension/types";
import { formatNOK } from "@/lib/format";
import { palette } from "@/lib/theme";
import { ChartFrame } from "./ChartFrame";

export function TimelineChart({ data }: { data: TimelinePoint[] }) {
  const chartData = data.map((p) => ({
    age: p.age,
    Folketrygd: Math.round(p.folketrygd),
    TP: Math.round(p.tp),
    AFP: Math.round(p.afp),
    Sparing: Math.round(p.saving),
  }));

  return (
    <ChartFrame aria-label="Områdediagram over årlig pensjon over tid (basis-scenario)">
      {({ width, height }) => (
        <ResponsiveContainer width={width} height={height} debounce={50}>
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={palette.chart.grid} />
            <XAxis
              dataKey="age"
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
            <Tooltip
              formatter={(value) => formatNOK(Number(value ?? 0))}
              labelFormatter={(age) => `Alder ${age}`}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                borderColor: palette.border,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="Folketrygd"
              stackId="1"
              stroke={palette.chart.folketrygd}
              fill={palette.chart.folketrygd}
              fillOpacity={0.9}
            />
            <Area
              type="monotone"
              dataKey="TP"
              stackId="1"
              stroke={palette.chart.tp}
              fill={palette.chart.tp}
              fillOpacity={0.88}
            />
            <Area
              type="monotone"
              dataKey="AFP"
              stackId="1"
              stroke={palette.chart.afp}
              fill={palette.chart.afp}
              fillOpacity={0.88}
            />
            <Area
              type="monotone"
              dataKey="Sparing"
              stackId="1"
              stroke={palette.chart.sparing}
              fill={palette.chart.sparing}
              fillOpacity={0.85}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartFrame>
  );
}
