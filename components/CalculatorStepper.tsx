"use client";

export type CalculatorStep = 1 | 2 | 3;

const STEPS: { id: CalculatorStep; label: string; short: string }[] = [
  { id: 1, label: "Om deg", short: "Om deg" },
  { id: 2, label: "Pensjon og sparing", short: "Pensjon" },
  { id: 3, label: "Resultat", short: "Resultat" },
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
      <ol className="flex w-full items-stretch gap-0 sm:gap-1">
        {STEPS.map((s, index) => {
          const done = s.id < step;
          const active = s.id === step;
          const reachable =
            !done &&
            !active &&
            ((s.id === 2 && step >= 1) || (s.id === 3 && canReachResults));
          const canClick = done || active || reachable;

          return (
            <li
              key={s.id}
              className="flex min-w-0 flex-1 items-center"
              data-step={s.id}
              data-step-state={active ? "active" : done ? "done" : reachable ? "reachable" : "locked"}
            >
              {index > 0 ? (
                <span
                  className={
                    done || active
                      ? "mx-0.5 hidden h-px w-2 shrink-0 bg-accent sm:mx-1 sm:block sm:w-3 md:w-5"
                      : reachable
                        ? "mx-0.5 hidden h-px w-2 shrink-0 bg-primary/35 sm:mx-1 sm:block sm:w-3 md:w-5"
                        : "mx-0.5 hidden h-px w-2 shrink-0 bg-border sm:mx-1 sm:block sm:w-3 md:w-5"
                  }
                  aria-hidden
                />
              ) : null}
              <button
                type="button"
                disabled={!canClick}
                aria-current={active ? "step" : undefined}
                aria-label={`Steg ${s.id}: ${s.label}${active ? " (nåværende)" : done ? " (fullført)" : ""}`}
                onClick={() => {
                  if (!canClick || active) return;
                  onStepChange(s.id);
                }}
                className={
                  active
                    ? "flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-primary px-2 py-1.5 text-left text-primary-foreground shadow-sm sm:gap-2 sm:px-3"
                    : done
                      ? "flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft px-2 py-1.5 text-left text-accent transition-colors hover:border-accent/60 sm:gap-2 sm:px-3"
                      : reachable
                        ? "flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-primary/35 bg-card px-2 py-1.5 text-left text-primary shadow-sm transition-colors hover:border-primary/55 hover:bg-primary-soft sm:gap-2 sm:px-3"
                        : "flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1.5 text-left text-slate-400 disabled:cursor-not-allowed sm:gap-2 sm:px-3"
                }
              >
                <span
                  className={
                    active
                      ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold"
                      : done
                        ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white"
                        : reachable
                          ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/50 text-xs font-semibold text-primary"
                          : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold"
                  }
                  aria-hidden
                >
                  {done ? "✓" : s.id}
                </span>
                <span
                  className={
                    active
                      ? "min-w-0 truncate text-[11px] font-semibold leading-tight sm:text-sm"
                      : done
                        ? "min-w-0 truncate text-[11px] font-semibold leading-tight sm:text-sm"
                        : reachable
                          ? "min-w-0 truncate text-[11px] font-semibold leading-tight sm:text-sm"
                          : "min-w-0 truncate text-[11px] font-medium leading-tight sm:text-sm"
                  }
                >
                  <span className="sm:hidden">{s.short}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs text-muted-foreground sm:hidden" aria-live="polite">
        Steg {step} av 3: {STEPS[step - 1]?.label}
      </p>
    </nav>
  );
}
