import type { LayoutConfig, SectionConfig, TabConfig, ThemeConfig, ThemePalette } from './types';

// The config comes from a server, so we never trust it. This file checks it
// before the app uses it.
//
// Rules:
//  - If the theme or sections list is broken, reject the whole config.
//    The app then keeps showing the last good one.
//  - If one section is broken, drop just that section.
//  - Sections with an unknown `type` are kept. The home screen skips them,
//    so an old app version doesn't crash on a section type added later.

export type ValidationResult = { ok: true; config: LayoutConfig } | { ok: false; error: string };

export const DEFAULT_TABS: TabConfig[] = [
  { id: 'home', label: 'Home', icon: 'home-outline', screen: 'home' },
  { id: 'bookings', label: 'Bookings', icon: 'calendar-outline', screen: 'bookings' },
  { id: 'rx', label: 'Medicines', icon: 'medkit-outline', screen: 'prescriptions' },
  { id: 'profile', label: 'Profile', icon: 'person-circle-outline', screen: 'profile' },
];

const COLOR_KEYS = ['primary', 'secondary', 'background', 'surface', 'textPrimary', 'textSecondary', 'accent'];
const SCREENS = ['home', 'bookings', 'prescriptions', 'profile'];
const BACKGROUND_KINDS = ['color', 'gradient', 'image'];

type AnyObject = Record<string, unknown>;

function isObject(value: unknown): value is AnyObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

// We only accept the 6-digit form: "#0F766E".
function isColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

function isPalette(value: unknown): value is ThemePalette {
  return isObject(value) && COLOR_KEYS.every((key) => isColor(value[key]));
}

function readTheme(value: unknown): ThemeConfig | null {
  if (!isObject(value) || !isPalette(value)) return null;

  const theme: ThemeConfig = {
    primary: value.primary,
    secondary: value.secondary,
    background: value.background,
    surface: value.surface,
    textPrimary: value.textPrimary,
    textSecondary: value.textSecondary,
    accent: value.accent,
  };

  if (isPalette(value.dark)) theme.dark = value.dark;

  const festival = value.festival;
  if (isObject(festival) && isText(festival.name) && isText(festival.greeting)) {
    theme.festival = {
      name: festival.name,
      greeting: festival.greeting,
      bannerImageUrl: isText(festival.bannerImageUrl) ? festival.bannerImageUrl : '',
    };
  }
  return theme;
}

function isTab(value: unknown): value is TabConfig {
  return (
    isObject(value) &&
    isText(value.id) &&
    isText(value.label) &&
    isText(value.icon) &&
    SCREENS.includes(value.screen as string)
  );
}

function readTabs(value: unknown): TabConfig[] {
  const tabs = Array.isArray(value) ? value.filter(isTab) : [];
  return tabs.length > 0 ? tabs : DEFAULT_TABS;
}

function readSection(value: unknown): SectionConfig | null {
  if (!isObject(value) || !isText(value.id) || !isText(value.type)) return null;

  const bg = value.background;
  if (!isObject(bg) || !BACKGROUND_KINDS.includes(bg.kind as string) || !isText(bg.value)) return null;

  return {
    id: value.id,
    type: value.type,
    background: { kind: bg.kind as SectionConfig['background']['kind'], value: bg.value },
    title: typeof value.title === 'string' ? value.title : '',
    items: Array.isArray(value.items) ? value.items : [],
    columns: typeof value.columns === 'number' ? value.columns : undefined,
  };
}

export function validateLayoutConfig(data: unknown): ValidationResult {
  if (!isObject(data)) return { ok: false, error: 'Config is not an object' };
  if (typeof data.version !== 'number') return { ok: false, error: 'version must be a number' };

  const theme = readTheme(data.theme);
  if (!theme) return { ok: false, error: 'theme colours are missing or not in #RRGGBB format' };

  if (!Array.isArray(data.sections)) return { ok: false, error: 'sections must be a list' };

  const sections: SectionConfig[] = [];
  for (const raw of data.sections) {
    const section = readSection(raw);
    const isDuplicate = section && sections.some((s) => s.id === section.id);
    if (section && !isDuplicate) sections.push(section);
  }

  return {
    ok: true,
    config: { version: data.version, theme, tabs: readTabs(data.tabs), sections },
  };
}
