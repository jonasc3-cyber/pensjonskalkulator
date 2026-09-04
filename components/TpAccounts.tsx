"use client";

import { Field, inputClass, selectClass } from "./Field";
import { CurrencyInput } from "./CurrencyInput";
import {
  createTpAccount,
  defaultReturnForTpKind,
  ensureSingleActiveContribution,
  TP_KIND_LABELS,
  TP_PROVIDERS,
} from "@/lib/pension/tp";
import type { TpAccount, TpKind } from "@/lib/pension/types";

const KINDS: TpKind[] = ["innskudd", "ytelse", "hybrid", "offentlig", "annet"];

const KNOWN_PROVIDERS = new Set<string>(TP_PROVIDERS.filter((p) => p !== "Annet"));

function providerSelectValue(provider: string | undefined): string {
  if (!provider) return "";
  if (KNOWN_PROVIDERS.has(provider)) return provider;
  return "Annet";
}

function isCustomProvider(provider: string | undefined): boolean {
  if (!provider) return false;
  return !KNOWN_PROVIDERS.has(provider);
}

function showsYearlyEstimate(kind: TpKind): boolean {
  return kind === "ytelse" || kind === "offentlig";
}

type Props = {
  accounts: TpAccount[];
  onChange: (accounts: TpAccount[]) => void;
};

