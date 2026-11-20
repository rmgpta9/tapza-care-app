import type { ThemePalette } from '@/config/types';

// This is the only file with hard-coded colours.

// Used before any config has loaded.
export const DEFAULT_LIGHT: ThemePalette = {
  primary: '#0F766E',
  secondary: '#155E75',
  background: '#F6F8F7',
  surface: '#FFFFFF',
  textPrimary: '#14211F',
  textSecondary: '#53625F',
  accent: '#F59E0B',
};

// Used in dark mode when the config doesn't send a dark palette.
export const DEFAULT_DARK: ThemePalette = {
  primary: '#0D9488',
  secondary: '#0E7490',
  background: '#0B1413',
  surface: '#14211F',
  textPrimary: '#E8F1EF',
  textSecondary: '#A3B5B1',
  accent: '#FBBF24',
};

// Green/red/amber mean the same thing on every festival, so they aren't in the config.
export const STATUS_COLORS = {
  light: { success: '#15803D', danger: '#B42318', warning: '#B45309' },
  dark: { success: '#4ADE80', danger: '#F97066', warning: '#FBBF24' },
};

export const WHITE = '#FFFFFF';
export const BLACK = '#000000';

// Adds transparency to a colour: withOpacity('#0F766E', 0.12) -> '#0F766E1F'.
// The last two hex digits of an 8-digit colour are its opacity (00 to FF).
export function withOpacity(hex: string, opacity: number): string {
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return hex.slice(0, 7) + alpha;
}
