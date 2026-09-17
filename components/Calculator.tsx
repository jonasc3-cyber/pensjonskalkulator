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
import { SaxoAnnonseCta } from "./SaxoAnnonseCta";
import { TrustNextSteps } from "./TrustNextSteps";
import type { CalculatorStep } from "./CalculatorStepper";
import { track } from "@/lib/ga";

const PERSIST_DEBOUNCE_MS = 250;

function focusElementById(id: string, opts?: { scroll?: boolean }) {
  const el = document.getElementById(id);
  if (!el) return false;
  if (opts?.scroll !== false) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (!(el instanceof HTMLElement)) return false;
  if (!el.hasAttribute("tabindex") && el.tabIndex < 0) {
    el.setAttribute("tabindex", "-1");
  }
  el.focus({ preventScroll: true });
  return document.activeElement === el || el.contains(document.activeElement);
}

/** Focus results region after step 3 mounts (retry until heading exists). */
function focusResultsPanel() {
  let attempts = 0;
  const run = () => {
    attempts += 1;
    const heading = document.getElementById("results-heading");
    const region = document.getElementById("results");
    if (heading || region) {
      region?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (heading instanceof HTMLElement) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
      return;
    }
    if (attempts < 12) {
      window.setTimeout(run, 40);
    }
  };
  window.setTimeout(run, 40);
}

function focusStepHeading(step: CalculatorStep) {
  const id = step === 2 ? "step-2-heading" : step === 1 ? "step-1-heading" : "results-heading";
  window.setTimeout(() => {
    focusElementById(id);
  }, 40);
}

export function Calculator() {
  const [values, setValues] = useState<CalculatorInputs>(() => defaultInputs());
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<CalculatorStep>(1);
  /** Vises til bruker endrer noe (eller har lagret/delt tilstand). */
  const [isExampleData, setIsExampleData] = useState(true);
  const skipNextPersist = useRef(false);
  const startedRef = useRef(false);
  /** After Se resultat / Hopp til resultat — focus #results-heading once step 3 paints. */
  const pendingFocusResults = useRef(false);
  /** After Neste / Endre — focus step heading once that step paints (not AFP). */
  const pendingFocusStep = useRef<1 | 2 | null>(null);
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
    // Returning / shared state → hopp til resultat; first-run → steg 1
    setStep(fromUrl || fromLs ? 3 : 1);
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

  const showFullResults = step === 3;

  useEffect(() => {
    if (step !== 3 || !pendingFocusResults.current) return;
    pendingFocusResults.current = false;
    focusResultsPanel();
  }, [step, showFullResults, result]);

  useEffect(() => {
    const pending = pendingFocusStep.current;
    if (!pending || step !== pending) return;
    pendingFocusStep.current = null;
    focusStepHeading(pending);
  }, [step]);

  function onChange<K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) {
    if (!startedRef.current) {
      startedRef.current = true;
      track("calculator_start");
    }
    setIsExampleData(false);
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onReset() {
    const defaults = defaultInputs();
    setValues(defaults);
    clearInputsLocalStorage();
    clearInputsFromUrl();
    setIsExampleData(true);
    setStep(1);
    skipNextPersist.current = true;
  }

  /** Profil-starter: bytt årslønn, behold «Eksempeldata» (ikke brukerens egne tall). */
  function onApplyProfileStarter(annualSalary: number) {
    setValues((prev) => ({ ...prev, annualSalary }));
    setIsExampleData(true);
    skipNextPersist.current = true;
  }

  function handleStepChange(next: CalculatorStep) {
    if (next === 3) {
      goToResults();
      return;
    }
    pendingFocusResults.current = false;
    if (next === 1 || next === 2) {
      pendingFocusStep.current = next;
    } else {
      pendingFocusStep.current = null;
    }
    if (step === next && (next === 1 || next === 2)) {
      pendingFocusStep.current = null;
      focusStepHeading(next);
      return;
    }
    setStep(next);
  }

  function goToResults() {
    if (!isValidAnnualSalary(values.annualSalary)) {
      setStep(1);
      window.setTimeout(() => {
        document.getElementById("annualSalary")?.focus();
      }, 50);
      return;
    }
    pendingFocusResults.current = true;
    if (step === 3) {
      // Already on results — effect may not re-run; focus immediately.
      pendingFocusResults.current = false;
      focusResultsPanel();
      return;
    }
    setStep(3);
  }

  function openPayoutSettings() {
    setAssumptionsOpen(true);
    // Vent til Avansert/Antagelser (details) er ekspandert før scroll
    window.setTimeout(() => {
      const target =
        document.getElementById("utbetaling") ??
        document.getElementById("antagelser");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function toggleAssumptions() {
    setAssumptionsOpen((v) => !v);
    if (!assumptionsOpen) {
      window.setTimeout(() => {
        document
          .getElementById("antagelser")
          ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    }
  }

  return (
    <div
      className="space-y-6 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] sm:pb-0"
      data-testid="calculator-root"
      data-calculator-step={step}
    >
      <InputsPanel
        values={values}
        step={step}
        assumptionsOpen={assumptionsOpen}
        isExampleData={isExampleData}
        onChange={onChange}
        onStepChange={handleStepChange}
        onGoToResults={goToResults}
        onToggleAssumptions={toggleAssumptions}
        onReset={onReset}
        onApplyProfileStarter={onApplyProfileStarter}
      />
      <AssumptionsPanel
        values={values}
        onChange={onChange}
        open={assumptionsOpen}
        onOpenChange={setAssumptionsOpen}
      />
      <CohortWarning birthYear={values.birthYear} alert={false} />
      {showFullResults ? (
        result ? (
          <>
            <ResultsPanel
              result={result}
              showNet={values.showNet}
              inputs={values}
              onOpenPayoutSettings={openPayoutSettings}
            />
            <TrustNextSteps />
            <SaxoAnnonseCta placement="after_results" />
            <GoalSeekPanel values={values} result={result} />
            <SaxoAnnonseCta placement="after_spar_for_mal" />
            <StickyMiniResult
              baseMonthly={result.scenarios.base.totalMonthly}
              resultsMounted
              onSeeResults={goToResults}
            />
          </>
        ) : (
          <SalaryInvalidResults onFixSalary={() => setStep(1)} />
        )
      ) : result ? (
        <StickyMiniResult
          baseMonthly={result.scenarios.base.totalMonthly}
          resultsMounted={false}
          onSeeResults={goToResults}
        />
      ) : (
        <StickyMiniResult
          invalid
          resultsMounted={false}
          onSeeResults={() => setStep(1)}
        />
      )}
    </div>
  );
}

function SalaryInvalidResults({ onFixSalary }: { onFixSalary: () => void }) {
  return (
    <>
      <section
        id="results"
        className="scroll-mt-4"
        aria-labelledby="results-heading"
        data-testid="salary-invalid-results"
      >
        <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4 shadow-sm sm:p-6">
          <h2 id="results-heading" tabIndex={-1} className="text-lg font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2">
            Estimert pensjon
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-red-800" role="alert">
            Oppgi en gyldig årslønn (større enn 0 kr) for å se estimatet. Uten
            lønn viser modellens garantipensjonsgulv et misvisende bilde.
          </p>
          <button
            type="button"
            onClick={onFixSalary}
            className="mt-4 inline-flex rounded-xl border border-red-300 bg-card px-4 py-2.5 text-sm font-semibold text-red-800 shadow-sm hover:bg-red-50"
          >
            Rett opp årslønn
          </button>
        </div>
      </section>
      <StickyMiniResult invalid resultsMounted onSeeResults={onFixSalary} />
    </>
  );
}
