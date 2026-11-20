import type { TextStyle } from 'react-native';

/**
 * Non-colour design tokens. Colours never live here: they come from the remote
 * config via buildTheme(). Components read all of these through useTheme().
 */

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

type TypeStyle = Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'>;

/**
 * Sizes are deliberately a notch larger than typical consumer apps: many of our
 * users are older. OS font scaling is respected on top of these.
 */
export const typography = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.4 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.2 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
  subheading: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 23, fontWeight: '600' },
  label: { fontSize: 14, lineHeight: 19, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 0.4 },
} as const satisfies Record<string, TypeStyle>;

export type TypographyVariant = keyof typeof typography;

export const sizes = {
  /** WCAG / Material minimum is 44–48. We use 48 everywhere. */
  minTapTarget: 48,
  iconSm: 16,
  iconMd: 22,
  iconLg: 28,
  avatarSm: 40,
  avatarMd: 56,
  avatarLg: 72,
  maxFontScale: 1.6,
} as const;

export const motion = {
  fast: 160,
  base: 260,
  slow: 420,
  reveal: 480,
  spring: { damping: 20, stiffness: 220, mass: 0.9 },
  sheetSpring: { damping: 26, stiffness: 260, mass: 0.9 },
} as const;

export const elevation = {
  card: { shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  raised: { shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
} as const;
