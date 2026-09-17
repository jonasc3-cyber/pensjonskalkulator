"use client";

export type CalculatorStep = 1 | 2 | 3;

const STEPS: { id: CalculatorStep; label: string; short: string }[] = [
  { id: 1, label: "Om deg", short: "1" },
  { id: 2, label: "Pensjon og sparing", short: "2" },
  { id: 3, label: "Resultat", short: "3" },
];

type Props = {
  step: CalculatorStep;
  /** Minimum data for step 1 is present (gyldig lønn). */
  canReachResults: boolean;
  onStepChange: (step: CalculatorStep) => void;
};

export function CalculatorStepper({
  step,
  canReachResults,
  onStepChange,
}: Props) {
  return (
    <nav
      aria-label="Kalkulatorsteg"
      className="mb-6"
      data-testid="calculator-stepper"
    >
      <ol className="flex items-center gap-1 sm:gap-2">
        {STEPS.map((s, index) => {
          const done = s.id < step;
          const active = s.id === step;
          const canClick =
            done ||
            active ||
            (s.id === 2 && step >= 1) ||
            (s.id === 3 && canReachResults);

          return (
            <li key={s.id} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
              {index > 0 ? (
                <span
                  className={
                    done || active
                      ? "hidden h-px flex-1 bg-accent sm:block"
                      : "hidden h-px flex-1 bg-border sm:block"
                  }
                  aria-hidden
                />
              ) : null}
              <button
                type="button"
                disabled={!canClick}
                aria-current={active ? "step" : undefined}
                onClick={() => {
                  if (!canClick || active) return;
                  onStepChange(s.id);
                }}
                className={
                  active
                    ? "flex min-w-0 items-center gap-2 rounded-full bg-primary px-2.5 py-1.5 text-left text-primary-foreground shadow-sm sm:px-3"
                    : done
                      ? "flex min-w-0 items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-2.5 py-1.5 text-left text-accent transition-colors hover:border-accent/60 sm:px-3"
                      : "flex min-w-0 items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1.5 text-left text-slate-400 disabled:cursor-not-allowed sm:px-3"
                }
              >
                <span
                  className={
                    active
                      ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold"
                      : done
                        ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white"
                        : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold"
                  }
                  aria-hidden
                >
                  {done ? "✓" : s.short}
                </span>
                <span
                  className={
                    active
                      ? "truncate text-xs font-semibold sm:text-sm"
                      : done
                        ? "truncate text-xs font-semibold sm:text-sm"
                        : "truncate text-xs font-medium sm:text-sm"
                  }
                >
                  <span className="sm:hidden">{active ? s.label : s.short}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs text-muted-foreground sm:hidden" aria-live="polite">
        Steg {step}: {STEPS[step - 1]?.label}
      </p>
    </nav>
  );
}
