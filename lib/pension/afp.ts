import {
  AFP_MAKS_OPPTJENINGSAAR,
  AFP_OFFENTLIG_FAKTOR,
  AFP_PRIVAT_FAKTOR,
  CURRENT_YEAR,
  FOLKETRYGD_MAKS_G,
  G_NOK,
} from "../constants";
import type { AfpType } from "./types";

export interface AfpParams {
  birthYear: number;
  currentSalary: number;
  retirementAge: number;
  afpType: AfpType;
  /** Scenariofaktor 0.85 / 1 / 1.1 for low/base/high */
  scenarioFactor?: number;
}

export interface AfpResult {
  yearly: number;
  monthly: number;
  note: string;
}

/**
 * Svært forenklet AFP-estimat.
 * Ekte AFP (privat via Fellesordningen / offentlig via tjenestepensjonsordning)
 * har detaljerte vilkår, levealdersjustering og samordning — ikke modellert her.
 */
export function estimateAfp(params: AfpParams): AfpResult {
  if (params.afpType === "ingen") {
    return {
      yearly: 0,
      monthly: 0,
      note: "Ingen AFP valgt.",
    };
  }

  const age = CURRENT_YEAR - params.birthYear;
  const yearsToRetirement = Math.max(0, params.retirementAge - age);
  const careerYears = Math.min(
    AFP_MAKS_OPPTJENINGSAAR,
    Math.max(0, age - 22) + yearsToRetirement,
  );
  const base = Math.min(params.currentSalary, FOLKETRYGD_MAKS_G * G_NOK);
  const factor =
    params.afpType === "privat" ? AFP_PRIVAT_FAKTOR : AFP_OFFENTLIG_FAKTOR;

  // Lavere uttak → litt høyere årlig AFP i denne forenklingen; etter 67 avtrappes grovt
  let ageFactor = 1;
  if (params.retirementAge < 67) {
    ageFactor = 0.85 + (params.retirementAge - 62) * 0.03;
  } else if (params.retirementAge > 67) {
    ageFactor = Math.max(0.5, 1 - (params.retirementAge - 67) * 0.08);
  }

  const scenario = params.scenarioFactor ?? 1;
  const yearly = base * factor * careerYears * ageFactor * scenario;

  return {
    yearly,
    monthly: yearly / 12,
    note:
      params.afpType === "privat"
        ? "Forenklet privat AFP-anslag (ikke Fellesordningens regler)."
        : "Forenklet offentlig AFP-anslag (ikke full tjenestepensjonsmodell).",
  };
}
