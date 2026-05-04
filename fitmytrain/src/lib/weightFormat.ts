/**
 * Centralized helpers for weight formatting and validation.
 *
 * Use these everywhere instead of `value.toFixed(...)` / `value ?? 0`
 * so that `null`/`undefined`/invalid weights never crash the UI and
 * never silently turn into zeros that pollute analytics.
 */

export interface FormatWeightOptions {
  /** Suffix appended after the number. Defaults to "кг". Pass "" to omit. */
  unit?: string;
  /** Number of fraction digits. Defaults to 1. */
  digits?: number;
  /** What to render when value is missing/invalid. Defaults to "—". */
  fallback?: string;
}

/**
 * Format a weight for display. Returns a fallback ("—" by default) when
 * the value is null/undefined/NaN — never throws.
 */
export function formatWeight(
  value: number | null | undefined,
  opts: FormatWeightOptions = {}
): string {
  const { unit = 'кг', digits = 1, fallback = '—' } = opts;
  if (value == null || Number.isNaN(value)) return fallback;
  const num = value.toFixed(digits);
  return unit ? `${num} ${unit}` : num;
}

/**
 * Format a weight value without unit. Useful inside composed strings.
 */
export function formatWeightValue(
  value: number | null | undefined,
  digits = 1,
  fallback = '—'
): string {
  if (value == null || Number.isNaN(value)) return fallback;
  return value.toFixed(digits);
}

/**
 * Type guard: a real, usable training weight (positive, finite, defined).
 * Use to filter logs/sets before aggregation: `.filter(isValidWeight)`.
 */
export function isValidWeight(
  value: number | null | undefined
): value is number {
  return value != null && Number.isFinite(value) && value > 0;
}
