import type { Prescription } from '@/api/types';
import { useDoses } from '@/store/doses';
import { addDays, today } from '@/utils/date';
import { courseDay, daysLeft, doseKey, isPrescriptionActive, todaysDoses } from '@/utils/prescriptions';

// A prescription issued `daysAgo` days ago, at midday.
function prescription(daysAgo: number): Prescription {
  return {
    id: 'rx-1',
    issuedAt: `${addDays(today(), -daysAgo)}T12:00:00`,
    doctorName: 'Dr. Lakshmi Narayana Rao',
    clinicName: 'Tapza Sunrise Clinic',
    medicines: [
      { id: 'm1', name: 'Paracetamol 650 mg', dose: '1 tablet', days: 5, timing: ['morning', 'afternoon', 'night'] },
      { id: 'm2', name: 'Azithromycin 500 mg', dose: '1 tablet', days: 3, timing: ['morning'] },
    ],
  };
}

describe('prescription helpers', () => {
  it('counts the course day from the issue date (issued today = day 1)', () => {
    expect(courseDay(prescription(0))).toBe(1);
    expect(courseDay(prescription(2))).toBe(3);
  });

  it('includes only medicines still in their course in today\'s doses', () => {
    // Day 2: both medicines -> 3 Paracetamol doses + 1 Azithromycin dose
    expect(todaysDoses([prescription(1)])).toHaveLength(4);
    // Day 4: Azithromycin (3 days) is finished -> only the 3 Paracetamol doses
    expect(todaysDoses([prescription(3)])).toHaveLength(3);
  });

  it('knows when a prescription is finished and how many days are left', () => {
    expect(isPrescriptionActive(prescription(4))).toBe(true); // day 5 of 5
    expect(daysLeft(prescription(4))).toBe(1);
    expect(isPrescriptionActive(prescription(5))).toBe(false); // day 6
    expect(daysLeft(prescription(5))).toBe(0);
  });
});

describe('doses store', () => {
  beforeEach(() => useDoses.setState({ taken: {} }));

  it('marks a dose as taken, and tapping again un-marks it', () => {
    const key = doseKey('rx-1', 'm1', 'morning');
    useDoses.getState().toggleDose(key);
    expect(useDoses.getState().taken[key]).toBe(true);

    useDoses.getState().toggleDose(key);
    expect(useDoses.getState().taken[key]).toBe(false);
  });

  it('keeps each day separate, because the date is part of the key', () => {
    expect(doseKey('rx-1', 'm1', 'morning', '2026-11-21')).not.toBe(doseKey('rx-1', 'm1', 'morning', '2026-11-22'));
  });
});
