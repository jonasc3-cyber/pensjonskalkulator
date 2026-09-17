"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatNOK, formatNumber } from "@/lib/format";
import { track } from "@/lib/ga";
import {
  DEFAULT_NEED_RATIO,
  NEED_RATIOS,
  SPEND_TEMPLATES,
  computeLoanRelease,
  computeMonthlyReleased,
  selectedPhaseSpend,
  suggestedPensionNeed,
  type NeedRatio,
  type SpendPhase,
} from "@/lib/pension/needEstimate";
import { Field, inputClass } from "./Field";
import { CurrencyInput } from "./CurrencyInput";

type Props = {
  /** Sett ønsket pensjon i Spar for mål og kjør beregning. */
  onApplyTarget: (monthly: number) => void;
};

function parseOptionalInt(raw: string): number {
  const cleaned = raw.replace(/[\s\u00a0\u202f]/g, "").replace(/,/g, ".");
  if (cleaned === "") return 0;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n);
}

function formatYearsApprox(years: number): string {
  if (!Number.isFinite(years)) return "–";
  const rounded = Math.round(years * 10) / 10;
  return Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toLocaleString("nb-NO", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
}

export function NeedEstimatePanel({ onApplyTarget }: Props) {
  const [spendMonthly, setSpendMonthly] = useState(0);
  const [ratio, setRatio] = useState<NeedRatio>(DEFAULT_NEED_RATIO);

  const [remainingDebt, setRemainingDebt] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [yearsRemaining, setYearsRemaining] = useState(0);
  const [monthsRemaining, setMonthsRemaining] = useState(0);
  const [manualAfterLoan, setManualAfterLoan] = useState(0);
  const [phase, setPhase] = useState<SpendPhase>("B");

  const loanInput = useMemo(
    () => ({
      remainingDebt,
      yearsRemaining,
      monthsRemaining,
      monthlyPayment,
    }),
    [remainingDebt, yearsRemaining, monthsRemaining, monthlyPayment],
  );

  const released = useMemo(
    () => computeMonthlyReleased(loanInput),
    [loanInput],
  );
  const loanRelease = useMemo(
    () => computeLoanRelease(loanInput),
    [loanInput],
  );

  const monthlyReleased = released?.monthlyReleased ?? 0;
  const hasTwoPhase =
    monthlyReleased > 0 || (manualAfterLoan > 0 && spendMonthly > 0);

  const phaseSpend = useMemo(
    () =>
      selectedPhaseSpend({
        faseA: spendMonthly,
        monthlyReleased,
        manualAfterLoan,
        phase: hasTwoPhase ? phase : "A",
      }),
    [spendMonthly, monthlyReleased, manualAfterLoan, phase, hasTwoPhase],
  );

  const faseB = useMemo(
    () =>
      selectedPhaseSpend({
        faseA: spendMonthly,
        monthlyReleased,
        manualAfterLoan,
        phase: "B",
      }),
    [spendMonthly, monthlyReleased, manualAfterLoan],
  );

  const suggested = useMemo(
    () => suggestedPensionNeed(phaseSpend, ratio),
    [phaseSpend, ratio],
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
    if (phaseSpend > 0) {
      track("need_estimate_use", { source: "ratio" });
    }
  }

  function onPhaseChange(next: SpendPhase) {
    setPhase(next);
    if (hasTwoPhase) {
      track("need_estimate_use", { source: "phase" });
    }
  }

  function onApply() {
    if (!(suggested > 0)) return;
    onApplyTarget(suggested);
    track("need_estimate_use", { source: "apply" });
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

        <div
          className="space-y-4 rounded-xl border border-border bg-muted/30 p-4"
          data-testid="need-loan-section"
        >
          <div>
            <h3 className="text-sm font-semibold text-primary">
              Lån som blir nedbetalt (valgfritt)
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Oppgi restgjeld <em>eller</em> månedsbeløp, pluss gjenværende tid.
              Tomt felt = uendret estimat som før.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="need-loan-debt"
              label="Restgjeld"
              hint="Brukes bare hvis månedsbeløp er tomt."
            >
              <CurrencyInput
                id="need-loan-debt"
                value={remainingDebt}
                onChange={setRemainingDebt}
                allowEmpty
                emptyValue={0}
                placeholder="f.eks. 1 200 000"
                aria-label="Restgjeld på lån, ca."
              />
            </Field>
            <Field
              id="need-loan-payment"
              label="Månedsbeløp på lån"
              hint="Overstyrer restgjeld for frigjort beløp."
            >
              <CurrencyInput
                id="need-loan-payment"
                value={monthlyPayment}
                onChange={setMonthlyPayment}
                allowEmpty
                emptyValue={0}
                placeholder="f.eks. 12 000"
                aria-label="Månedsbeløp på lån, ca."
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="need-loan-years" label="Gjenværende år">
              <input
                id="need-loan-years"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                className={`${inputClass} tabular-nums`}
                value={yearsRemaining > 0 ? yearsRemaining : ""}
                placeholder="f.eks. 10"
                aria-label="Gjenværende år på lån"
                onChange={(e) =>
                  setYearsRemaining(parseOptionalInt(e.target.value))
                }
              />
            </Field>
            <Field
              id="need-loan-months"
              label="Ekstra måneder (valgfritt)"
              hint="Utover hele år."
            >
              <input
                id="need-loan-months"
                type="number"
                inputMode="numeric"
                min={0}
                max={11}
                step={1}
                className={`${inputClass} tabular-nums`}
                value={monthsRemaining > 0 ? monthsRemaining : ""}
                placeholder="0–11"
                aria-label="Ekstra måneder på lån"
                onChange={(e) => {
                  const n = parseOptionalInt(e.target.value);
                  setMonthsRemaining(Math.min(11, n));
                }}
              />
            </Field>
          </div>

          {loanRelease ? (
            <div
              className="rounded-lg border border-accent/30 bg-accent-soft/60 px-3 py-3"
              aria-live="polite"
              data-testid="need-loan-release"
            >
              <p className="text-sm font-medium text-primary">
                Om ca. {formatYearsApprox(loanRelease.yearsApprox)} år frigjøres ~
                {formatNumber(loanRelease.monthlyReleased)} kr/mnd
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {loanRelease.simplifiedFromDebt
                  ? "Forenklet (restgjeld ÷ tid, uten rente) — ikke en amortiseringskalkulator."
                  : "Basert på oppgitt månedsbeløp — grovt anslag, ikke fasit."}
              </p>
            </div>
          ) : null}
        </div>

        {hasTwoPhase ? (
          <div
            className="space-y-4 rounded-xl border border-border bg-muted/30 p-4"
            data-testid="need-two-phase"
          >
            <div>
              <h3 className="text-sm font-semibold text-primary">
                To faser for forbruk
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Fase A er dagens forbruk. Fase B er etter at lånet er nedbetalt
                (A minus frigjort beløp, eller manuelt felt).
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div
                className="rounded-lg border border-border bg-card px-3 py-3"
                data-testid="need-fase-a"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Fase A (nå)
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-primary">
                  {spendMonthly > 0 ? formatNOK(spendMonthly) : "–"}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    /mnd
                  </span>
                </p>
              </div>
              <div
                className="rounded-lg border border-border bg-card px-3 py-3"
                data-testid="need-fase-b"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Fase B (etter lån)
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-primary">
                  {faseB > 0 || spendMonthly > 0 ? formatNOK(faseB) : "–"}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    /mnd
                  </span>
                </p>
              </div>
            </div>

            <Field
              id="need-after-loan"
              label="Forbruk etter lån (manuelt, valgfritt)"
              hint="Overstyrer automatisk Fase B = A − frigjort beløp."
            >
              <CurrencyInput
                id="need-after-loan"
                value={manualAfterLoan}
                onChange={setManualAfterLoan}
                allowEmpty
                emptyValue={0}
                placeholder="La stå tom for A − Y"
                aria-label="Manuelt forbruk etter lån"
              />
            </Field>

            <div>
              <p
                id="need-phase-label"
                className="mb-2 text-sm font-medium text-slate-800"
              >
                Bruk andel og Spar for mål på
              </p>
              <div
                className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-muted/40 p-1"
                role="group"
                aria-labelledby="need-phase-label"
                data-testid="need-phase-toggle"
              >
                {(
                  [
                    { id: "B" as const, label: "Fase B (etter lån)" },
                    { id: "A" as const, label: "Fase A (nå)" },
                  ] as const
                ).map((opt) => {
                  const selected = phase === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onPhaseChange(opt.id)}
                      aria-pressed={selected}
                      className={
                        selected
                          ? "rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm"
                          : "rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-primary-soft hover:text-primary"
                      }
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Standard er Fase B — mange trenger mindre når lånet er ferdig.
              </p>
            </div>
          </div>
        ) : null}

        <div>
          <p
            id="need-ratio-label"
            className="mb-2 text-sm font-medium text-slate-800"
          >
            Andel av forbruk som pensjonsmål
            {hasTwoPhase ? (
              <span className="ml-1 font-normal text-muted-foreground">
                (av Fase {phase})
              </span>
            ) : null}
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
                {hasTwoPhase ? ` · Fase ${phase}` : ""}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-primary">
                {formatNOK(suggested)}
                <span className="ml-1 text-sm font-medium text-muted-foreground">
                  /mnd
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Dagens kroner · {ratio}&nbsp;% av forbruk
                {hasTwoPhase ? ` (Fase ${phase})` : ""} — intervall, ikke eksakt
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
