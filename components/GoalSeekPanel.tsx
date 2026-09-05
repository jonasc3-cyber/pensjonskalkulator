"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { CalculationResult, CalculatorInputs } from "@/lib/pension/types";
import {
  computeGoalSeek,
  defaultGoalAccountId,
  defaultGoalMonthly,
  goalAccountOptions,
} from "@/lib/pension/goalSeek";
import { formatNOK, formatRange } from "@/lib/format";
import { Field, selectClass } from "./Field";
import { CurrencyInput } from "./CurrencyInput";

type Props = {
  values: CalculatorInputs;
  result: CalculationResult;
};

export function GoalSeekPanel({ values, result }: Props) {
  const options = useMemo(
    () => goalAccountOptions(values.savings),
    [values.savings],
  );

  const [targetMonthly, setTargetMonthly] = useState(0);
  const [accountId, setAccountId] = useState(() =>
    defaultGoalAccountId(values.savings),
  );
  /** Siste auto-utfylte mål — brukes for å oppdatere ved lønnsendring uten å overskrive brukerinput. */
  const autoDefaultRef = useRef(0);

  // Smart default: ~75 % av årslønn / 12 når feltet er tomt eller fortsatt på forrige auto-verdi
  useEffect(() => {
    const nextDefault = defaultGoalMonthly(values.annualSalary);
    if (!(nextDefault > 0)) return;
    setTargetMonthly((current) => {
      if (current === 0 || current === autoDefaultRef.current) {
        autoDefaultRef.current = nextDefault;
        return nextDefault;
      }
      return current;
    });
  }, [values.annualSalary]);

  // Hold valgt konto gyldig når sparelisten endres
  useEffect(() => {
    if (!options.some((o) => o.id === accountId)) {
      setAccountId(defaultGoalAccountId(values.savings));
    }
  }, [options, accountId, values.savings]);

  const seek = useMemo(
    () =>
      computeGoalSeek({
        targetMonthly,
        inputs: values,
        result,
        accountId,
      }),
    [targetMonthly, values, result, accountId],
  );

  const unit = values.showNet ? "netto (anslag)" : "brutto";
  const showExtreme = targetMonthly > 200_000;
  const atRetirement = result.yearsToRetirement === 0;
  const selectedGoalAccount = values.savings.find((a) => a.id === accountId);
  const goalAccountIsIps = selectedGoalAccount?.kind === "ips";

  return (
    <section
      id="spar-for-mal"
      className="scroll-mt-4 overflow-x-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
      aria-labelledby="goal-seek-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2
            id="goal-seek-heading"
            className="text-lg font-semibold text-primary"
          >
            Spar for mål
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Oppgi ønsket pensjon per måned i dagens kroneverdi. Vi regner ut
            hvor mye du må spare for å lukke gapet mot folketrygd, TP, AFP og
            øvrig sparing.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          id="goal-target"
          label={`Ønsket pensjon per måned (${unit})`}
          hint={
            values.showNet
              ? "Forslag: ca. 75 % av årslønn / 12. Målet tolkes som nettoanslag (samme ~78 % av brutto som i prognosen)."
              : "Forslag: ca. 75 % av årslønn / 12. Samme basis som estimert pensjon over (brutto før skatt)."
          }
        >
          <CurrencyInput
            id="goal-target"
            value={targetMonthly}
            onChange={setTargetMonthly}
            allowEmpty
            emptyValue={0}
            placeholder="f.eks. 40 000"
            aria-label={`Ønsket pensjon per måned, ${unit}`}
          />
        </Field>

        <Field
          id="goal-account"
          label="Sparekonto for målet"
          hint={
            options.some((o) => o.synthetic && o.id === accountId)
              ? "Ingen / ny konto: vi bruker standard fondsavkastning uten eksisterende saldo."
              : "Gapet fylles i denne kontoen; øvrige kontoer telles som allerede dekket."
          }
        >
          <select
            id="goal-account"
            className={selectClass}
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
                {!o.synthetic && o.monthly > 0
                  ? ` · sparer ${formatNOK(o.monthly)}/mnd`
                  : ""}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {goalAccountIsIps ? (
        <p
          className="mt-3 rounded-lg border border-info-border bg-info-bg px-3 py-2 text-xs leading-relaxed text-info-text"
          role="note"
          data-testid="goal-ips-tax-disclaimer"
        >
          <strong className="font-semibold text-primary">IPS-skattefordel er ikke med:</strong>{" "}
          Ca. 22&nbsp;% inntektsfradrag / preferansebehandling for IPS er{" "}
          <em>ikke</em> inkludert i dette spareanslaget.
        </p>
      ) : null}

      {targetMonthly <= 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
          Skriv inn ønsket månedlig pensjon for å se nødvendig sparing.
        </p>
      ) : null}

      {showExtreme ? (
        <p className="mt-3 rounded-lg border border-info-border bg-info-bg px-3 py-2 text-xs text-info-text">
          Svært høyt mål (&gt; 200&nbsp;000 kr/mnd). Sjekk at beløpet er riktig —
          beregningen blokkeres ikke.
        </p>
      ) : null}

      {atRetirement && targetMonthly > 0 ? (
        <p className="mt-3 rounded-lg border border-info-border bg-info-bg px-3 py-2 text-xs text-info-text">
          Du er allerede ved uttaksalder i denne forenklingen — ekstra sparing
          frem til uttak hjelper ikke her.
        </p>
      ) : null}

      {seek ? (
        <div className="mt-5 space-y-4" aria-live="polite">
          {seek.alreadyMet ? (
            <div className="rounded-xl border border-accent/30 bg-accent-soft/70 p-4">
              <p className="text-sm font-semibold text-accent">
                Målet er dekket
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Allerede dekket{" "}
                <strong className="tabular-nums">
                  {formatNOK(seek.coveredMonthly)}
                </strong>
                /mnd uten ekstra sparing på {seek.account.label}. Margin ca.{" "}
                <strong className="tabular-nums">
                  {formatNOK(seek.marginMonthly)}
                </strong>
                /mnd.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Allerede dekket
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-primary">
                    {formatNOK(seek.coveredMonthly)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    per måned · FT+TP+AFP
                    {seek.account.synthetic || values.savings.length > 1
                      ? " + øvrig sparing"
                      : ""}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Gap til mål
                  </p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-primary">
                    {formatNOK(seek.gapMonthly)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    per måned · dagens kroner
                  </p>
                </div>
                <div className="rounded-xl border-2 border-primary bg-primary-soft p-3 shadow-sm ring-1 ring-primary/10 [border-left-color:var(--accent)] [border-left-width:5px]">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    Nødvendig sparing
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-primary">
                    {formatNOK(seek.required.base.monthly)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    per måned · basis
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Scenarioer for nødvendig sparing
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Ca.{" "}
                  <strong className="tabular-nums">
                    {formatRange(
                      seek.required.low.monthly,
                      seek.required.high.monthly,
                    )}
                  </strong>{" "}
                  /mnd avhengig av avkastning
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                  {(
                    [
                      ["low", "Pessimistisk"],
                      ["base", "Basis"],
                      ["high", "Optimistisk"],
                    ] as const
                  ).map(([key, label]) => (
                    <li
                      key={key}
                      className={`rounded-lg border px-3 py-2 ${
                        key === "base"
                          ? "border-primary/40 bg-primary-soft/80"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="tabular-nums font-semibold text-primary">
                        {formatNOK(seek.required[key].monthly)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 px-3 py-3 text-sm text-slate-700">
                {seek.account.synthetic || seek.currentMonthlySaving <= 0 ? (
                  <p>
                    Du sparer ikke på denne kontoen i dag. For å nå målet trenger
                    du ca.{" "}
                    <strong className="tabular-nums">
                      {formatNOK(seek.required.base.monthly)}
                    </strong>
                    /mnd (basis).
                  </p>
                ) : seek.monthlyDiff > 25 ? (
                  <p>
                    Du sparer{" "}
                    <strong className="tabular-nums">
                      {formatNOK(seek.currentMonthlySaving)}
                    </strong>
                    /mnd i dag → mangler ca.{" "}
                    <strong className="tabular-nums">
                      {formatNOK(seek.monthlyDiff)}
                    </strong>
                    /mnd.
                  </p>
                ) : seek.monthlyDiff < -25 ? (
                  <p>
                    Du sparer{" "}
                    <strong className="tabular-nums">
                      {formatNOK(seek.currentMonthlySaving)}
                    </strong>
                    /mnd — ca.{" "}
                    <strong className="tabular-nums">
                      {formatNOK(-seek.monthlyDiff)}
                    </strong>
                    /mnd mer enn nødvendig for dette målet (basis).
                  </p>
                ) : (
                  <p>
                    Du sparer allerede ca. det som trengs for dette målet (
                    <strong className="tabular-nums">
                      {formatNOK(seek.currentMonthlySaving)}
                    </strong>
                    /mnd).
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      ) : null}

      <p className="mt-5 text-xs text-muted-foreground">
        Forenklet modell med samme begrensninger som prognosen (skatt og IPS-fradrag
        ca. 22&nbsp;% er ikke inkludert; ikke offisiell rådgivning). Les mer om metoden på{" "}
        <Link href="/om" className="font-medium text-primary underline-offset-2 hover:underline">
          Om kalkulatoren
        </Link>
        .
      </p>
    </section>
  );
}
