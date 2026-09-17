"use client";

import Link from "next/link";
import { Field, inputClass, inputErrorClass, selectClass } from "./Field";
import { CurrencyInput } from "./CurrencyInput";
import { SavingsAccounts } from "./SavingsAccounts";
import { TpAccounts } from "./TpAccounts";
import type { CalculatorInputs } from "@/lib/pension/types";
import { CURRENT_YEAR, PROFILE_STARTERS } from "@/lib/constants";
import {
  ANNUAL_SALARY_MAX,
  ANNUAL_SALARY_MIN,
  validateAnnualSalary,
} from "@/lib/salaryValidation";
import { CohortWarning } from "./CohortWarning";
import {
  CalculatorStepper,
  type CalculatorStep,
} from "./CalculatorStepper";
import { track } from "@/lib/ga";
import { formatNOK } from "@/lib/format";

type Props = {
  values: CalculatorInputs;
  step: CalculatorStep;
  /** True when the consolidated Avansert/Antagelser panel is open. */
  assumptionsOpen: boolean;
  /** True while defaults are shown and brukeren ikke har endret noe. */
  isExampleData?: boolean;
  onChange: <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) => void;
  onStepChange: (step: CalculatorStep) => void;
  onGoToResults: () => void;
  onToggleAssumptions: () => void;
  onReset?: () => void;
  /** Sett årslønn via profil-starter uten å fjerne «Eksempeldata». */
  onApplyProfileStarter?: (annualSalary: number) => void;
};

const BIRTH_YEARS = Array.from(
  { length: CURRENT_YEAR - 18 - 1940 + 1 },
  (_, i) => 1940 + i,
).reverse();

const RETIREMENT_AGES = Array.from({ length: 75 - 62 + 1 }, (_, i) => 62 + i);

const AFP_LABELS: Record<CalculatorInputs["afpType"], string> = {
  ingen: "Ingen AFP",
  privat: "Privat AFP",
  offentlig: "Offentlig AFP",
};

