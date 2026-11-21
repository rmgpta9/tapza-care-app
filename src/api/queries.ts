import { useQuery } from '@tanstack/react-query';
import { api } from './endpoints';

// React Query hooks for the API. Screens use these instead of calling `api` directly,
// so loading, errors and caching work the same everywhere.

export function useDoctors() {
  return useQuery({ queryKey: ['doctors'], queryFn: api.getDoctors });
}

// Slots for one doctor on one day. Does nothing until both are known.
export function useSlots(doctorId: string, date: string | null) {
  return useQuery({
    queryKey: ['slots', doctorId, date],
    queryFn: () => api.getSlots(doctorId, date ?? ''),
    enabled: date !== null,
  });
}

export function usePrescriptions() {
  return useQuery({ queryKey: ['prescriptions'], queryFn: api.getPrescriptions });
}
