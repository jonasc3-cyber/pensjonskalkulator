/** Norsk (bokmål) tall- og valutformatering. */

const nok = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
  maximumFractionDigits: 0,
});

const nokExact = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
  maximumFractionDigits: 0,
});

const numberNb = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

const pctNb = new Intl.NumberFormat("nb-NO", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export function formatNOK(value: number): string {
  if (!Number.isFinite(value)) return "–";
  return nok.format(Math.round(value));
}

export function formatNOKExact(value: number): string {
  if (!Number.isFinite(value)) return "–";
  return nokExact.format(Math.round(value));
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "–";
  return numberNb.format(Math.round(value));
}

export function formatPercent(rate: number): string {
  if (!Number.isFinite(rate)) return "–";
  return pctNb.format(rate);
}

export function formatRange(low: number, high: number): string {
  return `${formatNOK(low)} – ${formatNOK(high)}`;
}

/** Copy when AFP rounds to 0 — keep legend, tooltip and table in sync. */
export const AFP_NOT_INCLUDED_LABEL = "Ikke inkludert";

export function isAfpNotIncluded(value: number): boolean {
  return Number.isFinite(value) && Math.round(value) === 0;
}

/** Chart/table cell value: AFP → «Ikke inkludert» when yearly rounds to 0. */
export function formatChartSeriesValue(seriesKey: string, value: number): string {
  if (seriesKey === "AFP" && isAfpNotIncluded(value)) {
    return AFP_NOT_INCLUDED_LABEL;
  }
  return formatNOK(value);
}

const MONTHS_NB = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
] as const;

/** Format YYYY-MM-DD as «12. september 2026» (bokmål). */
export function formatDateNb(isoDate: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!m) return isoDate;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return isoDate;
  return `${day}. ${MONTHS_NB[month - 1]} ${year}`;
}
