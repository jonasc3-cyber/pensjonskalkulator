"use client";

import { useId, useState, type ReactNode } from "react";
import { formatNOK } from "@/lib/format";

export type ChartTableColumn = {
  key: string;
  header: string;
};

export type ChartTableRow = {
  label: string;
  values: Record<string, number>;
};

/**
 * Mobil-vennlig «Vis som tabell»-bryter for diagram-a11y.
 * Viser diagrammet som standard; tabell er et tilgjengelig alternativ.
 */
export function ChartTableToggle({
  chart,
  columns,
  rows,
  caption,
}: {
  chart: ReactNode;
  columns: ChartTableColumn[];
  rows: ChartTableRow[];
  caption: string;
}) {
  const [asTable, setAsTable] = useState(false);
  const toggleId = useId();

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <button
          type="button"
          id={toggleId}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-muted sm:text-sm"
          aria-pressed={asTable}
          onClick={() => setAsTable((v) => !v)}
          data-testid="chart-table-toggle"
        >
          {asTable ? "Vis som diagram" : "Vis som tabell"}
        </button>
      </div>

      {asTable ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[280px] border-collapse text-left text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr className="border-b border-border bg-muted/60">
                <th
                  scope="col"
                  className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm"
                >
                  &nbsp;
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="px-3 py-2.5 text-xs font-semibold text-slate-700 sm:text-sm"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-border last:border-b-0"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-3 py-2.5 text-sm font-medium text-slate-700"
                  >
                    {row.label}
                  </th>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-3 py-2.5 tabular-nums text-sm text-primary"
                    >
                      {formatNOK(row.values[col.key] ?? 0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        chart
      )}
    </div>
  );
}
