/**
 * The remote layout contract. Shapes mirror the assignment spec; optional
 * fields are additive so a "spec-only" config still validates.
 */

export type ScreenId = 'home' | 'bookings' | 'prescriptions' | 'profile';
export const SCREEN_IDS: readonly ScreenId[] = ['home', 'bookings', 'prescriptions', 'profile'];

export type BackgroundKind = 'color' | 'gradient' | 'image';
export const BACKGROUND_KINDS: readonly BackgroundKind[] = ['color', 'gradient', 'image'];

export interface SectionBackground {
  kind: BackgroundKind;
  /**
   * color:    "#RRGGBB"
   * gradient: "#RRGGBB,#RRGGBB[,...]" (top → bottom), optional leading angle "135deg,"
   * image:    https URL
   */
  value: string;
}

export interface ThemePalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
}

export const PALETTE_KEYS: readonly (keyof ThemePalette)[] = [
  'primary',
  'secondary',
  'background',
  'surface',
  'textPrimary',
  'textSecondary',
  'accent',
];

export interface FestivalInfo {
  name: string;
  greeting: string;
  bannerImageUrl: string;
}

export interface ThemeConfig extends ThemePalette {
  /** Present only on festival days. */
  festival?: FestivalInfo;
  /** Optional dark palette. Missing keys are derived from the light palette. */
  dark?: Partial<ThemePalette>;
}

export interface TabConfig {
  id: string;
  label: string;
  /** Ionicons glyph name. Unknown names fall back to a neutral glyph. */
  icon: string;
  screen: ScreenId;
}

export interface SectionConfig {
  id: string;
  type: string;
  background: SectionBackground;
  title: string;
  /** Validated per section type by the renderer registry. */
  items: unknown[];
  /** Optional layout hint for grid sections. */
  columns?: 2 | 3;
}

export interface LayoutConfig {
  version: number;
  theme: ThemeConfig;
  tabs: TabConfig[];
  sections: SectionConfig[];
}
