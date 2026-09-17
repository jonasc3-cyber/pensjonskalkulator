"use client";

import type { MouseEvent } from "react";

type StartCalculatorCtaProps = {
  className?: string;
};

/**
 * Primary hero CTA — scrolls to #kalkulator and focuses step 1 heading.
 */
export function StartCalculatorCta({ className }: StartCalculatorCtaProps) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    const section = document.getElementById("kalkulator");
    const step1 = document.getElementById("step-1-heading");
    if (!section && !step1) return;
    e.preventDefault();
    (step1 ?? section)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (step1 instanceof HTMLElement) {
      step1.focus({ preventScroll: true });
    }
  }

  return (
    <a href="#kalkulator" onClick={onClick} className={className}>
      Start kalkulator
      <span aria-hidden className="ml-1.5">
        →
      </span>
    </a>
  );
}
