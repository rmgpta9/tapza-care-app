import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Appearance = 'system' | 'light' | 'dark';
export type Language = 'en' | 'hi' | 'te';

// Start in Hindi or Telugu if that's the phone's language; otherwise English.
function phoneLanguage(): Language {
  const code = getLocales()[0]?.languageCode;
  return code === 'hi' || code === 'te' ? code : 'en';
}

interface Settings {
  appearance: Appearance;
  language: Language;
  remindersOn: boolean;
  setAppearance: (appearance: Appearance) => void;
  setLanguage: (language: Language) => void;
  setRemindersOn: (on: boolean) => void;
}

export const useSettings = create<Settings>()(
  persist(
    (set) => ({
      appearance: 'system',
      language: phoneLanguage(),
      remindersOn: false,
      setAppearance: (appearance) => set({ appearance }),
      setLanguage: (language) => set({ language }),
      setRemindersOn: (remindersOn) => set({ remindersOn }),
    }),
    {
      name: 'tapza-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ appearance, language, remindersOn }) => ({ appearance, language, remindersOn }),
      skipHydration: true, // loaded on startup in src/store/loadSavedData.ts
    },
  ),
);
