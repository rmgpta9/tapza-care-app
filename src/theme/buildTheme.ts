import type { FestivalInfo, ThemeConfig, ThemePalette } from '@/config/types';
import { contrastRatio, isDarkColor, mix, readableOn, withAlpha } from './color';
import { FALLBACK_PALETTE, NEUTRAL, SEMANTIC } from './fallbacks';
import { elevation, motion, radius, sizes, spacing, typography } from './tokens';

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors extends ThemePalette {
  onPrimary: string;
  onSecondary: string;
  onAccent: string;
  primarySoft: string;
  secondarySoft: string;
  accentSoft: string;
  surfaceMuted: string;
  border: string;
  divider: string;
  skeleton: string;
  skeletonHighlight: string;
  scrim: string;
  scrimStrong: string;
  shadow: string;
  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;
  /** Text that sits on images / dark scrims. */
  onImage: string;
  onImageMuted: string;
  transparent: string;
}

export interface Theme {
  scheme: ColorScheme;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  sizes: typeof sizes;
  motion: typeof motion;
  elevation: typeof elevation;
  festival: FestivalInfo | null;
}

/**
 * Dark palette when the config does not provide one: keep brand hues but
 * lift them so they read on a dark ground, and flip the neutrals.
 */
function deriveDark(light: ThemePalette): ThemePalette {
  const background = mix(NEUTRAL.ink, light.primary, 0.06);
  return {
    primary: mix(light.primary, NEUTRAL.white, 0.25),
    secondary: mix(light.secondary, NEUTRAL.white, 0.3),
    background,
    surface: mix(background, NEUTRAL.white, 0.06),
    textPrimary: mix(NEUTRAL.white, light.primary, 0.04),
    textSecondary: mix(NEUTRAL.white, background, 0.32),
    accent: mix(light.accent, NEUTRAL.white, 0.15),
  };
}

/** Make sure a "text" colour still passes on its ground after an admin edit. */
function ensureReadable(fg: string, bg: string, min: number): string {
  if (contrastRatio(fg, bg) >= min) return fg;
  return readableOn(bg, NEUTRAL.white, NEUTRAL.ink);
}

export function buildTheme(config: ThemeConfig | null, scheme: ColorScheme): Theme {
  const light: ThemePalette = config
    ? {
        primary: config.primary,
        secondary: config.secondary,
        background: config.background,
        surface: config.surface,
        textPrimary: config.textPrimary,
        textSecondary: config.textSecondary,
        accent: config.accent,
      }
    : FALLBACK_PALETTE;

  const base: ThemePalette =
    scheme === 'dark' ? { ...deriveDark(light), ...(config?.dark ?? {}) } : light;

  const isDark = scheme === 'dark';
  const semantic = isDark ? SEMANTIC.dark : SEMANTIC.light;
  const softAlpha = isDark ? 0.22 : 0.12;

  const textPrimary = ensureReadable(base.textPrimary, base.surface, 4.5);
  const textSecondary = ensureReadable(base.textSecondary, base.surface, 3.5);

  const colors: ThemeColors = {
    ...base,
    textPrimary,
    textSecondary,
    onPrimary: readableOn(base.primary, NEUTRAL.white, NEUTRAL.ink),
    onSecondary: readableOn(base.secondary, NEUTRAL.white, NEUTRAL.ink),
    onAccent: readableOn(base.accent, NEUTRAL.white, NEUTRAL.ink),
    primarySoft: withAlpha(base.primary, softAlpha),
    secondarySoft: withAlpha(base.secondary, softAlpha),
    accentSoft: withAlpha(base.accent, isDark ? 0.24 : 0.16),
    surfaceMuted: mix(base.surface, base.textPrimary, isDark ? 0.07 : 0.04),
    border: mix(base.surface, base.textPrimary, isDark ? 0.18 : 0.1),
    divider: mix(base.surface, base.textPrimary, isDark ? 0.12 : 0.07),
    skeleton: mix(base.surface, base.textPrimary, isDark ? 0.1 : 0.07),
    skeletonHighlight: mix(base.surface, base.textPrimary, isDark ? 0.18 : 0.12),
    scrim: withAlpha(NEUTRAL.black, 0.45),
    scrimStrong: withAlpha(NEUTRAL.black, 0.65),
    shadow: NEUTRAL.black,
    success: semantic.success,
    successSoft: withAlpha(semantic.success, softAlpha),
    danger: semantic.danger,
    dangerSoft: withAlpha(semantic.danger, softAlpha),
    warning: semantic.warning,
    warningSoft: withAlpha(semantic.warning, softAlpha),
    onImage: NEUTRAL.white,
    onImageMuted: withAlpha(NEUTRAL.white, 0.85),
    transparent: withAlpha(NEUTRAL.black, 0),
  };

  return {
    scheme,
    colors,
    spacing,
    radius,
    typography,
    sizes,
    motion,
    elevation,
    festival: config?.festival ?? null,
  };
}

/** Text colours that read on an arbitrary band background. */
export function textOn(theme: Theme, bg: string): { primary: string; secondary: string } {
  if (isDarkColor(bg) === isDarkColor(theme.colors.surface)) {
    return { primary: theme.colors.textPrimary, secondary: theme.colors.textSecondary };
  }
  const primary = readableOn(bg, NEUTRAL.white, NEUTRAL.ink);
  return { primary, secondary: withAlpha(primary, 0.78) };
}
