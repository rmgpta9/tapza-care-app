import type { ThemePalette } from '@/config/types';

/**
 * The ONLY place in app code where literal colours live.
 *
 * - FALLBACK_PALETTE paints the app before any config has ever loaded (first
 *   launch, offline, nothing cached). It matches the bundled default config.
 * - SEMANTIC holds status colours (success / danger / warning). They mean the
 *   same thing on every festival, so they are not remote-configurable.
 * - NEUTRAL anchors are used for mixing (tints, shades, dark-mode derivation).
 */
export const FALLBACK_PALETTE: ThemePalette = {
  primary: '#0F766E',
  secondary: '#155E75',
  background: '#F6F8F7',
  surface: '#FFFFFF',
  textPrimary: '#14211F',
  textSecondary: '#53625F',
  accent: '#F59E0B',
};

export const SEMANTIC = {
  light: { success: '#15803D', danger: '#B42318', warning: '#B45309' },
  dark: { success: '#4ADE80', danger: '#F97066', warning: '#FBBF24' },
} as const;

export const NEUTRAL = {
  white: '#FFFFFF',
  black: '#000000',
  /** Base for dark surfaces when the config gives no dark palette. */
  ink: '#0E1514',
} as const;
