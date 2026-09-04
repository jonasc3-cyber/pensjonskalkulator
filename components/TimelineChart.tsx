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

export function TimelineChart({ data }: { data: TimelinePoint[] }) {
  const chartData = data.map((p) => ({
    age: p.age,
    Folketrygd: Math.round(p.folketrygd),
    TP: Math.round(p.tp),
    AFP: Math.round(p.afp),
    Sparing: Math.round(p.saving),
  }));

  return (
    <div
      className="h-72 w-full"
      role="img"
      aria-label="Områdediagram over årlig pensjon over tid (basis-scenario)"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="age"
            tick={{ fontSize: 12 }}
            label={{ value: "Alder", position: "insideBottom", offset: -2, fontSize: 11 }}
          />
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
            labelFormatter={(age) => `Alder ${age}`}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="Folketrygd" stackId="1" stroke="#0f766e" fill="#0f766e" fillOpacity={0.85} />
          <Area type="monotone" dataKey="TP" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.85} />
          <Area type="monotone" dataKey="AFP" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.85} />
          <Area type="monotone" dataKey="Sparing" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.85} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
