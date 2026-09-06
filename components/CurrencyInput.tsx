"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/format";
import { inputClass } from "./Field";

type Props = {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  allowEmpty?: boolean;
  emptyValue?: number;
  className?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

/** Parse nb-NO / free-form currency text into a non-negative number. */
export function parseCurrencyInput(raw: string): number | null {
  const cleaned = raw
    .replace(/[\s\u00a0\u202f]/g, "")
    .replace(/kr\.?/gi, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");
  if (cleaned === "" || cleaned === "-") return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.round(n));
}

function clamp(value: number, min?: number, max?: number): number {
  let next = value;
  if (min !== undefined) next = Math.max(min, next);
  if (max !== undefined) next = Math.min(max, next);
  return next;
}

/**
 * NOK input with nb-NO thousand separators when blurred.
 * Stores a number; does not change calculation logic.
 */
export function CurrencyInput({
  id,
  value,
  onChange,
  min = 0,
  max,
  step,
  placeholder,
  allowEmpty = false,
  emptyValue = 0,
  className,
  "aria-label": ariaLabel,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(() =>
    allowEmpty && value === emptyValue ? "" : formatNumber(value),
  );

  useEffect(() => {
    if (focused) return;
    setText(allowEmpty && value === emptyValue ? "" : formatNumber(value));
  }, [value, focused, allowEmpty, emptyValue]);

  function commit(raw: string) {
    const parsed = parseCurrencyInput(raw);
    if (parsed === null) {
      onChange(emptyValue);
      setText(allowEmpty ? "" : formatNumber(emptyValue));
      return;
    }
    const next = clamp(parsed, min, max);
    onChange(next);
    setText(allowEmpty && next === emptyValue ? "" : formatNumber(next));
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      className={className ?? `${inputClass} tabular-nums`}
      value={
        focused
          ? text
          : allowEmpty && value === emptyValue
            ? ""
            : formatNumber(value)
      }
      placeholder={placeholder}
      aria-label={ariaLabel}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      data-step={step}
      onFocus={(e) => {
        setFocused(true);
        const raw =
          allowEmpty && value === emptyValue ? "" : String(Math.round(value));
        setText(raw);
        requestAnimationFrame(() => e.target.select());
      }}
      onBlur={(e) => {
        setFocused(false);
        commit(e.target.value);
      }}
      onChange={(e) => {
        const raw = e.target.value;
        setText(raw);
        const parsed = parseCurrencyInput(raw);
        if (parsed !== null) {
          onChange(clamp(parsed, min, max));
        } else if (raw.trim() === "") {
          onChange(emptyValue);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
  );
}