export function InputsPanel({
  values,
  step,
  assumptionsOpen,
  isExampleData = false,
  onChange,
  onStepChange,
  onGoToResults,
  onToggleAssumptions,
  onReset,
  onApplyProfileStarter,
}: Props) {
  const age = CURRENT_YEAR - values.birthYear;
  const salaryCheck = validateAnnualSalary(values.annualSalary);
  const salaryError = salaryCheck.ok ? undefined : salaryCheck.message;
  const canReachResults = salaryCheck.ok;

  return (
    <section
      id="skjema"
      className="scroll-mt-20 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"
      aria-labelledby="inputs-heading"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
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
          <p className="mt-1 text-sm text-muted-foreground">
            {isExampleData
              ? "Tallene under er eksempeldata — bytt dem til dine egne for et personlig estimat."
              : "Fyll inn informasjonen under så beregner vi et estimat på din fremtidige pensjon."}
          </p>
          {isExampleData && onApplyProfileStarter && step === 1 ? (
            <div
              className="mt-3 flex flex-wrap items-center gap-2"
              data-testid="profile-starters"
              role="group"
              aria-label="Prøv eksempelprofiler for årslønn"
            >
              <span className="text-xs font-medium text-muted-foreground">
                Prøv
              </span>
              {PROFILE_STARTERS.map((starter) => {
                const selected = values.annualSalary === starter.annualSalary;
                return (
                  <button
                    key={starter.annualSalary}
                    type="button"
                    onClick={() => {
                      track("scenario_change", { profile: starter.label });
                      onApplyProfileStarter(starter.annualSalary);
                    }}
                    aria-pressed={selected}
                    aria-label={`Sett årslønn til ${starter.annualSalary.toLocaleString("nb-NO")} kr`}
                    className={
                      selected
                        ? "rounded-full border border-primary/40 bg-primary-soft px-3 py-1.5 text-sm font-semibold text-primary shadow-sm"
                        : "rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary-soft/70 hover:text-primary"
                    }
                  >
                    {starter.label}
                  </button>
                );
              })}
            </div>
          ) : null}
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

      <CalculatorStepper
        step={step}
        canReachResults={canReachResults}
        onStepChange={(next) => {
          if (next === 3) {
            onGoToResults();
            return;
          }
          onStepChange(next);
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-8">
        {step === 1 ? (
          <div data-testid="calculator-step-1">
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
                hint={
                  <>
                    Fra 62 til 75 år. Les mer:{" "}
                    <Link
                      href="/guider/nar-ta-ut-pensjon"
                      className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
                    >
                      når ta ut pensjon?
                    </Link>
                  </>
                }
              >
                <select
                  id="retirementAge"
                  className={selectClass}
                  value={values.retirementAge}
                  onChange={(e) => {
                    const age = Number(e.target.value);
                    track("withdrawal_age_change", { age });
                    onChange("retirementAge", age);
                  }}
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
                    placeholder="f.eks. 650 000"
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

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onStepChange(2)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-mid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
              >
                Neste: Pensjon og sparing
                <span aria-hidden>→</span>
              </button>
              {canReachResults ? (
                <button
                  type="button"
                  onClick={onGoToResults}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
                  data-testid="hopp-til-resultat"
                >
                  Hopp til resultat
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div
            id="flere-opplysninger"
            className="scroll-mt-24 space-y-4"
            data-testid="calculator-step-2"
          >
            <h3 className="text-base font-semibold text-primary">
              2. Pensjon og sparing
            </h3>
            <p className="text-sm text-muted-foreground">
              AFP, tjenestepensjon og egen sparing — valgfritt, men gir et mer
              treffsikkert estimat. Tomme felt bruker dagens standarder (bl.a.
              ingen AFP).
            </p>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <Field
                id="afpType"
                label="AFP"
                hint={
                  <>
                    Forenklet anslag — ikke offisielle regler.{" "}
                    <Link
                      href="/guider/afp-privat"
                      className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
                    >
                      AFP privat forklart
                    </Link>
                  </>
                }
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

              <TpAccounts
                accounts={values.tpAccounts}
                onChange={(tpAccounts) => onChange("tpAccounts", tpAccounts)}
              />

              <SavingsAccounts
                accounts={values.savings}
                onChange={(savings) => onChange("savings", savings)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
              <button
                type="button"
                onClick={onGoToResults}
                disabled={!canReachResults}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-mid focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                data-testid="se-resultat"
              >
                Se resultat
                <span aria-hidden>→</span>
              </button>
              <button
                type="button"
                onClick={() => onStepChange(1)}
                className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-primary hover:underline"
              >
                Tilbake
              </button>
              {canReachResults ? (
                <button
                  type="button"
                  onClick={onGoToResults}
                  className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:underline"
                >
                  Hopp over
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4" data-testid="calculator-step-3-summary">
            <h3 className="text-base font-semibold text-primary">
              3. Resultat
            </h3>
            <p className="text-sm text-muted-foreground">
              Estimatet under oppdateres når du endrer tallene. Gå tilbake for å
              justere, eller åpne avanserte antagelser.
            </p>
            <dl className="grid gap-2 rounded-xl border border-border bg-muted/40 p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Fødselsår / uttak
                </dt>
                <dd className="mt-0.5 font-medium text-slate-800">
                  {values.birthYear} · {values.retirementAge} år
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Årslønn
                </dt>
                <dd className="mt-0.5 font-medium tabular-nums text-slate-800">
                  {formatNOK(values.annualSalary)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  AFP
                </dt>
                <dd className="mt-0.5 font-medium text-slate-800">
                  {AFP_LABELS[values.afpType]}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  TP / sparing
                </dt>
                <dd className="mt-0.5 font-medium text-slate-800">
                  {values.tpAccounts.length} TP · {values.savings.length} sparing
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onStepChange(1)}
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-primary-soft"
              >
                Endre om deg
              </button>
              <button
                type="button"
                onClick={() => onStepChange(2)}
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-primary-soft"
              >
                Endre pensjon og sparing
              </button>
              <button
                type="button"
                onClick={onToggleAssumptions}
                className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-primary hover:underline"
                aria-controls="antagelser"
              >
                Tilpass antagelser
              </button>
            </div>
          </div>
        ) : null}

        <aside className="rounded-xl border border-primary/15 bg-primary-soft/80 p-5 lg:sticky lg:top-20 lg:row-span-2">
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
              Pensjonstallene regnes lokalt i nettleseren og sendes ikke til oss.
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
