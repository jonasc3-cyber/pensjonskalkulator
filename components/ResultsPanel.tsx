"use client";

import type { CalculationResult } from "@/lib/pension/types";
import { formatNOK, formatPercent, formatRange } from "@/lib/format";
import { palette } from "@/lib/theme";
import { BreakdownChart } from "./BreakdownChart";
import { TimelineChart } from "./TimelineChart";
import { HowWeCalculated } from "./HowWeCalculated";

export function ResultsPanel({
  result,
  showNet,
}: {
  result: CalculationResult;
  showNet: boolean;
}) {
  const { low, base, high } = result.scenarios;
  const unit = showNet ? "netto (anslag)" : "brutto";

  return (
    <section
      className="space-y-5"
      aria-labelledby="results-heading"
      aria-live="polite"
    >
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <h2 id="results-heading" className="text-lg font-semibold text-primary">
          Estimert pensjon ({unit})
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fra uttak ved {result.age + result.yearsToRetirement} år ·{" "}
          {result.yearsToRetirement} år til uttak · tre scenarioer
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {(
            [
              [
                "Pessimistisk",
                low,
                "border-slate-200 bg-slate-50",
                "text-slate-700",
              ],
              [
                "Basis",
                base,
                "border-primary/25 bg-primary-soft",
                "text-primary",
              ],
              [
                "Optimistisk",
                high,
                "border-accent/30 bg-accent-soft",
                "text-accent",
              ],
            ] as const
          ).map(([label, s, cls, amountCls]) => (
            <div key={label} className={`rounded-xl border p-4 ${cls}`}>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p
                className={`mt-2 text-2xl font-semibold tabular-nums ${amountCls}`}
              >
                {formatNOK(s.totalMonthly)}
              </p>
              <p className="text-xs text-muted-foreground">per måned</p>
              <p className="mt-2 text-sm tabular-nums text-slate-700">
                {formatNOK(s.totalYearly)} / år
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Erstatningsgrad {formatPercent(s.replacementRate)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Månedlig intervall:{" "}
          <strong className="tabular-nums text-primary">
            {formatRange(low.totalMonthly, high.totalMonthly)}
          </strong>
        </p>
        {base.garantipensjonApplied ? (
          <p className="mt-2 rounded-lg border border-info-border bg-info-bg px-3 py-2 text-xs text-info-text">
            Garantipensjonsgulv er brukt i minst ett scenario (forenklet sats).
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <h3 className="text-base font-semibold text-primary">
          Fordeling (basis-scenario, årlig)
        </h3>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["Folketrygd", base.folketrygd.yearly, palette.chart.folketrygd],
              ["Tjenestepensjon", base.tp.yearly, palette.chart.tp],
              ["AFP", base.afp.yearly, palette.chart.afp],
              ["Egen sparing", base.saving.yearly, palette.chart.sparing],
            ] as const
          ).map(([label, value, color]) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-muted/60 p-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden
                />
                <dt className="text-xs font-medium text-muted-foreground">
                  {label}
                </dt>
              </div>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-primary">
                {formatNOK(value)}
              </dd>
              <p className="text-xs text-muted-foreground">
                {formatNOK(value / 12)} / mnd
              </p>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-800">
            Scenarioer etter kilde
          </h3>
          <BreakdownChart scenarios={[low, base, high]} />
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-800">
            Årlig pensjon over tid (basis)
          </h3>
          <TimelineChart data={result.timeline} />
        </div>
      </div>

      <HowWeCalculated points={result.explanation} />
    </section>
  );
}