export function TpAccounts({ accounts, onChange }: Props) {
  function updateAccount(id: string, patch: Partial<TpAccount>) {
    onChange(
      accounts.map((a) => {
        if (a.id !== id) return a;
        const next = { ...a, ...patch };
        if (patch.kind && patch.kind !== a.kind) {
          const oldDefault = defaultReturnForTpKind(a.kind);
          if (
            Math.abs(a.expectedReturn - oldDefault) < 0.0005 &&
            patch.expectedReturn === undefined
          ) {
            next.expectedReturn = defaultReturnForTpKind(patch.kind);
          }
        }
        return next;
      }),
    );
  }

  function setActive(id: string) {
    onChange(ensureSingleActiveContribution(accounts, id));
  }

  function removeAccount(id: string) {
    const remaining = accounts.filter((a) => a.id !== id);
    onChange(ensureSingleActiveContribution(remaining));
  }

  function addAccount() {
    const next = createTpAccount("innskudd", {
      activeContribution: accounts.length === 0,
    });
    onChange(
      ensureSingleActiveContribution(
        [...accounts, next],
        accounts.length === 0 ? next.id : undefined,
      ),
    );
  }

  return (
    <div className="space-y-3 sm:col-span-2">
      <div>
        <h3 className="text-sm font-semibold text-primary">Tjenestepensjon</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Legg til én eller flere ordninger (innskudd, ytelse, hybrid, offentlig).
          Kun én kan være «aktiv ordning» med pågående innskudd av lønn — øvrige
          er frosne saldoer som fortsatt får avkastning.
        </p>
      </div>

      {accounts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
          Ingen tjenestepensjon ennå. Trykk under for å legge til.
        </p>
      ) : (
        <ul className="space-y-3" aria-label="Tjenestepensjonskontoer">
          {accounts.map((account, index) => {
            const selectValue = providerSelectValue(account.provider);
            const showCustom =
              selectValue === "Annet" || isCustomProvider(account.provider);

            return (
              <li
                key={account.id}
                className="rounded-xl border border-border bg-muted/40 p-3 sm:p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">
                    TP {index + 1}
                    {account.label?.trim()
                      ? ` · ${account.label.trim()}`
                      : ` · ${TP_KIND_LABELS[account.kind]}`}
                    {account.activeContribution ? (
                      <span className="ml-2 inline-flex rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        Aktiv
                      </span>
                    ) : null}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeAccount(account.id)}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-slate-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700"
                    aria-label={`Fjern tjenestepensjon ${index + 1}`}
                    title="Slett"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field id={`tp-kind-${account.id}`} label="Type">
                    <select
                      id={`tp-kind-${account.id}`}
                      className={selectClass}
                      value={account.kind}
                      onChange={(e) =>
                        updateAccount(account.id, {
                          kind: e.target.value as TpKind,
                        })
                      }
                    >
                      {KINDS.map((k) => (
                        <option key={k} value={k}>
                          {TP_KIND_LABELS[k]}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    id={`tp-label-${account.id}`}
                    label="Navn / etikett (valgfritt)"
                  >
                    <input
                      id={`tp-label-${account.id}`}
                      type="text"
                      className={inputClass}
                      placeholder="F.eks. Nåværende arbeidsgiver"
                      value={account.label ?? ""}
                      onChange={(e) =>
                        updateAccount(account.id, { label: e.target.value })
                      }
                    />
                  </Field>

                  <Field
                    id={`tp-provider-${account.id}`}
                    label="Hvor ligger den?"
                    hint="Påvirker ikke beregningen — valgfritt for egen oversikt"
                  >
                    <div className="space-y-2">
                      <select
                        id={`tp-provider-${account.id}`}
                        className={selectClass}
                        value={selectValue}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "Annet") {
                            updateAccount(account.id, {
                              provider: isCustomProvider(account.provider)
                                ? account.provider
                                : "Annet",
                            });
                          } else {
                            updateAccount(account.id, { provider: v });
                          }
                        }}
                      >
                        <option value="">Velg …</option>
                        {TP_PROVIDERS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      {showCustom ? (
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Egen leverandør"
                          aria-label="Egen leverandør"
                          value={
                            account.provider === "Annet"
                              ? ""
                              : (account.provider ?? "")
                          }
                          onChange={(e) =>
                            updateAccount(account.id, {
                              provider: e.target.value || "Annet",
                            })
                          }
                        />
                      ) : null}
                    </div>
                  </Field>

                  <Field
                    id={`tp-balance-${account.id}`}
                    label="Eksisterende saldo (kr)"
                    hint="Fra pensjonskapitalbevis / Norsk Pensjon"
                  >
                    <CurrencyInput
                      id={`tp-balance-${account.id}`}
                      value={account.balance}
                      min={0}
                      step={10000}
                      onChange={(v) =>
                        updateAccount(account.id, { balance: v })
                      }
                    />
                  </Field>

                  <Field
                    id={`tp-rate-${account.id}`}
                    label="Innskuddssats (%)"
                    hint="OTP typisk minst 2 % opp til 12 G — brukes kun hvis aktiv"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        id={`tp-rate-${account.id}`}
                        type="number"
                        min={0}
                        max={15}
                        step={0.1}
                        className={inputClass}
                        value={Number(
                          (account.contributionRate * 100).toFixed(1),
                        )}
                        onChange={(e) =>
                          updateAccount(account.id, {
                            contributionRate: Number(e.target.value) / 100,
                          })
                        }
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </Field>

                  <Field
                    id={`tp-return-${account.id}`}
                    label="Forventet avkastning (%)"
                    hint="Typisk 3–5 % for tjenestepensjon"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        id={`tp-return-${account.id}`}
                        type="number"
                        min={0}
                        max={15}
                        step={0.1}
                        className={inputClass}
                        value={Number(
                          (account.expectedReturn * 100).toFixed(1),
                        )}
                        onChange={(e) =>
                          updateAccount(account.id, {
                            expectedReturn: Number(e.target.value) / 100,
                          })
                        }
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </Field>

                  {showsYearlyEstimate(account.kind) ? (
                    <Field
                      id={`tp-estimate-${account.id}`}
                      label="Årlig pensjonsanslag (kr)"
                      hint="Forenkling for ytelse/offentlig — brukes direkte som årlig utbetaling hvis satt"
                    >
                      <CurrencyInput
                        id={`tp-estimate-${account.id}`}
                        value={account.yearlyPensionEstimate ?? 0}
                        min={0}
                        step={5000}
                        onChange={(v) =>
                          updateAccount(account.id, {
                            yearlyPensionEstimate: v,
                          })
                        }
                      />
                    </Field>
                  ) : null}

                  <div className="sm:col-span-2">
                    <label className="flex items-start gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-slate-700 shadow-sm">
                      <input
                        type="radio"
                        name="tp-active-contribution"
                        className="mt-0.5 h-4 w-4 accent-primary"
                        checked={account.activeContribution}
                        onChange={() => setActive(account.id)}
                      />
                      <span>
                        <span className="font-medium text-primary">
                          Aktiv ordning (pågående innskudd)
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          Kun én konto får innskudd = sats × lønn (opp til 12 G).
                          Bytt hit hvis dette er din nåværende arbeidsgiverordning.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={addAccount}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-primary/40 bg-primary-soft px-4 py-3 text-sm font-semibold text-primary shadow-sm transition-colors hover:border-primary/60 hover:bg-primary-soft/80"
      >
        <span aria-hidden className="text-lg leading-none">
          +
        </span>
        Legg til tjenestepensjon
      </button>
    </div>
  );
}
