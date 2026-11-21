// True for a plain object like { a: 1 }. Used to check config items before reading them.
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
