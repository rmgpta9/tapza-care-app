// Sizes used across the app. Colours are not here; they come from the config.

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

// A little bigger than usual, because many of our users are older.
export const fontSizes = {
  small: 13,
  body: 16,
  large: 18,
  title: 22,
  hero: 28,
};

// Minimum height for anything tappable (accessibility guideline is 44-48).
export const TAP_TARGET = 48;

// Text still grows with the phone's font setting, up to this much.
export const MAX_FONT_SCALE = 1.6;
