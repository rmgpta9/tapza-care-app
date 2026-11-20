// Shapes from the assignment. Optional fields are my additions on top.

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photoUrl: string;
  feeInr: number;
  languages: string[];
  clinicName?: string;
  experienceYears?: number;
  // next open slot within a week
  nextAvailableAt?: string | null;
}

export interface Slot {
  id: string;
  doctorId: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
}

export interface Booking {
  id: string;
  doctorId: string;
  slotId: string;
  startsAt: string;
  endsAt: string;
  status: 'confirmed';
  createdAt: string;
}

export type DoseTiming = 'morning' | 'afternoon' | 'night';

export interface Medicine {
  id: string;
  name: string;
  dose: string;
  days: number;
  timing: DoseTiming[];
  instructions?: string;
}

export interface Prescription {
  id: string;
  issuedAt: string;
  doctorName: string;
  clinicName: string;
  medicines: Medicine[];
  patientName?: string; // set when it's for a family member
  diagnosis?: string;
}
