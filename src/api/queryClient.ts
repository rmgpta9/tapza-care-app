import { QueryClient } from '@tanstack/react-query';

// One React Query client for the whole app. It lives in its own file so code
// outside React (like the bookings store) can refresh data after a booking.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});
