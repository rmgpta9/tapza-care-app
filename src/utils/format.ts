import { currentLocale, t } from '@/i18n';
import { addDays, toDateString, today } from './date';

// 1999 -> "₹1,999"
// (Our prices are under ₹1 lakh, where Indian and Western comma grouping are the same.)
export function formatRupees(amount: number): string {
  return '₹' + String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// "2026-11-21T16:30:00+05:30" -> "4:30 PM" (AM/PM is also common in Hindi and Telugu apps)
export function formatTime(iso: string): string {
  const date = new Date(iso);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${suffix}`;
}

// Short weekday in the chosen language: "Mon" / "सोम" / "సోమ"
function weekdayName(date: Date): string {
  return date.toLocaleDateString(currentLocale(), { weekday: 'short' });
}

// "Today" / "Tomorrow" (translated), or null for other days.
function relativeDay(dateString: string): string | null {
  if (dateString === today()) return t('common.today');
  if (dateString === addDays(today(), 1)) return t('common.tomorrow');
  return null;
}

// "Today, 4:30 PM" / "Tomorrow, 9:30 AM" / "Mon 23, 9:30 AM"
export function formatSlot(iso: string): string {
  const date = new Date(iso);
  const dayLabel = relativeDay(toDateString(date)) ?? `${weekdayName(date)} ${date.getDate()}`;
  return `${dayLabel}, ${formatTime(iso)}`;
}

// "2026-11-20T11:15:00Z" -> "20 Nov" (month in the chosen language)
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(currentLocale(), { day: 'numeric', month: 'short' });
}

// "2026-11-24" -> { label: "Tue", day: "24" }  (label is "Today" / "Tomorrow" when it fits)
export function dayParts(dateString: string): { label: string; day: string } {
  const date = new Date(`${dateString}T00:00:00`);
  return { label: relativeDay(dateString) ?? weekdayName(date), day: String(date.getDate()) };
}

// "Good morning" / "Good afternoon" / "Good evening"
export function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return t('home.greetingMorning');
  if (hour < 17) return t('home.greetingAfternoon');
  return t('home.greetingEvening');
}
