"use client";

import { useMemo, useState } from "react";
import { calculatePension, defaultInputs } from "@/lib/pension/calculate";
import type { CalculatorInputs } from "@/lib/pension/types";
import { InputsPanel } from "./InputsPanel";
import { AssumptionsPanel } from "./AssumptionsPanel";
import { ResultsPanel } from "./ResultsPanel";
import { GoalSeekPanel } from "./GoalSeekPanel";

export function Calculator() {
  const [values, setValues] = useState<CalculatorInputs>(() => defaultInputs());
  const [advanced, setAdvanced] = useState(false);

  const result = useMemo(() => calculatePension(values), [values]);

  function onChange<K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <InputsPanel
        values={values}
        advanced={advanced}
        onChange={onChange}
        onToggleAdvanced={() => setAdvanced((v) => !v)}
      />
      <AssumptionsPanel values={values} onChange={onChange} />
      <ResultsPanel result={result} showNet={values.showNet} />
      <GoalSeekPanel values={values} result={result} />
    </div>
  );
}
