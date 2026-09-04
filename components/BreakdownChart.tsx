"use client";

import { useEffect, useRef, useState } from "react";
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const [chartKey, setChartKey] = useState(0);
  const lastWidth = useRef(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let timer = 0;
    const ro = new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect.width ?? 0);
      if (width === lastWidth.current) return;
      lastWidth.current = width;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setChartKey((k) => k + 1), 0);
    });
    ro.observe(el);
    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  const data = scenarios.map((s) => ({
    name: s.label,
    Folketrygd: Math.round(s.folketrygd.yearly),
    TP: Math.round(s.tp.yearly),
    AFP: Math.round(s.afp.yearly),
    Sparing: Math.round(s.saving.yearly),
  }));

  return (
    <div
      ref={wrapRef}
      className="h-72 w-full min-w-0"
      role="img"
      aria-label="Stolpediagram over pensjonskilder per scenario"
    >
      <ResponsiveContainer key={chartKey} width="100%" height={288}>
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
