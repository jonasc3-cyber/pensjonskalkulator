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
