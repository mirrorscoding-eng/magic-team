import type { Metric } from "./types";

export function fmt(n: number, decimals = 0) {
  if (Math.abs(n) >= 10000) {
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
  }
  return new Intl.NumberFormat("en", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}

export function fmtMetric(m: Metric, value: number) {
  return `${m.prefix}${fmt(value, m.decimals)}${m.suffix}`;
}

export function uplift(m: Metric) {
  if (!m.before) return "";
  if (m.lowerIsBetter) return `-${Math.round((1 - m.after / m.before) * 100)}%`;
  const r = m.after / m.before;
  return r >= 3 ? `x${r >= 10 ? Math.round(r) : r.toFixed(1)}` : `+${Math.round((r - 1) * 100)}%`;
}
