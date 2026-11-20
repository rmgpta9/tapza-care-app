import { useMockControls } from '@/api/mock/controls';
import { useConfigCache } from '@/config/configCache';
import { useSettings } from './settings';

// Reads everything we saved on the phone (settings, last config, demo switches).
// The app waits for this before showing the first screen, so it opens with
// the right colours instead of flashing the default ones.
export async function loadSavedData(): Promise<void> {
  await Promise.all([
    useSettings.persist.rehydrate(),
    useConfigCache.persist.rehydrate(),
    useMockControls.persist.rehydrate(),
  ]);
}
