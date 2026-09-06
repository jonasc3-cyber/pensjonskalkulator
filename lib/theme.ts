/** Trust/bank palette — keep in sync with app/globals.css */
export const palette = {
  primary: "#0B2A4A",
  primaryMid: "#1E4A73",
  primarySoft: "#E8EEF4",
  accent: "#4F7A68",
  accentSoft: "#EAF1ED",
  slate: "#64748B",
  slateSoft: "#F1F5F9",
  border: "#D8DEE6",
  background: "#F3F5F8",
  foreground: "#0F172A",
  card: "#FFFFFF",
  infoBg: "#F7F3EB",
  infoBorder: "#E5D9C3",
  infoText: "#5A4A32",
  chart: {
    /** Navy — Folketrygd (bunn i stack) */
    folketrygd: "#0B2A4A",
    /** Teal — TP (ikke navy/blå) */
    tp: "#3D7A8C",
    /** Sage green — AFP */
    afp: "#4F7A68",
    /** Warm/cool gray — Sparing (topp i stack) */
    sparing: "#94A3B8",
    grid: "#E2E8F0",
  },
} as const;

/** Stack order bottom→top; same order for legends on both charts */
export const chartSeries = [
  { key: "Folketrygd", color: palette.chart.folketrygd, label: "Folketrygd" },
  { key: "TP", color: palette.chart.tp, label: "TP" },
  { key: "AFP", color: palette.chart.afp, label: "AFP" },
  { key: "Sparing", color: palette.chart.sparing, label: "Sparing" },
] as const;

export type ChartSeriesKey = (typeof chartSeries)[number]["key"];

export const chartSeriesOrder: ChartSeriesKey[] = chartSeries.map((s) => s.key);
