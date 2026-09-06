"use client";

import { formatChartSeriesValue, formatNOK, isAfpNotIncluded } from "@/lib/format";
import { chartSeriesOrder, palette, type ChartSeriesKey } from "@/lib/theme";

type TooltipEntry = {
  dataKey?: string | number;
  name?: string;
  value?: number | string | Array<number | string>;
  color?: string;
};

type Props = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  /** Prefixed label, e.g. "Alder" → "Alder 72" */
  labelPrefix?: string;
};

/** Tooltip with kr per source, ordered like the stack (bottom→top). */
export function ChartTooltip({ active, payload, label, labelPrefix }: Props) {
  if (!active || !payload?.length) return null;

  const byKey = new Map<string, TooltipEntry>();
  for (const entry of payload) {
    const key = String(entry.dataKey ?? entry.name ?? "");
    if (key) byKey.set(key, entry);
  }

  const rows = chartSeriesOrder
    .map((key) => {
      const entry = byKey.get(key);
      if (!entry) return null;
      const raw = entry.value;
      const num = Array.isArray(raw) ? Number(raw[1] ?? raw[0] ?? 0) : Number(raw ?? 0);
      return { key: key as ChartSeriesKey, value: num, color: entry.color };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const total = rows.reduce((sum, r) => sum + r.value, 0);
  const heading =
    labelPrefix != null && label != null
      ? `${labelPrefix} ${label}`
      : label != null
        ? String(label)
        : null;

  return (
    <div
      className="rounded-lg border bg-white px-3 py-2 shadow-sm"
      style={{ borderColor: palette.border, fontSize: 12 }}
    >
      {heading ? (
        <p className="mb-1.5 font-medium text-slate-800">{heading}</p>
      ) : null}
      <ul className="space-y-1">
        {rows.map((row) => {
          const afpExcluded = row.key === "AFP" && isAfpNotIncluded(row.value);
          return (
            <li
              key={row.key}
              className="flex items-center justify-between gap-4 text-slate-600"
            >
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: row.color }}
                  aria-hidden
                />
                {row.key}
              </span>
              <span
                className={
                  afpExcluded
                    ? "font-medium text-muted-foreground"
                    : "tabular-nums font-medium text-slate-800"
                }
                {...(afpExcluded
                  ? { "data-testid": "afp-not-included-tooltip" }
                  : {})}
              >
                {formatChartSeriesValue(row.key, row.value)}
              </span>
            </li>
          );
        })}
      </ul>
      {rows.length > 1 ? (
        <p className="mt-1.5 flex justify-between gap-4 border-t border-slate-100 pt-1.5 font-medium text-slate-800">
          <span>Totalt</span>
          <span className="tabular-nums">{formatNOK(total)}</span>
        </p>
      ) : null}
    </div>
  );
}
