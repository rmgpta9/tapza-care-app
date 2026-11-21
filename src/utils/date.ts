// Dates are passed around as "YYYY-MM-DD" strings, like the API uses.

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function today(): string {
  return toDateString(new Date());
}

export function addDays(dateString: string, days: number): string {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toDateString(date);
}

// 0 = Sunday, 6 = Saturday
export function dayOfWeek(dateString: string): number {
  return new Date(`${dateString}T00:00:00`).getDay();
}

// Whole days from `from` to `to`: daysBetween("2026-11-20", "2026-11-22") -> 2
export function daysBetween(from: string, to: string): number {
  const ms = new Date(`${to}T00:00:00`).getTime() - new Date(`${from}T00:00:00`).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}
