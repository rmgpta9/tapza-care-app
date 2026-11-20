import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Switches for the fake backend, shown in Profile -> Demo controls.
// Saved on the phone so a demo setup survives an app restart.

export type ConfigVariant = 'normal' | 'festival' | 'custom';
export type NetworkSpeed = 'fast' | 'slow' | 'very_slow';
export type FailureMode = 'none' | 'config' | 'flaky' | 'all';

export const DELAY_MS: Record<NetworkSpeed, number> = {
  fast: 300,
  slow: 2500,
  very_slow: 6000,
};

export interface MockControls {
  configVariant: ConfigVariant;
  customConfig: unknown; // JSON typed into the config editor (used when variant is 'custom')
  speed: NetworkSpeed;
  failure: FailureMode;
  emptyLists: boolean; // doctors, slots and prescriptions come back empty
  offline: boolean; // every request fails as if there is no signal
  forceSlotTaken: boolean; // the next booking gets "slot taken" (409), then this turns off
}

export const DEFAULT_CONTROLS: MockControls = {
  configVariant: 'normal',
  customConfig: null,
  speed: 'fast',
  failure: 'none',
  emptyLists: false,
  offline: false,
  forceSlotTaken: false,
};

interface MockControlsStore extends MockControls {
  update: (changes: Partial<MockControls>) => void;
  reset: () => void;
}

export const useMockControls = create<MockControlsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_CONTROLS,
      update: (changes) => set(changes),
      reset: () => set(DEFAULT_CONTROLS),
    }),
    {
      name: 'tapza-mock-controls',
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: true, // loaded on startup in src/store/loadSavedData.ts
    },
  ),
);
