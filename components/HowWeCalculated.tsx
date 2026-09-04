"use client";

import { useState } from "react";

export function HowWeCalculated({ points }: { points: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-800"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Slik har vi regnet
        <span className="text-slate-400" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <ul className="space-y-2 border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-600">
          {points.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
