import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { api } from '@/api/endpoints';
import { ApiError } from '@/api/errors';
import { queryClient } from '@/api/queryClient';

// confirming - shown to the user straight away, waiting for the server
// confirmed  - the server accepted it
// failed     - the server said no (see `failure`)
export type BookingStatus = 'confirming' | 'confirmed' | 'failed';

export interface Booking {
  id: string; // made on the phone, so we can show the booking before the server answers
  serverId?: string; // e.g. "BK-4102", once confirmed
  doctorId: string;
  doctorName: string;
  specialty: string;
  slotId: string;
  startsAt: string;
  priceInr: number;
  serviceName?: string;
  status: BookingStatus;
  failure?: 'slot_taken' | 'other';
}

export type NewBooking = Omit<Booking, 'status' | 'serverId' | 'failure'>;

interface BookingsStore {
  bookings: Booking[];
  bookSlot: (booking: NewBooking) => Promise<void>;
  removeBooking: (id: string) => void;
}

export function newBookingId(): string {
  return `local-${Date.now()}`;
}

export const useBookings = create<BookingsStore>()(
  persist(
    (set) => {
      function update(id: string, changes: Partial<Booking>) {
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...changes } : b)),
        }));
      }

      return {
        bookings: [],

        // Optimistic booking:
        // 1. Add the booking as "confirming" right away, so the app feels instant.
        // 2. Ask the server.
        // 3. Mark it "confirmed", or "failed" if the slot was taken or the request failed.
        bookSlot: async (booking) => {
          set((state) => ({ bookings: [{ ...booking, status: 'confirming' }, ...state.bookings] }));

          try {
            const saved = await api.createBooking(booking.doctorId, booking.slotId);
            update(booking.id, { status: 'confirmed', serverId: saved.id });
          } catch (error) {
            const slotTaken = error instanceof ApiError && error.status === 409;
            update(booking.id, { status: 'failed', failure: slotTaken ? 'slot_taken' : 'other' });
          }

          // Refresh slots and doctors so the booked slot shows as taken.
          queryClient.invalidateQueries({ queryKey: ['slots'] });
          queryClient.invalidateQueries({ queryKey: ['doctors'] });
        },

        removeBooking: (id) => set((state) => ({ bookings: state.bookings.filter((b) => b.id !== id) })),
      };
    },
    {
      name: 'tapza-bookings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ bookings: state.bookings }),
      skipHydration: true, // loaded on startup in src/store/loadSavedData.ts
    },
  ),
);
