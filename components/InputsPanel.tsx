"use client";

import Link from "next/link";
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

const BIRTH_YEARS = Array.from(
  { length: CURRENT_YEAR - 18 - 1940 + 1 },
  (_, i) => 1940 + i,
).reverse();

const RETIREMENT_AGES = Array.from({ length: 75 - 62 + 1 }, (_, i) => 62 + i);

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

  function goNext() {
    const target = document.getElementById("flere-opplysninger");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    const first = target?.querySelector<HTMLElement>(
      "input, select, button, textarea",
    );
    first?.focus({ preventScroll: true });
  }

  return (
    <section
      id="skjema"
      className="scroll-mt-20 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
      aria-labelledby="inputs-heading"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="inputs-heading"
              className="text-xl font-bold text-primary sm:text-2xl"
            >
              Pensjonskalkulator
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
          <p className="mt-1.5 text-sm text-muted-foreground">
            Fyll inn informasjonen under så beregner vi et estimat på din
            fremtidige pensjon.
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

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div className="min-w-0 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-primary">1. Om deg</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-5">
              <Field
                id="birthYear"
                label="Fødselsår"
                hint={`Alder i ${CURRENT_YEAR}: ${age} år`}
              >
                <select
                  id="birthYear"
                  className={selectClass}
                  value={values.birthYear}
                  onChange={(e) =>
                    onChange("birthYear", Number(e.target.value))
                  }
                >
                  {BIRTH_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="sivilstatus"
                label="Sivilstand"
                hint="Påvirker garantipensjonsgulvet."
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

              <Field
                id="retirementAge"
                label="Planlagt pensjonsalder"
                hint="Fra 62 til 75 år"
              >
                <select
                  id="retirementAge"
                  className={selectClass}
                  value={values.retirementAge}
                  onChange={(e) =>
                    onChange("retirementAge", Number(e.target.value))
                  }
                >
                  {RETIREMENT_AGES.map((a) => (
                    <option key={a} value={a}>
                      {a} år
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                id="annualSalary"
                label="Årlig lønn (før skatt)"
                hint={`Mellom ${ANNUAL_SALARY_MIN.toLocaleString("nb-NO")} og ${ANNUAL_SALARY_MAX.toLocaleString("nb-NO")} kr`}
                error={salaryError}
              >
                <div className="relative">
                  <CurrencyInput
                    id="annualSalary"
                    value={values.annualSalary}
                    min={0}
                    max={ANNUAL_SALARY_MAX}
                    step={10000}
                    className={`${salaryError ? inputErrorClass : inputClass} pr-10 tabular-nums`}
                    aria-invalid={Boolean(salaryError)}
                    aria-describedby={
                      salaryError ? "annualSalary-error" : undefined
                    }
                    onChange={(v) => onChange("annualSalary", v)}
                  />
                  <span
                    className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground"
                    aria-hidden
                  >
                    kr
                  </span>
                </div>
              </Field>

              <div className="sm:col-span-2">
                <CohortWarning birthYear={values.birthYear} />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={goNext}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-mid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
              >
                Neste
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>

          <div
            id="flere-opplysninger"
            className="scroll-mt-24 space-y-4 border-t border-border pt-6"
          >
            <h3 className="text-base font-semibold text-primary">
              2. Pensjon og sparing
            </h3>
            <p className="text-sm text-muted-foreground">
              AFP, tjenestepensjon og egen sparing — valgfritt, men gir et mer
              treffsikkert estimat.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <Field
                id="afpType"
                label="AFP"
                hint="Forenklet anslag — ikke offisielle regler"
              >
                <select
                  id="afpType"
                  className={selectClass}
                  value={values.afpType}
                  onChange={(e) =>
                    onChange(
                      "afpType",
                      e.target.value as CalculatorInputs["afpType"],
                    )
                  }
                >
                  <option value="ingen">Ingen AFP</option>
                  <option value="privat">Privat AFP (forenkling)</option>
                  <option value="offentlig">Offentlig AFP (forenkling)</option>
                </select>
              </Field>

              <Field id="showNet" label="Visning">
                <label className="flex min-h-11 items-center gap-2 text-sm text-slate-700">
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
          </div>
        </div>

        <aside className="rounded-xl border border-primary/15 bg-primary-soft/80 p-5 lg:sticky lg:top-20">
          <div className="flex items-start gap-2">
            <span
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
              aria-hidden
            >
              i
            </span>
            <h3 className="text-sm font-semibold text-primary">
              Om beregningen
            </h3>
          </div>
          <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-600">
            <p>
              Estimatet følger dagens regler for folketrygd, med forenklede
              forutsetninger for tjenestepensjon, AFP og sparing.
            </p>
            <p>
              Vi tar høyde for lønnsvekst og viser et intervall (lav / basis /
              høy) — ikke ett fasitsvar.
            </p>
            <p>
              Alt skjer lokalt i nettleseren. Ingen data sendes til server.
            </p>
          </div>
          <Link
            href="/om"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-mid"
          >
            Les mer om forutsetningene
            <span aria-hidden>→</span>
          </Link>
        </aside>
      </div>
    </section>
  );
}
