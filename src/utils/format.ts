import { addDays, toDateString, today } from './date';

// 1999 -> "₹1,999"
// (Our prices are under ₹1 lakh, where Indian and Western comma grouping are the same.)
export function formatRupees(amount: number): string {
  return '₹' + String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// "2026-11-21T16:30:00+05:30" -> "4:30 PM"
export function formatTime(iso: string): string {
  const date = new Date(iso);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${suffix}`;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// "Today, 4:30 PM" / "Tomorrow, 9:30 AM" / "Mon 23, 9:30 AM"
export function formatSlot(iso: string): string {
  const date = new Date(iso);
  const day = toDateString(date);

  let dayLabel = `${WEEKDAYS[date.getDay()]} ${date.getDate()}`;
  if (day === today()) dayLabel = 'Today';
  if (day === addDays(today(), 1)) dayLabel = 'Tomorrow';

  return `${dayLabel}, ${formatTime(iso)}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "2026-11-20T11:15:00Z" -> "20 Nov"
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

// "2026-11-24" -> { label: "Tue", day: "24" }  (label is "Today" / "Tomorrow" when it fits)
export function dayParts(dateString: string): { label: string; day: string } {
  const date = new Date(`${dateString}T00:00:00`);
  let label = WEEKDAYS[date.getDay()] ?? '';
  if (dateString === today()) label = 'Today';
  if (dateString === addDays(today(), 1)) label = 'Tomorrow';
  return { label, day: String(date.getDate()) };
}

// "Good morning" / "Good afternoon" / "Good evening"
export function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
