import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Appearance = 'system' | 'light' | 'dark';

interface Settings {
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
}

export const useSettings = create<Settings>()(
  persist(
    (set) => ({
      appearance: 'system',
      setAppearance: (appearance) => set({ appearance }),
    }),
    {
      name: 'tapza-settings',
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: true, // loaded on startup in src/store/loadSavedData.ts
    },
  ),
);
