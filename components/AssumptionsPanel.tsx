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
    <section
      className="rounded-2xl border border-border bg-muted/70 p-4 sm:p-5"
      aria-labelledby="assumptions-heading"
    >
      <h2
        id="assumptions-heading"
        className="text-base font-semibold text-primary"
      >
        Antagelser (redigerbare)
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Endringer oppdaterer prognosen med én gang. Scenarioene justerer i tillegg
        avkastning og vekst automatisk. Avkastning for tjenestepensjon og egen
        sparing settes per konto under «Tjenestepensjon» / «Egen sparing».
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </section>
  );
}
