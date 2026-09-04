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
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v) =>
              new Intl.NumberFormat("nb-NO", {
                notation: "compact",
                compactDisplay: "short",
              }).format(v)
            }
          />
          <Tooltip
            formatter={(value) => formatNOK(Number(value ?? 0))}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Folketrygd" stackId="a" fill="#0f766e" />
          <Bar dataKey="TP" stackId="a" fill="#0ea5e9" />
          <Bar dataKey="AFP" stackId="a" fill="#6366f1" />
          <Bar dataKey="Sparing" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
