/**
 * Konstantar for pensjonsmodellen.
 * Tall merket verified er kryssjekket mot offisielle kilder (NAV, Lovdata, Regjeringen)
 * per CONSTANTS_UPDATED. Se /workspace/pensjon/constants-2026.md for kildehenvisninger.
 *
 * Tallene er bevisst avrundet der modellen er forenklet — kalkulatoren viser intervaller,
 * ikke falsk presisjon.
 */

/** ISO-dato for siste manuelle kontroll av satser mot offisielle kilder. */
export const CONSTANTS_UPDATED = "2026-09-04";

/** Menneskelesbar etikett for «Satser sist kontrollert». */
export const CONSTANTS_UPDATED_LABEL = "4. september 2026";

/**
 * Grunnbeløpet (G) — verified: 136 549 NOK, effektiv 1. mai 2026.
 * Kilder: nav.no/grunnbelopet, forskrift 22. mai 2026 nr. 869 § 1.
 */
export const G_NOK = 136_549;

/**
 * Gjennomsnittlig G for kalenderåret 2026 (brukes til pensjonsopptjening, § 20-5).
 * verified: 134 419 NOK.
 */
export const G_AVERAGE_2026_NOK = 134_419;

/** Opptjeningssats i ny folketrygd (født 1963+): 18,1 % av inntekt opp til 7,1 G. verified (lov). */
export const FOLKETRYGD_OPPTJENINGSSATS = 0.181;

/** Maksimalt opptjeningsgrunnlag i antall G. verified (lov § 20-4/20-5). */
export const FOLKETRYGD_MAKS_G = 7.1;

/** OTP: innskudd beregnes av lønn opp til 12 G (fra første krone). verified (OTP-loven § 4). */
export const TP_MAKS_G = 12;

/** Standard OTP-innskuddssats (lovens minimum). verified: 2 %. */
export const TP_DEFAULT_SATS = 0.02;

/** Standard forventet lønnsvekst (nominell). Modellantakelse — ikke offisiell sats. */
export const DEFAULT_LONNSVEKST = 0.03;

/** Standard forventet G-vekst (ofte nær lønnsvekst). Modellantakelse. */
export const DEFAULT_G_VEKST = 0.03;

/** Standard inflasjon (CPI). Modellantakelse. */
export const DEFAULT_INFLASJON = 0.02;

/** Standard forventet avkastning TP / sparing (før scenariojustering). Modellantakelse. */
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
 * Garantipensjon (ny modell § 20-9) i NOK/år fra 1. mai 2026 — verified
 * (forskrift 22. mai 2026 nr. 869 § 5). Satser ved 67 år, ugradert, full trygdetid.
 * «enslig» = høy sats; «gift» = ordinær sats (forenklet mapping).
 */
export const GARANTIPENSJON_NOK = {
  enslig: 253_787,
  gift: 234_765,
} as const;

/**
 * Garantipensjon som andel av G (G = 136 549): høy ≈ 1,86 G, ordinær ≈ 1,72 G.
 * Brukes når gulvet skal følge G-vekst i prognosen: floor = GARANTIPENSJON_G × g.
 */
export const GARANTIPENSJON_G = {
  enslig: GARANTIPENSJON_NOK.enslig / G_NOK,
  gift: GARANTIPENSJON_NOK.gift / G_NOK,
} as const;

/** Standard utbetalingsperiode for TP/sparing ved «over N år». */
export const DEFAULT_UTBETALINGSAR = 10;

/** Antatt levealder for livsvarig annuitet (forenkling). */
export const DEFAULT_LEVETID_ANNUITET = 87;

/** Grovt skatteanslag: netto ≈ denne andelen av brutto pensjon. VERIFY: svært forenklet. */
export const GROV_NETTO_ANDEL = 0.78;

/** AFP forenkling: årlig tillegg — ikke offisielle satser. */
export const AFP_PRIVAT_FAKTOR = 0.0042;
export const AFP_OFFENTLIG_FAKTOR = 0.0055;
export const AFP_MAKS_OPPTJENINGSAAR = 40;

/**
 * Øvre aldersgrense i arbeidslivet (arbeidsmiljøloven) — verified i kraft 1. jan 2026.
 * Folketrygdens uttaksaldre er fortsatt 62 (tidligst) / 67 (referanse) i lov.
 */
export const WORK_AGE_CAP = 72;

/** Tidligste / referanse uttaksalder i folketrygden (fortsatt i lov per 2026-09-04). */
export const FOLKETRYGD_EARLIEST_WITHDRAWAL_AGE = 62;
export const FOLKETRYGD_REFERENCE_AGE = 67;

/** Kalenderår for «i dag» i prognosen. */
export const CURRENT_YEAR = 2026;

/**
 * Utvalgte delingstall ved uttaksalder 67 (NAV Delingstall.xlsx, publisert 26. juni 2026).
 * 1963–1965 er endelige; 1970+ er NAV-prognoser (endeleg når kullet fyller 61).
 */
export const DELINGSTALL_AT_67_SAMPLES: {
  birthYear: number;
  delingstall: number;
  status: "endelig" | "prognose";
}[] = [
  { birthYear: 1963, delingstall: 16.18, status: "endelig" },
  { birthYear: 1965, delingstall: 16.34, status: "endelig" },
  { birthYear: 1970, delingstall: 16.7, status: "prognose" },
  { birthYear: 1980, delingstall: 17.78, status: "prognose" },
  { birthYear: 1985, delingstall: 18.32, status: "prognose" },
  { birthYear: 2000, delingstall: 19.85, status: "prognose" },
];

/** Offisielle kilder brukt ved siste kontroll (lenker til UI). */
export const CONSTANTS_SOURCE_LINKS = [
  { label: "NAV grunnbeløpet", href: "https://www.nav.no/grunnbelopet" },
  { label: "NAV levealdersjustering", href: "https://www.nav.no/levealdersjustering" },
  {
    label: "Lovdata forskrift 2026-05-22-869",
    href: "https://lovdata.no/dokument/SF/forskrift/2026-05-22-869",
  },
  { label: "NAV pensjon", href: "https://www.nav.no/pensjon" },
] as const;
