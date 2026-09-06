"use client";

import type { SyntheticEvent } from "react";
import { Field, inputClass, selectClass } from "./Field";
import { CurrencyInput } from "./CurrencyInput";
import type { CalculatorInputs } from "@/lib/pension/types";

type Props = {
  values: CalculatorInputs;
  onChange: <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) => void;
  /** Controlled open state for the collapsible panel. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AssumptionsPanel({
  values,
  onChange,
  open,
  onOpenChange,
}: Props) {
  const controlled = open !== undefined;

  return (
    <details
      id="antagelser"
      className="group scroll-mt-4 rounded-2xl border border-border bg-muted/70 shadow-sm open:bg-muted/80"
      {...(controlled
        ? {
            open,
            onToggle: (e: SyntheticEvent<HTMLDetailsElement>) => {
              onOpenChange?.(e.currentTarget.open);
            },
          }
        : {})}
    >
      <summary className="cursor-pointer list-none rounded-2xl px-4 py-4 marker:content-none sm:px-5 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              id="assumptions-heading"
              className="text-base font-semibold text-primary"
            >
              Avansert og antagelser
            </h2>
            <p className="mt-1 text-sm text-muted-foreground group-open:hidden">
              Pensjonsbeholdning, lønnsvekst, utbetalingsperiode m.m.
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

      <div className="space-y-6 border-t border-border px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <p className="text-sm text-muted-foreground">
          Endringer oppdaterer prognosen med én gang. Scenarioene justerer i
          tillegg avkastning og vekst automatisk. Avkastning for tjenestepensjon
          og egen sparing settes per konto under «Tjenestepensjon» / «Egen
          sparing».
        </p>

        <div id="avansert" className="scroll-mt-4 space-y-4">
          <h3 className="text-sm font-semibold text-primary">
            Pensjonsbeholdning
          </h3>
          <Field
            id="folketrygdBalance"
            label="Pensjonsbeholdning (folketrygd)"
            hint="Fra NAV / Din pensjon — la stå tom for estimat"
          >
            <CurrencyInput
              id="folketrygdBalance"
              value={values.folketrygdBalance}
              min={0}
              step={10000}
              allowEmpty
              emptyValue={0}
              placeholder="Estimeres automatisk"
              onChange={(v) => onChange("folketrygdBalance", v)}
            />
          </Field>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-primary">
            Vekst og inflasjon
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                onChange={(e) =>
                  onChange("gGrowth", Number(e.target.value) / 100)
                }
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
          </div>
        </div>

        <div
          id="utbetaling"
          className="scroll-mt-4 space-y-4 rounded-xl border border-border bg-card/60 p-4"
        >
          <div>
            <h3 className="text-sm font-semibold text-primary">
              Utbetalingsperiode
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Velg om TP og egen sparing betales ut over et fast antall år eller
              livsvarig (forenklet). Antall år vises bare når «Over N år» er
              valgt.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="tpPayoutMode"
              label="TP-utbetaling"
              hint="Gjelder alle TP-kontoer"
            >
              <select
                id="tpPayoutMode"
                className={selectClass}
                value={values.tpPayoutMode}
                onChange={(e) =>
                  onChange(
                    "tpPayoutMode",
                    e.target.value as CalculatorInputs["tpPayoutMode"],
                  )
                }
              >
                <option value="aar">Over N år</option>
                <option value="livsvarig">Livsvarig (forenklet)</option>
              </select>
            </Field>

            {values.tpPayoutMode === "aar" ? (
              <Field id="assumptions-tp-years" label="TP utbetalingsår">
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
            ) : null}

            <Field id="savingPayoutMode" label="Sparing-utbetaling">
              <select
                id="savingPayoutMode"
                className={selectClass}
                value={values.savingPayoutMode}
                onChange={(e) =>
                  onChange(
                    "savingPayoutMode",
                    e.target.value as CalculatorInputs["savingPayoutMode"],
                  )
                }
              >
                <option value="aar">Over N år</option>
                <option value="livsvarig">Livsvarig (forenklet)</option>
              </select>
            </Field>

            {values.savingPayoutMode === "aar" ? (
              <Field id="assumptions-save-years" label="Sparing utbetalingsår">
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
            ) : null}
          </div>
        </div>
      </div>
    </details>
  );
}
