"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/format";
import { inputClass } from "./Field";

type Props = {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  placeholder?: string;
  allowEmpty?: boolean;
  emptyValue?: number;
  className?: string;
  "aria-label"?: string;
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

/**
 * NOK input with nb-NO thousand separators when blurred.
 * Stores a number; does not change calculation logic.
 */
export function CurrencyInput({
  id,
  value,
  onChange,
  min = 0,
  step,
  placeholder,
  allowEmpty = false,
  emptyValue = 0,
  className,
  "aria-label": ariaLabel,
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
    const next = min !== undefined ? Math.max(min, parsed) : parsed;
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
          onChange(min !== undefined ? Math.max(min, parsed) : parsed);
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
