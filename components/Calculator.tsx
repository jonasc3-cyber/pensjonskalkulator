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
import { InputsPanel } from "./InputsPanel";
import { AssumptionsPanel } from "./AssumptionsPanel";
import { ResultsPanel } from "./ResultsPanel";
import { GoalSeekPanel } from "./GoalSeekPanel";
import { CohortWarning } from "./CohortWarning";
import { StickyMiniResult } from "./StickyMiniResult";

const PERSIST_DEBOUNCE_MS = 400;

export function Calculator() {
  const [values, setValues] = useState<CalculatorInputs>(() => defaultInputs());
  const [advanced, setAdvanced] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  /** Vises til bruker endrer noe (eller har lagret/delt tilstand). */
  const [isExampleData, setIsExampleData] = useState(true);
  const skipNextPersist = useRef(false);

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
    const timer = window.setTimeout(() => {
      saveInputsToLocalStorage(values);
      writeInputsToUrl(values);
    }, PERSIST_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [values, hydrated]);

  const result = useMemo(() => calculatePension(values), [values]);

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

  return (
    <div className="space-y-6 pb-16 sm:pb-0">
      <InputsPanel
        values={values}
        advanced={advanced}
        isExampleData={isExampleData}
        onChange={onChange}
        onToggleAdvanced={() => setAdvanced((v) => !v)}
        onReset={onReset}
      />
      <AssumptionsPanel values={values} onChange={onChange} />
      <CohortWarning birthYear={values.birthYear} alert={false} />
      <ResultsPanel result={result} showNet={values.showNet} />
      <GoalSeekPanel values={values} result={result} />
      <StickyMiniResult baseMonthly={result.scenarios.base.totalMonthly} />
    </div>
  );
}
