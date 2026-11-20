/** Tiny runtime guards. Kept dependency-free so validation is easy to read. */

export type UnknownRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function optionalString(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value : undefined;
}

export function optionalNumber(value: unknown): number | undefined {
  return isFiniteNumber(value) ? value : undefined;
}

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX.test(value);
}

export function isHttpUrl(value: unknown): value is string {
  return typeof value === 'string' && /^https?:\/\/\S+$/.test(value);
}
