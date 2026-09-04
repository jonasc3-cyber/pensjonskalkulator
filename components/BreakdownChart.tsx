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
import { formatNOK } from "@/lib/format";
import { palette } from "@/lib/theme";

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
    <div className="h-72 w-full" role="img" aria-label="Stolpediagram over pensjonskilder per scenario">
      <ResponsiveContainer width="100%" height="100%">
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
          <Tooltip
            formatter={(value) => formatNOK(Number(value ?? 0))}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              borderColor: palette.border,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Folketrygd" stackId="a" fill={palette.chart.folketrygd} />
          <Bar dataKey="TP" stackId="a" fill={palette.chart.tp} />
          <Bar dataKey="AFP" stackId="a" fill={palette.chart.afp} />
          <Bar
            dataKey="Sparing"
            stackId="a"
            fill={palette.chart.sparing}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
