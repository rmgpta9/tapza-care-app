import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useLayoutConfig } from '@/config/ConfigProvider';
import { useSettings } from '@/store/settings';
import { buildTheme, type Theme } from './buildTheme';

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { config } = useLayoutConfig();
  const appearance = useSettings((s) => s.appearance);
  const phoneScheme = useColorScheme();

  const scheme = appearance === 'system' ? (phoneScheme === 'dark' ? 'dark' : 'light') : appearance;
  const theme = buildTheme(config.theme, scheme);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used inside <ThemeProvider>');
  return theme;
}
