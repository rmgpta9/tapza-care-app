import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Remembers which doses the user has marked as taken, saved on the phone.
// Keys include the date (see doseKey), so every day starts fresh.
interface DosesStore {
  taken: Record<string, boolean>;
  toggleDose: (key: string) => void;
}

export const useDoses = create<DosesStore>()(
  persist(
    (set) => ({
      taken: {},
      toggleDose: (key) => set((state) => ({ taken: { ...state.taken, [key]: !state.taken[key] } })),
    }),
    {
      name: 'tapza-doses',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ taken: state.taken }),
      skipHydration: true, // loaded on startup in src/store/loadSavedData.ts
    },
  ),
);
