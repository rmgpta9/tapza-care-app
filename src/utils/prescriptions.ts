import type { DoseTiming, Medicine, Prescription } from '@/api/types';
import { daysBetween, toDateString, today } from './date';

export const TIMINGS: DoseTiming[] = ['morning', 'afternoon', 'night'];

// Which day of the course today is: issued today = day 1.
export function courseDay(prescription: Prescription): number {
  const issuedOn = toDateString(new Date(prescription.issuedAt));
  return daysBetween(issuedOn, today()) + 1;
}

// A medicine is still being taken if today is within its number of days.
export function isMedicineActive(prescription: Prescription, medicine: Medicine): boolean {
  return courseDay(prescription) <= medicine.days;
}

// A prescription is active while at least one of its medicines is.
export function isPrescriptionActive(prescription: Prescription): boolean {
  return prescription.medicines.some((m) => isMedicineActive(prescription, m));
}

// Days left of the longest medicine, e.g. 3 means "3 days left" (today included).
export function daysLeft(prescription: Prescription): number {
  const longest = Math.max(...prescription.medicines.map((m) => m.days));
  return Math.max(0, longest - courseDay(prescription) + 1);
}

// One dose = one medicine at one time of day, e.g. Paracetamol in the morning.
export interface Dose {
  key: string; // unique for this dose today, used to remember "taken"
  prescription: Prescription;
  medicine: Medicine;
  timing: DoseTiming;
}

// "rx-1042|m1|morning|2026-11-21"
export function doseKey(prescriptionId: string, medicineId: string, timing: DoseTiming, date = today()): string {
  return `${prescriptionId}|${medicineId}|${timing}|${date}`;
}

// Today's doses for these prescriptions, skipping medicines whose course is over.
export function todaysDoses(prescriptions: Prescription[]): Dose[] {
  const doses: Dose[] = [];
  for (const prescription of prescriptions) {
    for (const medicine of prescription.medicines) {
      if (!isMedicineActive(prescription, medicine)) continue;
      for (const timing of medicine.timing) {
        doses.push({ key: doseKey(prescription.id, medicine.id, timing), prescription, medicine, timing });
      }
    }
  }
  return doses;
}
