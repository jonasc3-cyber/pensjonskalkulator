"use client";

import { useId, useState, type ReactNode } from "react";
import { AFP_NOT_INCLUDED_LABEL, formatChartSeriesValue, isAfpNotIncluded } from "@/lib/format";

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

  // Hide AFP column when not included (all rounded yearly values are 0)
  const afpAllZero =
    columns.some((c) => c.key === "AFP") &&
    rows.length > 0 &&
    rows.every((row) => isAfpNotIncluded(row.values.AFP ?? 0));

  const visibleColumns = afpAllZero
    ? columns.filter((c) => c.key !== "AFP")
    : columns;

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
                {visibleColumns.map((col) => (
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
                  {visibleColumns.map((col) => {
                    const value = row.values[col.key] ?? 0;
                    const label = formatChartSeriesValue(col.key, value);
                    const afpExcluded =
                      col.key === "AFP" && label === AFP_NOT_INCLUDED_LABEL;
                    return (
                      <td
                        key={col.key}
                        className={
                          afpExcluded
                            ? "px-3 py-2.5 text-sm font-medium text-muted-foreground"
                            : "px-3 py-2.5 tabular-nums text-sm text-primary"
                        }
                        {...(afpExcluded
                          ? { "data-testid": "afp-not-included-table" }
                          : {})}
                      >
                        {label}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {afpAllZero ? (
            <p
              className="border-t border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
              data-testid="afp-not-included-table-note"
            >
              AFP: {AFP_NOT_INCLUDED_LABEL}
            </p>
          ) : null}
        </div>
      ) : (
        chart
      )}
    </div>
  );
}
