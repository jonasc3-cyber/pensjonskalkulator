"use client";

import { Field, inputClass } from "./Field";
import type { CalculatorInputs } from "@/lib/pension/types";

type Props = {
  values: CalculatorInputs;
  onChange: <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) => void;
};

export function AssumptionsPanel({ values, onChange }: Props) {
  return (
    <details className="group rounded-2xl border border-border bg-muted/70 shadow-sm open:bg-muted/80">
      <summary className="cursor-pointer list-none rounded-2xl px-4 py-3.5 marker:content-none sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              id="assumptions-heading"
              className="text-base font-semibold text-primary"
            >
              Antagelser (redigerbare)
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground group-open:hidden">
              Trykk for å vise lønnsvekst, G-vekst, inflasjon m.m.
            </p>
          </div>
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary shadow-sm transition-transform group-open:rotate-180"
            aria-hidden
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </summary>

      <div className="border-t border-border px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
        <p className="text-xs text-muted-foreground">
          Endringer oppdaterer prognosen med én gang. Scenarioene justerer i
          tillegg avkastning og vekst automatisk. Avkastning for tjenestepensjon
          og egen sparing settes per konto under «Tjenestepensjon» / «Egen
          sparing».
        </p>

        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field id="assumptions-wage" label="Lønnsvekst %">
            <input
              id="assumptions-wage"
              type="number"
              step={0.1}
              className={inputClass}
              value={Number((values.wageGrowth * 100).toFixed(1))}
              onChange={(e) =>
                onChange("wageGrowth", Number(e.target.value) / 100)
              }
            />
          </Field>
          <Field id="assumptions-g" label="G-vekst %">
            <input
              id="assumptions-g"
              type="number"
              step={0.1}
              className={inputClass}
              value={Number((values.gGrowth * 100).toFixed(1))}
              onChange={(e) => onChange("gGrowth", Number(e.target.value) / 100)}
            />
          </Field>
          <Field
            id="assumptions-inflation"
            label="Inflasjon %"
            hint="Deflaterer resultatet til dagens kroneverdi"
          >
            <input
              id="assumptions-inflation"
              type="number"
              step={0.1}
              min={0}
              className={inputClass}
              value={Number((values.inflation * 100).toFixed(1))}
              onChange={(e) =>
                onChange("inflation", Number(e.target.value) / 100)
              }
            />
          </Field>
          <Field
            id="assumptions-tp-years"
            label="TP utbetalingsår"
            hint="Brukes når TP-utbetaling er «Over N år»"
          >
            <input
              id="assumptions-tp-years"
              type="number"
              min={5}
              max={25}
              className={inputClass}
              value={values.tpPayoutYears}
              onChange={(e) =>
                onChange("tpPayoutYears", Number(e.target.value))
              }
            />
          </Field>
          <Field
            id="assumptions-save-years"
            label="Sparing utbetalingsår"
            hint="Brukes når sparing-utbetaling er «Over N år»"
          >
            <input
              id="assumptions-save-years"
              type="number"
              min={5}
              max={30}
              className={inputClass}
              value={values.savingPayoutYears}
              onChange={(e) =>
                onChange("savingPayoutYears", Number(e.target.value))
              }
            />
          </Field>
        </div>
      </div>
    </details>
  );
}
