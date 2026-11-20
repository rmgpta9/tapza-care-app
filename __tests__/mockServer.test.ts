import { NetworkError } from '@/api/errors';
import { DEFAULT_CONTROLS, useMockControls } from '@/api/mock/controls';
import { DIWALI_CONFIG, NORMAL_CONFIG } from '@/api/mock/data/configs';
import { handleRequest, resetMockServer } from '@/api/mock/server';
import type { Slot } from '@/api/types';
import { validateLayoutConfig } from '@/config/validate';
import { addDays, dayOfWeek, today } from '@/utils/date';

// The next date (after today) that falls on the given weekday. 0 = Sunday, 3 = Wednesday.
function next(weekday: number): string {
  let date = addDays(today(), 1);
  while (dayOfWeek(date) !== weekday) date = addDays(date, 1);
  return date;
}

async function firstFreeSlot(doctorId: string, date: string): Promise<Slot> {
  const response = await handleRequest('GET', `/slots?doctorId=${doctorId}&date=${date}`);
  const slot = (response.body as Slot[]).find((s) => s.available);
  if (!slot) throw new Error('no free slot');
  return slot;
}

beforeEach(() => {
  useMockControls.setState(DEFAULT_CONTROLS);
  resetMockServer();
});

describe('shipped configs', () => {
  it('both the normal and Diwali configs are valid', () => {
    expect(validateLayoutConfig(NORMAL_CONFIG).ok).toBe(true);
    expect(validateLayoutConfig(DIWALI_CONFIG).ok).toBe(true);
  });

  it('Diwali changes colours, banner and section order', () => {
    expect(DIWALI_CONFIG.theme.primary).not.toBe(NORMAL_CONFIG.theme.primary);
    expect(DIWALI_CONFIG.theme.festival.name).toBe('Diwali');
    expect(DIWALI_CONFIG.sections[0]?.type).not.toBe(NORMAL_CONFIG.sections[0]?.type);
  });
});

describe('mock server', () => {
  it('serves the config chosen in demo controls', async () => {
    expect((await handleRequest('GET', '/config')).body).toBe(NORMAL_CONFIG);

    useMockControls.setState({ configVariant: 'festival' });
    expect((await handleRequest('GET', '/config')).body).toBe(DIWALI_CONFIG);
  });

  it('books a free slot (201), and booking it again fails with 409', async () => {
    const slot = await firstFreeSlot('d1', next(3));
    const body = { doctorId: 'd1', slotId: slot.id };

    expect((await handleRequest('POST', '/bookings', body)).status).toBe(201);
    expect((await handleRequest('POST', '/bookings', body)).status).toBe(409);
  });

  it('"next booking: slot taken" fails once, then turns itself off', async () => {
    const slot = await firstFreeSlot('d2', next(4));
    const body = { doctorId: 'd2', slotId: slot.id };
    useMockControls.setState({ forceSlotTaken: true });

    expect((await handleRequest('POST', '/bookings', body)).status).toBe(409);
    expect((await handleRequest('POST', '/bookings', body)).status).toBe(201);
  });

  it('has no slots on Sunday', async () => {
    const response = await handleRequest('GET', `/slots?doctorId=d2&date=${next(0)}`);
    expect(response.body).toEqual([]);
  });

  it('follows the failure, empty and offline switches', async () => {
    useMockControls.setState({ failure: 'config' });
    expect((await handleRequest('GET', '/config')).status).toBe(503);
    expect((await handleRequest('GET', '/doctors')).status).toBe(200);

    useMockControls.setState({ failure: 'none', emptyLists: true });
    expect((await handleRequest('GET', '/prescriptions')).body).toEqual([]);

    useMockControls.setState({ offline: true });
    await expect(handleRequest('GET', '/doctors')).rejects.toBeInstanceOf(NetworkError);
  });
});
