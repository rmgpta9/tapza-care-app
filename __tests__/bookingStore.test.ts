import { DEFAULT_CONTROLS, useMockControls } from '@/api/mock/controls';
import { handleRequest, resetMockServer } from '@/api/mock/server';
import type { Slot } from '@/api/types';
import { newBookingId, useBookings, type NewBooking } from '@/store/bookings';
import { addDays, dayOfWeek, today } from '@/utils/date';

// The next weekday (Mon-Fri) after today, so the clinic is open.
function nextWeekday(): string {
  let date = addDays(today(), 1);
  while (dayOfWeek(date) === 0 || dayOfWeek(date) === 6) date = addDays(date, 1);
  return date;
}

async function aFreeSlot(): Promise<Slot> {
  const response = await handleRequest('GET', `/slots?doctorId=d1&date=${nextWeekday()}`);
  const slot = (response.body as Slot[]).find((s) => s.available);
  if (!slot) throw new Error('no free slot');
  return slot;
}

function newBooking(slot: Slot): NewBooking {
  return {
    id: newBookingId(),
    doctorId: 'd1',
    doctorName: 'Dr. Lakshmi Narayana Rao',
    specialty: 'General Physician',
    slotId: slot.id,
    startsAt: slot.startsAt,
    priceInr: 500,
  };
}

function findBooking(id: string) {
  return useBookings.getState().bookings.find((b) => b.id === id);
}

beforeEach(() => {
  useMockControls.setState(DEFAULT_CONTROLS);
  useBookings.setState({ bookings: [] });
  resetMockServer();
});

describe('booking store', () => {
  it('shows the booking as "confirming" straight away, then "confirmed"', async () => {
    const booking = newBooking(await aFreeSlot());

    const request = useBookings.getState().bookSlot(booking);
    expect(findBooking(booking.id)?.status).toBe('confirming'); // before the server answers

    await request;
    expect(findBooking(booking.id)?.status).toBe('confirmed');
    expect(findBooking(booking.id)?.serverId).toMatch(/^BK-/);
  });

  it('marks the booking "failed: slot_taken" when the server says 409', async () => {
    const booking = newBooking(await aFreeSlot());
    useMockControls.setState({ forceSlotTaken: true });

    await useBookings.getState().bookSlot(booking);
    expect(findBooking(booking.id)).toMatchObject({ status: 'failed', failure: 'slot_taken' });
  });

  it('marks the booking "failed: other" when there is no connection', async () => {
    const booking = newBooking(await aFreeSlot());
    useMockControls.setState({ offline: true });

    await useBookings.getState().bookSlot(booking);
    expect(findBooking(booking.id)).toMatchObject({ status: 'failed', failure: 'other' });
  });

  it('removes a booking', async () => {
    const booking = newBooking(await aFreeSlot());
    await useBookings.getState().bookSlot(booking);

    useBookings.getState().removeBooking(booking.id);
    expect(findBooking(booking.id)).toBeUndefined();
  });
});
