"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatNOK, formatNumber } from "@/lib/format";
import { track } from "@/lib/ga";
import {
  DEFAULT_NEED_RATIO,
  NEED_RATIOS,
  SPEND_TEMPLATES,
  suggestedPensionNeed,
  type NeedRatio,
} from "@/lib/pension/needEstimate";
import { Field } from "./Field";
import { CurrencyInput } from "./CurrencyInput";

type Props = {
  /** Sett ønsket pensjon i Spar for mål og kjør beregning. */
  onApplyTarget: (monthly: number) => void;
};

export function NeedEstimatePanel({ onApplyTarget }: Props) {
  const [spendMonthly, setSpendMonthly] = useState(0);
  const [ratio, setRatio] = useState<NeedRatio>(DEFAULT_NEED_RATIO);

  const suggested = useMemo(
    () => suggestedPensionNeed(spendMonthly, ratio),
    [spendMonthly, ratio],
  );

  function onSpendChange(v: number) {
    setSpendMonthly(v);
  }

  function onChip(monthly: number) {
    setSpendMonthly(monthly);
    track("need_estimate_use", { source: "chip" });
  }

  function onRatioChange(next: NeedRatio) {
    setRatio(next);
    if (spendMonthly > 0) {
      track("need_estimate_use", { source: "ratio" });
    }
  }

  function onApply() {
    if (!(suggested > 0)) return;
    onApplyTarget(suggested);
    track("need_estimate_use", { source: "apply" });
    // Scroll Spar for mål into view so the prefill is obvious
    window.setTimeout(() => {
      document
        .getElementById("spar-for-mal")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
  }

  return (
    <section
      id="hva-trenger-du"
      className="scroll-mt-4 overflow-x-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
      aria-labelledby="need-estimate-heading"
      data-testid="need-estimate-panel"
    >
      <div className="min-w-0">
        <h2
          id="need-estimate-heading"
          className="text-lg font-semibold text-primary"
        >
          Hva trenger du i pensjon?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Et grovt intervall basert på dagens forbruk — ikke et eksakt behov.
          Mange justerer andelen etter boliglån og livssituasjon. Les mer i{" "}
          <Link
            href="/guider/hvor-mye-bor-jeg-spare-til-pensjon"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
          >
            hvor mye bør jeg spare til pensjon?
          </Link>
          .
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <Field
          id="need-spend"
          label="Månedlig forbruk i dag (ca.)"
          hint="Valgfritt. Tomt felt lar Spar for mål fungere som før (lønnsbasert forslag)."
        >
          <CurrencyInput
            id="need-spend"
            value={spendMonthly}
            onChange={onSpendChange}
            allowEmpty
            emptyValue={0}
            placeholder="f.eks. 25 000"
            aria-label="Månedlig forbruk i dag, ca."
          />
        </Field>

        <div
          className="flex flex-wrap items-center gap-2"
          data-testid="need-spend-templates"
          role="group"
          aria-label="Eksempler på månedlig forbruk (ikke fasit)"
        >
          <span className="text-xs font-medium text-muted-foreground">
            Eksempler
          </span>
          {SPEND_TEMPLATES.map((t) => {
            const selected = spendMonthly === t.monthly;
            return (
              <button
                key={t.monthly}
                type="button"
                onClick={() => onChip(t.monthly)}
                aria-pressed={selected}
                aria-label={`Sett forbruk til ca. ${t.monthly.toLocaleString("nb-NO")} kr (${t.label})`}
                className={
                  selected
                    ? "rounded-full border border-accent/50 bg-accent-soft px-3 py-1.5 text-sm font-semibold text-primary shadow-sm"
                    : "rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-accent/40 hover:bg-accent-soft/70 hover:text-primary"
                }
              >
                {t.label}
                <span className="ml-1 tabular-nums text-muted-foreground">
                  {formatNumber(t.monthly)}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Eksemplene er utgangspunkt du kan overstyre — ikke fasit.
        </p>

        <div>
          <p
            id="need-ratio-label"
            className="mb-2 text-sm font-medium text-slate-800"
          >
            Andel av forbruk som pensjonsmål
          </p>
          <div
            className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-muted/40 p-1"
            role="group"
            aria-labelledby="need-ratio-label"
            data-testid="need-ratio-segment"
          >
            {NEED_RATIOS.map((r) => {
              const selected = ratio === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => onRatioChange(r)}
                  aria-pressed={selected}
                  className={
                    selected
                      ? "min-w-[4.5rem] rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm"
                      : "min-w-[4.5rem] rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-primary-soft hover:text-primary"
                  }
                >
                  {r}&nbsp;%
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Mange trenger mindre enn dagens forbruk (f.eks. lavere boliglån) —
            juster andelen.
          </p>
        </div>

        {suggested > 0 ? (
          <div
            className="flex flex-col gap-3 rounded-xl border border-accent/30 bg-accent-soft/70 p-4 sm:flex-row sm:items-center sm:justify-between"
            aria-live="polite"
            data-testid="need-estimate-result"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Foreslått pensjonsbehov (ca.)
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-primary">
                {formatNOK(suggested)}
                <span className="ml-1 text-sm font-medium text-muted-foreground">
                  /mnd
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Dagens kroner · {ratio}&nbsp;% av forbruk — intervall, ikke eksakt
                behov.
              </p>
            </div>
            <button
              type="button"
              onClick={onApply}
              data-testid="need-apply-to-goal"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Fyll Spar for mål
            </button>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
            Oppgi forbruk (eller velg et eksempel) for å se et foreslått
            pensjonsbehov. Spar for mål under fungerer uansett.
          </p>
        )}
      </div>
    </section>
  );
}
