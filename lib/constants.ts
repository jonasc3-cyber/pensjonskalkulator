/**
 * Konstantar for pensjonsmodellen.
 * Alle verdier merket VERIFY bør kryssjekkes mot offisielle kilder (NAV, SSB, lovdata).
 * Tallene er bevisst avrundet — denne kalkulatoren viser intervaller, ikke falsk presisjon.
 */

/** Grunnbeløpet (G). VERIFY: Oppdater årlig fra nav.no / regjeringen.no. */
export const G_NOK = 130_160;
/** VERIFY-kommentar: ca. G for 2025-nivå. Offisiell G justeres 1. mai hvert år. */

/** Opptjeningssats i ny folketrygd (født 1963+): 18,1 % av inntekt opp til 7,1 G. */
export const FOLKETRYGD_OPPTJENINGSSATS = 0.181;

/** Maksimalt opptjeningsgrunnlag i antall G. */
export const FOLKETRYGD_MAKS_G = 7.1;

/** OTP: innskudd beregnes av lønn opp til 12 G (fra første krone i forenklet modell). */
export const TP_MAKS_G = 12;

/** Standard OTP-innskuddssats (lovens minimum for innskuddspensjon). */
export const TP_DEFAULT_SATS = 0.02;

/** Standard forventet lønnsvekst (nominell). */
export const DEFAULT_LONNSVEKST = 0.03;

/** Standard forventet G-vekst (ofte nær lønnsvekst). VERIFY: historisk ca. 3–4 %. */
export const DEFAULT_G_VEKST = 0.03;

/** Standard inflasjon (CPI). */
export const DEFAULT_INFLASJON = 0.02;

/** Standard forventet realavkastning TP / sparing (før scenariojustering). */
export const DEFAULT_AVKASTNING_TP = 0.045;
export const DEFAULT_AVKASTNING_SPARING = 0.05;

/** Scenariojustering på avkastning (prosentpoeng). */
export const SCENARIO_AVKASTNING_DELTA = {
  low: -0.02,
  base: 0,
  high: 0.015,
} as const;

/** Scenariojustering på lønns-/G-vekst. */
export const SCENARIO_VEKST_DELTA = {
  low: -0.01,
  base: 0,
  high: 0.005,
} as const;

/**
 * Forenklet garantipensjon som andel av G (årlig).
 * VERIFY: NAV publiserer satser for høy/ordinær sats; ekte regler er mer komplekse
 * (avkorting mot annen pensjon, sivilstatus m.m.).
 */
export const GARANTIPENSJON_G = {
  enslig: 2.28,
  gift: 1.9,
} as const;

/** Standard utbetalingsperiode for TP/sparing ved «over N år». */
export const DEFAULT_UTBETALINGSAR = 10;

/** Antatt levealder for livsvarig annuitet (forenkling). */
export const DEFAULT_LEVETID_ANNUITET = 87;

/** Grovt skatteanslag: netto ≈ denne andelen av brutto pensjon. VERIFY: svært forenklet. */
export const GROV_NETTO_ANDEL = 0.78;

/** AFP forenkling: årlig tillegg som andel av min(lønn, 7.1 G), skalert med opptjeningsår. */
export const AFP_PRIVAT_FAKTOR = 0.0042;
export const AFP_OFFENTLIG_FAKTOR = 0.0055;
export const AFP_MAKS_OPPTJENINGSAAR = 40;

/** Kalenderår for «i dag» i prognosen. */
export const CURRENT_YEAR = 2026;
