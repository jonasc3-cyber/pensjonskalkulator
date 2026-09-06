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
  advanced: boolean;
  /** True while defaults are shown and brukeren ikke har endret noe. */
  isExampleData?: boolean;
  onChange: <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) => void;
  onToggleAdvanced: () => void;
  onReset?: () => void;
};

export function InputsPanel({
  values,
  advanced,
  isExampleData = false,
  onChange,
  onToggleAdvanced,
  onReset,
}: Props) {
  const age = CURRENT_YEAR - values.birthYear;
  const salaryCheck = validateAnnualSalary(values.annualSalary);
  const salaryError = salaryCheck.ok ? undefined : salaryCheck.message;

  return (
    <section
      className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
      aria-labelledby="inputs-heading"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
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
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-muted"
            >
              Nullstill
            </button>
          ) : null}
          <button
            type="button"
            onClick={onToggleAdvanced}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary-soft"
            aria-pressed={advanced}
          >
            {advanced ? "Skjul avansert" : "Avansert"}
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
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

      {advanced ? (
        <div className="mt-6 space-y-4 border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-primary">Avansert</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="folketrygdBalance"
              label="Pensjonsbeholdning (folketrygd)"
              hint="Fra NAV / Din pensjon — lar stå tom for estimat"
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

            <Field
              id="tpPayoutMode"
              label="TP-utbetaling"
              hint="Gjelder alle TP-kontoer. Antall år justeres under Antagelser."
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

            <Field
              id="savingPayoutMode"
              label="Sparing-utbetaling"
              hint="Antall år justeres under Antagelser."
            >
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

          </div>
        </div>
      ) : null}
    </section>
  );
}
