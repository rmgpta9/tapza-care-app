import { useQuery } from '@tanstack/react-query';
import { api } from './endpoints';

// React Query hooks for the API. Screens use these instead of calling `api` directly,
// so loading, errors and caching work the same everywhere.

export function useDoctors() {
  return useQuery({ queryKey: ['doctors'], queryFn: api.getDoctors });
}
