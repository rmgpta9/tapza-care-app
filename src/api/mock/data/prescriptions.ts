import type { Prescription } from '@/api/types';

const DAY = 24 * 60 * 60 * 1000;

function daysAgo(n: number, hour: number): string {
  const d = new Date(Date.now() - n * DAY);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
}

// dates are relative to now, so build fresh on every call
export function buildPrescriptions(): Prescription[] {
  return [
    {
      id: 'rx-1042',
      issuedAt: daysAgo(1, 11),
      doctorName: 'Dr. Lakshmi Narayana Rao',
      clinicName: 'Tapza Sunrise Clinic, Banjara Hills',
      diagnosis: 'Viral fever with throat infection',
      medicines: [
        { id: 'm1', name: 'Paracetamol 650 mg', dose: '1 tablet', days: 5, timing: ['morning', 'afternoon', 'night'], instructions: 'After food' },
        { id: 'm2', name: 'Azithromycin 500 mg', dose: '1 tablet', days: 3, timing: ['morning'], instructions: '1 hour before food' },
        { id: 'm3', name: 'Cetirizine 10 mg', dose: '1 tablet', days: 5, timing: ['night'], instructions: 'May cause drowsiness' },
        { id: 'm4', name: 'Pantoprazole 40 mg', dose: '1 tablet', days: 5, timing: ['morning'], instructions: 'Empty stomach' },
      ],
    },
    {
      id: 'rx-1031',
      issuedAt: daysAgo(9, 18),
      doctorName: 'Dr. Fatima Begum',
      clinicName: 'Tapza Clinic, Benz Circle, Vijayawada',
      diagnosis: 'Type 2 diabetes · review',
      medicines: [
        { id: 'm1', name: 'Metformin 500 mg', dose: '1 tablet', days: 30, timing: ['morning', 'night'], instructions: 'With food' },
        { id: 'm2', name: 'Glimepiride 1 mg', dose: '1 tablet', days: 30, timing: ['morning'], instructions: 'Before breakfast' },
        { id: 'm3', name: 'Vitamin D3 1000 IU', dose: '1 capsule', days: 30, timing: ['afternoon'], instructions: 'After lunch' },
      ],
    },
    {
      id: 'rx-1027',
      issuedAt: daysAgo(14, 10),
      doctorName: 'Dr. Mohammed Irfan',
      clinicName: 'Tapza Sunrise Clinic, Banjara Hills',
      patientName: 'Venkata Ramana (Father)',
      diagnosis: 'Hypertension',
      medicines: [
        { id: 'm1', name: 'Telmisartan 40 mg', dose: '1 tablet', days: 30, timing: ['morning'], instructions: 'Same time every day' },
        { id: 'm2', name: 'Ecosprin 75 mg', dose: '1 tablet', days: 30, timing: ['afternoon'], instructions: 'After lunch' },
        { id: 'm3', name: 'Atorvastatin 10 mg', dose: '1 tablet', days: 30, timing: ['night'], instructions: 'After dinner' },
      ],
    },
    {
      id: 'rx-0988',
      issuedAt: daysAgo(46, 17),
      doctorName: 'Dr. Ananya Reddy',
      clinicName: 'Tapza Sunrise Clinic, Banjara Hills',
      patientName: 'Aarav (Son)',
      diagnosis: 'Ear infection',
      medicines: [
        { id: 'm1', name: 'Amoxicillin syrup 250 mg/5 ml', dose: '5 ml', days: 7, timing: ['morning', 'afternoon', 'night'], instructions: 'Shake well' },
        { id: 'm2', name: 'Ibuprofen syrup 100 mg/5 ml', dose: '5 ml', days: 3, timing: ['night'], instructions: 'Only if pain or fever' },
      ],
    },
  ];
}
