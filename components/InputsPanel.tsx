"use client";

import { Field, inputClass, inputErrorClass, selectClass } from "./Field";
import { CurrencyInput } from "./CurrencyInput";
import { SectionDivider } from "./SectionDivider";
import { SavingsAccounts } from "./SavingsAccounts";
import { TpAccounts } from "./TpAccounts";
import type { CalculatorInputs } from "@/lib/pension/types";
import { CURRENT_YEAR } from "@/lib/constants";
import {
  ANNUAL_SALARY_MAX,
  ANNUAL_SALARY_MIN,
  validateAnnualSalary,
} from "@/lib/salaryValidation";
import { CohortWarning } from "./CohortWarning";

type Props = {
  values: CalculatorInputs;
  /** True when the consolidated Avansert/Antagelser panel is open. */
  assumptionsOpen: boolean;
  /** True while defaults are shown and brukeren ikke har endret noe. */
  isExampleData?: boolean;
  onChange: <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) => void;
  onToggleAssumptions: () => void;
  onReset?: () => void;
};

export function InputsPanel({
  values,
  assumptionsOpen,
  isExampleData = false,
  onChange,
  onToggleAssumptions,
  onReset,
}: Props) {
  const age = CURRENT_YEAR - values.birthYear;
  const salaryCheck = validateAnnualSalary(values.annualSalary);
  const salaryError = salaryCheck.ok ? undefined : salaryCheck.message;

  return (
    <section
      id="skjema"
      className="scroll-mt-20 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
      aria-labelledby="inputs-heading"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="inputs-heading" className="text-lg font-semibold text-primary">
              Dine opplysninger
            </h2>
            {isExampleData ? (
              <span
                className="inline-flex items-center rounded-full border border-amber-300/80 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-900"
                data-testid="eksempeldata-badge"
                title="Forhåndsutfylte tall for å vise hvordan kalkulatoren fungerer. Endre feltene til dine egne verdier."
              >
                Eksempeldata
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Alt beregnes lokalt i nettleseren. Tall lagres kun i din nettleser /
            i lenken du selv deler — ingenting sendes til server.
            {isExampleData
              ? " Tallene under er eksempeldata — bytt dem til dine egne."
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
            title="Beregningene skjer i nettleseren din"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 3l8 3v6c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V6l8-3z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            100 % privat – beregnes lokalt
          </span>
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-muted"
            >
              Nullstill
            </button>
          ) : null}
          <button
            type="button"
            onClick={onToggleAssumptions}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary-soft"
            aria-pressed={assumptionsOpen}
            aria-controls="antagelser"
          >
            {assumptionsOpen ? "Skjul avansert" : "Avansert"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <Field id="birthYear" label="Fødselsår" hint={`Alder i ${CURRENT_YEAR}: ${age} år`}>
          <input
            id="birthYear"
            type="number"
            min={1940}
            max={CURRENT_YEAR - 18}
            className={inputClass}
            value={values.birthYear}
            onChange={(e) => onChange("birthYear", Number(e.target.value))}
          />
        </Field>

        <Field
          id="annualSalary"
          label="Årslønn brutto (kr)"
          hint={`Mellom ${ANNUAL_SALARY_MIN.toLocaleString("nb-NO")} og ${ANNUAL_SALARY_MAX.toLocaleString("nb-NO")} kr`}
          error={salaryError}
        >
          <CurrencyInput
            id="annualSalary"
            value={values.annualSalary}
            min={0}
            max={ANNUAL_SALARY_MAX}
            step={10000}
            className={`${salaryError ? inputErrorClass : inputClass} tabular-nums`}
            aria-invalid={Boolean(salaryError)}
            aria-describedby={salaryError ? "annualSalary-error" : undefined}
            onChange={(v) => onChange("annualSalary", v)}
          />
        </Field>

        <div className="sm:col-span-2">
          <CohortWarning birthYear={values.birthYear} />
        </div>

        <Field
          id="retirementAge"
          label={`Uttaksalder: ${values.retirementAge} år`}
          hint="Fra 62 til 75 år"
        >
          <input
            id="retirementAge"
            type="range"
            min={62}
            max={75}
            className="w-full accent-primary"
            value={values.retirementAge}
            onChange={(e) => onChange("retirementAge", Number(e.target.value))}
          />
        </Field>

        <Field id="afpType" label="AFP" hint="Forenklet anslag — ikke offisielle regler">
          <select
            id="afpType"
            className={selectClass}
            value={values.afpType}
            onChange={(e) =>
              onChange("afpType", e.target.value as CalculatorInputs["afpType"])
            }
          >
            <option value="ingen">Ingen AFP</option>
            <option value="privat">Privat AFP (forenkling)</option>
            <option value="offentlig">Offentlig AFP (forenkling)</option>
          </select>
        </Field>

        <Field
          id="sivilstatus"
          label="Sivilstand"
          hint="Påvirker garantipensjonsgulvet (enslig har høyere sats enn gift/samboer)."
        >
          <select
            id="sivilstatus"
            className={selectClass}
            value={values.sivilstatus}
            onChange={(e) =>
              onChange(
                "sivilstatus",
                e.target.value as CalculatorInputs["sivilstatus"],
              )
            }
          >
            <option value="enslig">Enslig</option>
            <option value="gift">Gift / samboer</option>
          </select>
        </Field>

        <Field id="showNet" label="Visning">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              id="showNet"
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-primary"
              checked={values.showNet}
              onChange={(e) => onChange("showNet", e.target.checked)}
            />
            Vis grovt nettoanslag (ca. 78 % av brutto)
          </label>
        </Field>

        <SectionDivider
          src="/divider-savings.webp"
          className="sm:col-span-2"
        />

        <TpAccounts
          accounts={values.tpAccounts}
          onChange={(tpAccounts) => onChange("tpAccounts", tpAccounts)}
        />

        <SavingsAccounts
          accounts={values.savings}
          onChange={(savings) => onChange("savings", savings)}
        />
      </div>
    </section>
  );
}
