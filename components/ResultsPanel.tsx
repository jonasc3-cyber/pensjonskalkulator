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
  const breakdown = base.savingBreakdown ?? [];
  const tpBreakdown = base.tpBreakdown ?? [];

  const scenarios = [
    {
      label: "Pessimistisk",
      s: low,
      order: "order-2 sm:order-1",
      card: "border-slate-200 bg-slate-50/80",
      amount: "text-xl font-semibold text-slate-600 sm:text-2xl",
      hero: false,
    },
    {
      label: "Basis",
      s: base,
      order: "order-1 sm:order-2",
      card:
        "border-2 border-primary bg-primary-soft shadow-sm ring-1 ring-primary/10 [border-left-color:var(--accent)] [border-left-width:5px]",
      amount: "text-3xl font-bold text-primary sm:text-4xl",
      hero: true,
    },
    {
      label: "Optimistisk",
      s: high,
      order: "order-3 sm:order-3",
      card: "border-accent/25 bg-accent-soft/70",
      amount: "text-xl font-semibold text-accent sm:text-2xl",
      hero: false,
    },
  ] as const;

  return (
    <section
      id="results"
      className="scroll-mt-4 space-y-5"
      aria-labelledby="results-heading"
      aria-live="polite"
    >
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <h2 id="results-heading" className="text-lg font-semibold text-primary">
          Estimert pensjon ({unit})
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          I dagens kroneverdi · Fra uttak ved{" "}
          {result.age + result.yearsToRetirement} år ·{" "}
          {result.yearsToRetirement} år til uttak · tre scenarioer
        </p>

        <p className="mt-4 text-base text-slate-700 sm:text-lg">
          Du kan forvente ca.{" "}
          <strong className="tabular-nums text-primary">
            {formatRange(low.totalMonthly, high.totalMonthly)}
          </strong>{" "}
          per måned
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {scenarios.map(({ label, s, order, card, amount, hero }) => (
            <div
              key={label}
              className={`rounded-xl border p-4 ${card} ${order}`}
            >
              <div className="flex items-center gap-2">
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${
                    hero ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </p>
                {hero ? (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
                    Hovedanslag
                  </span>
                ) : null}
              </div>
              <p className={`mt-2 tabular-nums ${amount}`}>
                {formatNOK(s.totalMonthly)}
              </p>
              <p className="text-xs text-muted-foreground">per måned</p>
              <p
                className={`mt-2 tabular-nums text-slate-700 ${
                  hero ? "text-sm" : "text-xs"
                }`}
              >
                {formatNOK(s.totalYearly)} / år
              </p>
              {hero ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Erstatningsgrad av forventet sluttlønn{" "}
                  {formatPercent(s.replacementRate)}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        {base.garantipensjonApplied ? (
          <p className="mt-4 rounded-lg border border-info-border bg-info-bg px-3 py-2 text-xs text-info-text">
            Garantipensjonsgulv er brukt i minst ett scenario (forenklet sats).
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <h3 className="text-base font-semibold text-primary">
          Fordeling (basis-scenario, årlig)
        </h3>
        <ul
          className="mt-3 flex flex-wrap gap-2"
          aria-label="Fordeling etter kilde"
        >
          {(
            [
              ["Folketrygd", base.folketrygd.yearly, palette.chart.folketrygd],
              ["Tjenestepensjon", base.tp.yearly, palette.chart.tp],
              ["AFP", base.afp.yearly, palette.chart.afp],
              ["Egen sparing", base.saving.yearly, palette.chart.sparing],
            ] as const
          ).map(([label, value, color]) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden
              />
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium tabular-nums text-primary">
                {formatNOK(value)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({formatNOK(value / 12)}/mnd)
              </span>
            </li>
          ))}
        </ul>

        {tpBreakdown.length > 1 ? (
          <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Tjenestepensjon per konto
            </h4>
            <ul className="mt-2 divide-y divide-border">
              {tpBreakdown.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-3 py-2 text-sm"
                >
                  <span className="text-slate-700">{row.label}</span>
                  <span className="tabular-nums font-medium text-primary">
                    {formatNOK(row.yearly)} / år
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {breakdown.length > 1 ? (
          <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Egen sparing per konto
            </h4>
            <ul className="mt-2 divide-y divide-border">
              {breakdown.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-3 py-2 text-sm"
                >
                  <span className="text-slate-700">{row.label}</span>
                  <span className="tabular-nums font-medium text-primary">
                    {formatNOK(row.yearly)} / år
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

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
