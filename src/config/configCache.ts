import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { LayoutConfig } from './types';

// Keeps the last config that loaded successfully, saved on the phone.
// If the next fetch fails, the app shows this one instead.
interface ConfigCache {
  config: LayoutConfig | null;
  save: (config: LayoutConfig) => void;
  clear: () => void;
}

export const useConfigCache = create<ConfigCache>()(
  persist(
    (set) => ({
      config: null,
      save: (config) => set({ config }),
      clear: () => set({ config: null }),
    }),
    {
      name: 'tapza-config-cache',
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: true, // loaded on startup in src/store/loadSavedData.ts
    },
  ),
);
