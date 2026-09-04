import {
  CURRENT_YEAR,
  FOLKETRYGD_MAKS_G,
  FOLKETRYGD_OPPTJENINGSSATS,
  G_NOK,
  GARANTIPENSJON_G,
} from "../constants";
import { getDelingstall } from "./delingstall";
import type { Sivilstatus } from "./types";

export interface FolketrygdParams {
  birthYear: number;
  currentSalary: number;
  retirementAge: number;
  wageGrowth: number;
  gGrowth: number;
  sivilstatus: Sivilstatus;
  /** Antatt allerede opptjent beholdning (0 = start fra scratch / forenklet). */
  existingBalance?: number;
}

export interface FolketrygdResult {
  balanceAtRetirement: number;
  yearlyGross: number;
  monthlyGross: number;
  garantipensjonFloor: number;
  garantipensjonApplied: boolean;
  yearsProjected: number;
  delingstall: number;
}

/**
 * Prosjekterer pensjonsbeholdning og årlig alderspensjon (ny folketrygd).
 * Antar jevn lønn med lønnsvekst og opptjening 18,1 % opp til 7,1 G hvert år
 * fra nåværende alder til uttak.
 */
export function projectFolketrygd(params: FolketrygdParams): FolketrygdResult {
  const age = CURRENT_YEAR - params.birthYear;
  const years = Math.max(0, params.retirementAge - age);
  let g = G_NOK;
  let salary = params.currentSalary;
  let balance = params.existingBalance ?? estimatePastBalance(params, age);

  for (let i = 0; i < years; i++) {
    const cap = FOLKETRYGD_MAKS_G * g;
    const base = Math.min(Math.max(0, salary), cap);
    balance += FOLKETRYGD_OPPTJENINGSSATS * base;
    // Beholdning reguleres omtrent med lønns-/G-vekst i forenklet modell
    balance *= 1 + params.gGrowth;
    salary *= 1 + params.wageGrowth;
    g *= 1 + params.gGrowth;
  }

  const delingstall = getDelingstall(params.retirementAge);
  const earned = balance / delingstall;
  const floor = GARANTIPENSJON_G[params.sivilstatus] * g;
  const garantipensjonApplied = earned < floor;
  const yearly = Math.max(earned, floor);

  return {
    balanceAtRetirement: balance,
    yearlyGross: yearly,
    monthlyGross: yearly / 12,
    garantipensjonFloor: floor,
    garantipensjonApplied,
    yearsProjected: years,
    delingstall,
  };
}

/**
 * Grove anslag på allerede opptjent beholdning: anta jevn historisk lønn
 * (dagens lønn deflatert) for år fra max(13, alder-karrierestart) til nå.
 * Karriere startes tidligst ved 22 år i denne forenklingen.
 */
function estimatePastBalance(
  params: FolketrygdParams,
  currentAge: number,
): number {
  const startAge = 22;
  const yearsWorked = Math.max(0, currentAge - startAge);
  if (yearsWorked === 0) return 0;

  let g = G_NOK;
  // Gå bakover grovt: anta historisk G/lønn vokste med samme rate
  for (let i = 0; i < yearsWorked; i++) {
    g /= 1 + params.gGrowth;
  }

  let salary = params.currentSalary;
  for (let i = 0; i < yearsWorked; i++) {
    salary /= 1 + params.wageGrowth;
  }

  let balance = 0;
  for (let i = 0; i < yearsWorked; i++) {
    const cap = FOLKETRYGD_MAKS_G * g;
    const base = Math.min(Math.max(0, salary), cap);
    balance += FOLKETRYGD_OPPTJENINGSSATS * base;
    balance *= 1 + params.gGrowth;
    salary *= 1 + params.wageGrowth;
    g *= 1 + params.gGrowth;
  }
  return balance;
}

/** Ren hjelpefunksjon for tester: ett års opptjening. */
export function yearlyAccrual(salary: number, g: number = G_NOK): number {
  const base = Math.min(Math.max(0, salary), FOLKETRYGD_MAKS_G * g);
  return FOLKETRYGD_OPPTJENINGSSATS * base;
}
