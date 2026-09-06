"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculatePension, defaultInputs } from "@/lib/pension/calculate";
import type { CalculatorInputs } from "@/lib/pension/types";
import {
  clearInputsFromUrl,
  clearInputsLocalStorage,
  loadInputsFromLocalStorage,
  readInputsFromUrl,
  saveInputsToLocalStorage,
  writeInputsToUrl,
} from "@/lib/pension/persistence";
import { isValidAnnualSalary } from "@/lib/salaryValidation";
import { InputsPanel } from "./InputsPanel";
import { AssumptionsPanel } from "./AssumptionsPanel";
import { ResultsPanel } from "./ResultsPanel";
import { GoalSeekPanel } from "./GoalSeekPanel";
import { CohortWarning } from "./CohortWarning";
import { StickyMiniResult } from "./StickyMiniResult";
import { SectionDivider } from "./SectionDivider";

const PERSIST_DEBOUNCE_MS = 250;

export function Calculator() {
  const [values, setValues] = useState<CalculatorInputs>(() => defaultInputs());
  const [advanced, setAdvanced] = useState(false);
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  /** Vises til bruker endrer noe (eller har lagret/delt tilstand). */
  const [isExampleData, setIsExampleData] = useState(true);
  const skipNextPersist = useRef(false);
  const valuesRef = useRef(values);
  const isExampleDataRef = useRef(isExampleData);
  valuesRef.current = values;
  isExampleDataRef.current = isExampleData;

  // Klient-only hydrate: URL > localStorage > defaults (unngår SSR-mismatch)
  useEffect(() => {
    const fromUrl = readInputsFromUrl();
    const fromLs = fromUrl ? null : loadInputsFromLocalStorage();
    const initial = fromUrl ?? fromLs ?? defaultInputs();
    setValues(initial);
    // Eksempeldata: skjul bare når URL eller localStorage ga tilstand
    const example = !fromUrl && !fromLs;
    setIsExampleData(example);
    // Speil URL → localStorage; ikke lagre rene eksempeldefaults
    if (!example) {
      saveInputsToLocalStorage(initial);
    }
    skipNextPersist.current = true;
    setHydrated(true);
  }, []);

  // Debounced localStorage + URL (kun etter hydrate / brukerendring)
  useEffect(() => {
    if (!hydrated) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    if (isExampleData) return;
    const timer = window.setTimeout(() => {
      saveInputsToLocalStorage(values);
      writeInputsToUrl(values);
    }, PERSIST_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [values, hydrated, isExampleData]);

  // Flush immediately on leave so hard reload mid-debounce cannot drop edits
  useEffect(() => {
    if (!hydrated) return;
    const flush = () => {
      if (isExampleDataRef.current) return;
      saveInputsToLocalStorage(valuesRef.current);
      writeInputsToUrl(valuesRef.current);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [hydrated]);

  const salaryOk = isValidAnnualSalary(values.annualSalary);
  const result = useMemo(
    () => (salaryOk ? calculatePension(values) : null),
    [values, salaryOk],
  );

  function onChange<K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) {
    setIsExampleData(false);
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onReset() {
    const defaults = defaultInputs();
    setValues(defaults);
    clearInputsLocalStorage();
    clearInputsFromUrl();
    setIsExampleData(true);
    skipNextPersist.current = true;
  }

  function openPayoutSettings() {
    setAdvanced(true);
    setAssumptionsOpen(true);
    // Vent til Antagelser (details) og Avansert er ekspandert før scroll
    window.setTimeout(() => {
      const target =
        document.getElementById("utbetaling") ??
        document.getElementById("antagelser");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  return (
    <div
      className="space-y-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:pb-0"
      data-testid="calculator-root"
    >
      <InputsPanel
        values={values}
        advanced={advanced}
        isExampleData={isExampleData}
        onChange={onChange}
        onToggleAdvanced={() => setAdvanced((v) => !v)}
        onReset={onReset}
      />
      <AssumptionsPanel
        values={values}
        onChange={onChange}
        open={assumptionsOpen}
        onOpenChange={setAssumptionsOpen}
      />
      <CohortWarning birthYear={values.birthYear} alert={false} />
      <SectionDivider src="/divider-home.webp" />
      {result ? (
        <>
          <ResultsPanel
            result={result}
            showNet={values.showNet}
            inputs={values}
            onOpenPayoutSettings={openPayoutSettings}
          />
          <GoalSeekPanel values={values} result={result} />
          <StickyMiniResult baseMonthly={result.scenarios.base.totalMonthly} />
        </>
      ) : (
        <SalaryInvalidResults />
      )}
    </div>
  );
}

function SalaryInvalidResults() {
  return (
    <>
      <section
        id="results"
        className="scroll-mt-4"
        aria-labelledby="results-heading"
        data-testid="salary-invalid-results"
      >
        <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4 shadow-sm sm:p-6">
          <h2 id="results-heading" className="text-lg font-semibold text-primary">
            Estimert pensjon
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-red-800" role="alert">
            Oppgi en gyldig årslønn (større enn 0 kr) for å se estimatet. Uten
            lønn viser modellens garantipensjonsgulv et misvisende bilde.
          </p>
        </div>
      </section>
      <StickyMiniResult invalid />
    </>
  );
}
