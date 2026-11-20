import { NetworkError } from '@/api/errors';
import type { Booking, Doctor } from '@/api/types';
import { addDays, today } from '@/utils/date';
import { DELAY_MS, useMockControls, type MockControls } from './controls';
import { DIWALI_CONFIG, NORMAL_CONFIG } from './data/configs';
import { DOCTORS } from './data/doctors';
import { buildPrescriptions } from './data/prescriptions';
import { generateSlots, readSlotId } from './data/slots';

// A fake backend that runs inside the app. It answers the same 5 endpoints a
// real server would, so the rest of the app can't tell the difference.

export interface MockResponse {
  status: number;
  body: unknown;
}

// Slots booked through the app. Kept in memory, so they reset when the app restarts.
const bookedSlotIds = new Set<string>();
let nextBookingNumber = 4101;

export function resetMockServer() {
  bookedSlotIds.clear();
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ok(body: unknown, status = 200): MockResponse {
  return { status, body };
}

function fail(status: number, message: string): MockResponse {
  return { status, body: { message } };
}

// "/slots?doctorId=d1&date=2026-11-21" -> { path: "/slots", params: { doctorId: "d1", date: "2026-11-21" } }
function splitUrl(url: string): { path: string; params: Record<string, string> } {
  const [path = '', query = ''] = url.split('?');
  const params: Record<string, string> = {};
  for (const pair of query.split('&')) {
    const [key, value] = pair.split('=');
    if (key) params[key] = decodeURIComponent(value ?? '');
  }
  return { path, params };
}

function shouldFail(path: string, failure: MockControls['failure']): boolean {
  if (failure === 'all') return true;
  if (failure === 'config') return path === '/config';
  if (failure === 'flaky') return Math.random() < 0.3;
  return false;
}

function getSlotsWithBookings(doctorId: string, date: string) {
  return generateSlots(doctorId, date).map((slot) =>
    bookedSlotIds.has(slot.id) ? { ...slot, available: false } : slot,
  );
}

function findNextFreeSlot(doctorId: string): string | null {
  for (let i = 0; i < 7; i++) {
    const free = getSlotsWithBookings(doctorId, addDays(today(), i)).find((s) => s.available);
    if (free) return free.startsAt;
  }
  return null;
}

// ---- Endpoints ----

function getConfig(controls: MockControls): MockResponse {
  if (controls.configVariant === 'festival') return ok(DIWALI_CONFIG);
  if (controls.configVariant === 'custom' && controls.customConfig) return ok(controls.customConfig);
  return ok(NORMAL_CONFIG);
}

function getDoctors(controls: MockControls): MockResponse {
  if (controls.emptyLists) return ok([]);
  const doctors: Doctor[] = DOCTORS.map((d) => ({ ...d, nextAvailableAt: findNextFreeSlot(d.id) }));
  return ok(doctors);
}

function getSlots(controls: MockControls, params: Record<string, string>): MockResponse {
  const { doctorId, date } = params;
  if (!doctorId || !date) return fail(400, 'doctorId and date are required');
  if (controls.emptyLists) return ok([]);
  return ok(getSlotsWithBookings(doctorId, date));
}

function createBooking(controls: MockControls, body: unknown): MockResponse {
  const { doctorId, slotId } = (body ?? {}) as { doctorId?: string; slotId?: string };
  if (!doctorId || !slotId) return fail(400, 'doctorId and slotId are required');

  // Demo switch: pretend someone else just took this slot. Only once.
  if (controls.forceSlotTaken) {
    useMockControls.getState().update({ forceSlotTaken: false });
    return fail(409, 'Someone just booked this slot');
  }

  const { date } = readSlotId(slotId);
  const slot = getSlotsWithBookings(doctorId, date).find((s) => s.id === slotId);
  if (!slot) return fail(404, 'Slot not found');
  if (!slot.available) return fail(409, 'Someone just booked this slot');

  bookedSlotIds.add(slot.id);
  const booking: Booking = {
    id: `BK-${nextBookingNumber++}`,
    doctorId,
    slotId,
    startsAt: slot.startsAt,
    endsAt: slot.endsAt,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  return ok(booking, 201);
}

function getPrescriptions(controls: MockControls): MockResponse {
  return ok(controls.emptyLists ? [] : buildPrescriptions());
}

// ---- Entry point ----

export async function handleRequest(method: 'GET' | 'POST', url: string, body?: unknown): Promise<MockResponse> {
  const controls = useMockControls.getState();

  await wait(DELAY_MS[controls.speed]);

  if (controls.offline) throw new NetworkError();

  const { path, params } = splitUrl(url);
  if (shouldFail(path, controls.failure)) return fail(503, 'The clinic server is busy. Please try again.');

  if (method === 'GET' && path === '/config') return getConfig(controls);
  if (method === 'GET' && path === '/doctors') return getDoctors(controls);
  if (method === 'GET' && path === '/slots') return getSlots(controls, params);
  if (method === 'POST' && path === '/bookings') return createBooking(controls, body);
  if (method === 'GET' && path === '/prescriptions') return getPrescriptions(controls);

  return fail(404, `Unknown endpoint: ${method} ${path}`);
}
