"use client";

import { Field, inputClass, selectClass } from "./Field";
import { CurrencyInput } from "./CurrencyInput";
import { SavingsAccounts } from "./SavingsAccounts";
import { TpAccounts } from "./TpAccounts";
import type { CalculatorInputs } from "@/lib/pension/types";
import { CURRENT_YEAR } from "@/lib/constants";

type Props = {
  values: CalculatorInputs;
  advanced: boolean;
  onChange: <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) => void;
  onToggleAdvanced: () => void;
};

export function InputsPanel({
  values,
  advanced,
  onChange,
  onToggleAdvanced,
}: Props) {
  const age = CURRENT_YEAR - values.birthYear;

  return (
    <section
      className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
      aria-labelledby="inputs-heading"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="inputs-heading" className="text-lg font-semibold text-primary">
            Dine opplysninger
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Alt beregnes lokalt i nettleseren. Ingenting sendes til server.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleAdvanced}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary-soft"
          aria-pressed={advanced}
        >
          {advanced ? "Skjul avansert" : "Avansert"}
        </button>
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

        <Field id="annualSalary" label="Årslønn brutto (kr)">
          <CurrencyInput
            id="annualSalary"
            value={values.annualSalary}
            min={0}
            step={10000}
            onChange={(v) => onChange("annualSalary", v)}
          />
        </Field>

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

        <Field
          id="wageGrowth"
          label="Forventet lønnsvekst"
          hint="Standard 3 %"
        >
          <div className="flex items-center gap-2">
            <input
              id="wageGrowth"
              type="number"
              min={0}
              max={10}
              step={0.1}
              className={inputClass}
              value={Number((values.wageGrowth * 100).toFixed(1))}
              onChange={(e) =>
                onChange("wageGrowth", Number(e.target.value) / 100)
              }
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
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
            <option value="privat">Privat AFP (forenkling)</option>
            <option value="offentlig">Offentlig AFP (forenkling)</option>
            <option value="ingen">Ingen AFP</option>
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

            <Field id="sivilstatus" label="Sivilstatus (garantipensjon)">
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
              <Field id="tpPayoutYears" label="TP utbetalingsår">
                <input
                  id="tpPayoutYears"
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
              <Field id="savingPayoutYears" label="Sparing utbetalingsår">
                <input
                  id="savingPayoutYears"
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
      ) : null}
    </section>
  );
}
