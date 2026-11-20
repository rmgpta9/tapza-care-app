import { request } from './client';
import type { Booking, Doctor, Prescription, Slot } from './types';

export const api = {
  // Returns `unknown` because the config is checked by src/config/validate.ts before use.
  getConfig: () => request<unknown>('GET', '/config'),
  getDoctors: () => request<Doctor[]>('GET', '/doctors'),
  getSlots: (doctorId: string, date: string) => request<Slot[]>('GET', `/slots?doctorId=${doctorId}&date=${date}`),
  createBooking: (doctorId: string, slotId: string) => request<Booking>('POST', '/bookings', { doctorId, slotId }),
  getPrescriptions: () => request<Prescription[]>('GET', '/prescriptions'),
};
