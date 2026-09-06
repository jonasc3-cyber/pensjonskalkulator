import type { ReactNode } from "react";

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="text-xs font-medium text-red-700"
          role="alert"
          data-testid={`${id}-error`}
        >
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "min-h-11 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20";

export const inputErrorClass =
  "min-h-11 w-full rounded-lg border border-red-400 bg-card px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-shadow focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

export const selectClass = inputClass;
