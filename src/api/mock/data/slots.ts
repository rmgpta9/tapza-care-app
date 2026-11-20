import type { Slot } from '@/api/types';
import { dayOfWeek } from '@/utils/date';

// Clinic timings. Each slot is 20 minutes.
const MORNING = ['09:30', '09:50', '10:10', '10:30', '10:50', '11:10', '11:30', '11:50', '12:10', '12:30'];
const EVENING = ['16:30', '16:50', '17:10', '17:30', '17:50', '18:10', '18:30', '18:50', '19:10', '19:30', '19:50'];

const SLOT_MINUTES = 20;

// Mon-Fri: morning + evening. Saturday: morning only. Sunday: closed.
function clinicTimes(date: string): string[] {
  const day = dayOfWeek(date);
  if (day === 0) return [];
  if (day === 6) return MORNING;
  return [...MORNING, ...EVENING];
}

// Slot ids look like "d1_2026-11-21_09:30" so the server can read them back.
export function makeSlotId(doctorId: string, date: string, time: string): string {
  return `${doctorId}_${date}_${time}`;
}

export function readSlotId(slotId: string): { doctorId: string; date: string } {
  const [doctorId = '', date = ''] = slotId.split('_');
  return { doctorId, date };
}

export function generateSlots(doctorId: string, date: string): Slot[] {
  const doctorNumber = Number(doctorId.replace('d', '')) || 0;
  const now = Date.now();

  return clinicTimes(date).map((time, index) => {
    // "+05:30" is India time, so the slot is correct even if the phone is set
    // to another timezone.
    const startsAt = `${date}T${time}:00+05:30`;
    const start = new Date(startsAt).getTime();
    const endsAt = new Date(start + SLOT_MINUTES * 60 * 1000).toISOString();

    // Pretend roughly every 4th slot is already booked by someone else.
    // Adding the doctor number makes each doctor's pattern different.
    const bookedBySomeoneElse = (index + doctorNumber) % 4 === 0;
    const isInThePast = start < now;

    return {
      id: makeSlotId(doctorId, date, time),
      doctorId,
      startsAt,
      endsAt,
      available: !bookedBySomeoneElse && !isInThePast,
    };
  });
}
