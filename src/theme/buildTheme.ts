import type { FestivalInfo, ThemeConfig, ThemePalette } from '@/config/types';
import { BLACK, DEFAULT_DARK, DEFAULT_LIGHT, STATUS_COLORS, WHITE, withOpacity } from './colors';
import { fontSizes, radius, spacing } from './tokens';

export type ColorScheme = 'light' | 'dark';

export interface Theme {
  scheme: ColorScheme;
  colors: ReturnType<typeof makeColors>;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSizes: typeof fontSizes;
  festival: FestivalInfo | null;
}

export type ThemeColors = Theme['colors'];

function pickPalette(config: ThemeConfig | null, scheme: ColorScheme): ThemePalette {
  if (scheme === 'dark') {
    return config?.dark ?? DEFAULT_DARK;
  }
  if (!config) return DEFAULT_LIGHT;
  return {
    primary: config.primary,
    secondary: config.secondary,
    background: config.background,
    surface: config.surface,
    textPrimary: config.textPrimary,
    textSecondary: config.textSecondary,
    accent: config.accent,
  };
}

// The 7 config colours, plus a few lighter versions of them for backgrounds and borders.
function makeColors(palette: ThemePalette, scheme: ColorScheme) {
  const status = STATUS_COLORS[scheme];
  return {
    ...palette,
    onPrimary: WHITE,
    primarySoft: withOpacity(palette.primary, 0.12),
    accentSoft: withOpacity(palette.accent, 0.16),
    border: withOpacity(palette.textPrimary, 0.12),
    skeleton: withOpacity(palette.textPrimary, 0.08),
    overlay: withOpacity(BLACK, 0.5),
    shadow: BLACK,
    success: status.success,
    successSoft: withOpacity(status.success, 0.14),
    danger: status.danger,
    dangerSoft: withOpacity(status.danger, 0.14),
    warning: status.warning,
    warningSoft: withOpacity(status.warning, 0.14),
  };
}

export function buildTheme(config: ThemeConfig | null, scheme: ColorScheme): Theme {
  return {
    scheme,
    colors: makeColors(pickPalette(config, scheme), scheme),
    spacing,
    radius,
    fontSizes,
    festival: config?.festival ?? null,
  };
}
