"use client";

import { useMemo } from "react";
import type { CalculatorInputs } from "@/lib/pension/types";
import {
  compareWithdrawalAges,
  type WithdrawalAgeComparisonRow,
} from "@/lib/pension/withdrawalAgeComparison";
import { formatNOK, formatPercent } from "@/lib/format";

function deltaLabel(
  row: WithdrawalAgeComparisonRow,
  reference: WithdrawalAgeComparisonRow | undefined,
): string | null {
  if (
    !row.available ||
    row.monthly == null ||
    !reference?.available ||
    reference.monthly == null ||
    row.age === reference.age
  ) {
    return null;
  }
  const delta = row.monthly - reference.monthly;
  if (Math.abs(delta) < 0.5) return "Samme som 67 år";
  const sign = delta > 0 ? "+" : "−";
  return `${sign}${formatNOK(Math.abs(delta))} vs 67 år`;
}

export function WithdrawalAgeComparison({
  inputs,
  showNet,
}: {
  inputs: CalculatorInputs;
  showNet: boolean;
}) {
  const rows = useMemo(() => compareWithdrawalAges(inputs), [inputs]);
  const reference = rows.find((r) => r.age === 67);
  const unit = showNet ? "netto (anslag)" : "brutto";
  const anyAvailable = rows.some((r) => r.available);
  const anyPast = rows.some((r) => !r.available);

  return (
    <div
      className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
      data-testid="withdrawal-age-comparison"
    >
      <h3 className="text-base font-semibold text-primary">
        Sammenlign uttaksalder
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Samme forutsetninger · månedlig pensjon ({unit}) ved 62, 67 og 70 år ·
        basis-scenario · dagens kroneverdi
      </p>

      {!anyAvailable ? (
        <p
          className="mt-4 rounded-lg border border-info-border bg-info-bg px-3 py-2 text-sm text-info-text"
          role="status"
        >
          Du har allerede passert alle sammenligningsaldrene (62, 67 og 70).
          Juster fødselsår for å se anslag.
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {rows.map((row) => {
            const hero = row.isSelected && row.available;
            const delta = deltaLabel(row, reference);

            if (!row.available) {
              return (
                <div
                  key={row.age}
                  className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 opacity-70"
                  data-testid={`withdrawal-age-${row.age}`}
                  aria-disabled="true"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {row.age} år
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Passert — ikke tilgjengelig
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Du er allerede eldre enn {row.age} år
                  </p>
                </div>
              );
            }

            return (
              <div
                key={row.age}
                className={`rounded-xl border p-4 ${
                  hero
                    ? "border-2 border-primary bg-primary-soft shadow-sm ring-1 ring-primary/10 [border-left-color:var(--accent)] [border-left-width:5px]"
                    : row.age === 67
                      ? "border-accent/25 bg-accent-soft/50"
                      : "border-slate-200 bg-slate-50/80"
                }`}
                data-testid={`withdrawal-age-${row.age}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={`text-xs font-medium uppercase tracking-wide ${
                      hero ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {row.age} år
                  </p>
                  {hero ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
                      Valgt
                    </span>
                  ) : null}
                  {row.age === 67 && !hero ? (
                    <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      Referanse
                    </span>
                  ) : null}
                </div>
                <p
                  className={`mt-2 tabular-nums ${
                    hero
                      ? "text-2xl font-bold text-primary sm:text-3xl"
                      : "text-xl font-semibold text-slate-700 sm:text-2xl"
                  }`}
                >
                  {formatNOK(row.monthly ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">per måned</p>
                <p className="mt-2 text-xs tabular-nums text-slate-700">
                  {formatNOK(row.yearly ?? 0)} / år
                </p>
                {row.replacementRate != null ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Erstatningsgrad {formatPercent(row.replacementRate)}
                  </p>
                ) : null}
                {delta ? (
                  <p className="mt-2 text-xs font-medium text-primary">
                    {delta}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {anyPast && anyAvailable ? (
        <p className="mt-3 text-xs text-muted-foreground" role="note">
          Aldrene du allerede har passert er markert som utilgjengelige.
        </p>
      ) : null}
    </div>
  );
}
