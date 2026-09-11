"use client";

import { useEffect, useRef, useState } from "react";
import type { CalculatorInputs } from "@/lib/pension/types";
import {
  buildAbsoluteShareUrl,
  writeInputsToUrl,
} from "@/lib/pension/persistence";

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function CopyResultLink({ inputs }: { inputs: CalculatorInputs }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
    };
  }, []);

  async function handleCopy() {
    const shareUrl = buildAbsoluteShareUrl(inputs);
    writeInputsToUrl(inputs);
    const ok = await copyText(shareUrl);
    if (!ok) return;
    setCopied(true);
    if (timerRef.current != null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
        data-testid="copy-result-link"
        aria-describedby="copy-result-link-status"
      >
        <CopyIcon />
        Kopier lenke til mitt anslag
      </button>
      <span
        id="copy-result-link-status"
        role="status"
        aria-live="polite"
        className={
          copied
            ? "rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent"
            : "sr-only"
        }
      >
        {copied ? "Kopiert" : ""}
      </span>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 opacity-80"
      aria-hidden
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16V4a2 2 0 0 1 2-2h12" />
    </svg>
  );
}
