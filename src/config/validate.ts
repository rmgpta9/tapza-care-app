import {
  isFiniteNumber,
  isHexColor,
  isHttpUrl,
  isNonEmptyString,
  isRecord,
  type UnknownRecord,
} from '@/lib/guards';
import { contrastRatio } from '@/theme/color';
import {
  BACKGROUND_KINDS,
  PALETTE_KEYS,
  SCREEN_IDS,
  type FestivalInfo,
  type LayoutConfig,
  type ScreenId,
  type SectionBackground,
  type SectionConfig,
  type TabConfig,
  type ThemeConfig,
  type ThemePalette,
} from './types';

/**
 * Validation policy
 * - Fatal (config rejected, last good config stays): missing version, bad theme
 *   colours, no sections array. Rendering with a broken theme is worse than
 *   rendering yesterday's home.
 * - Recoverable (warning, item dropped): a malformed section or tab.
 * - Unknown section types are KEPT. The renderer skips them, so an older app
 *   build simply ignores section types it does not know yet.
 */
export type ValidationResult =
  | { ok: true; config: LayoutConfig; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

const MIN_TEXT_CONTRAST = 4.5;

export const DEFAULT_TABS: TabConfig[] = [
  { id: 'home', label: 'Home', icon: 'home-outline', screen: 'home' },
  { id: 'bookings', label: 'Bookings', icon: 'calendar-outline', screen: 'bookings' },
  { id: 'rx', label: 'Medicines', icon: 'medkit-outline', screen: 'prescriptions' },
  { id: 'profile', label: 'Profile', icon: 'person-circle-outline', screen: 'profile' },
];

export function validateLayoutConfig(input: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(input)) {
    return { ok: false, errors: ['Config must be a JSON object'], warnings };
  }

  if (!isFiniteNumber(input.version)) errors.push('version must be a number');

  const theme = parseTheme(input.theme, errors, warnings);
  const tabs = parseTabs(input.tabs, warnings);

  if (!Array.isArray(input.sections)) {
    errors.push('sections must be an array');
  }

  if (errors.length > 0 || theme === null) {
    return { ok: false, errors, warnings };
  }

  const sections: SectionConfig[] = [];
  const seenIds = new Set<string>();
  (input.sections as unknown[]).forEach((raw, index) => {
    const section = parseSection(raw, index, warnings);
    if (!section) return;
    if (seenIds.has(section.id)) {
      warnings.push(`sections[${index}]: duplicate id "${section.id}" dropped`);
      return;
    }
    seenIds.add(section.id);
    sections.push(section);
  });

  return {
    ok: true,
    config: { version: input.version as number, theme, tabs, sections },
    warnings,
  };
}

function parsePalette(
  raw: UnknownRecord,
  path: string,
  errors: string[],
  required: boolean,
): Partial<ThemePalette> {
  const palette: Partial<ThemePalette> = {};
  for (const key of PALETTE_KEYS) {
    const value = raw[key];
    if (value === undefined && !required) continue;
    if (!isHexColor(value)) {
      errors.push(`${path}.${key} must be a hex colour, got ${JSON.stringify(value)}`);
      continue;
    }
    palette[key] = value;
  }
  return palette;
}

function isCompletePalette(p: Partial<ThemePalette>): p is ThemePalette {
  return PALETTE_KEYS.every((k) => typeof p[k] === 'string');
}

function checkContrast(p: ThemePalette, path: string, warnings: string[]) {
  const pairs: [keyof ThemePalette, keyof ThemePalette][] = [
    ['textPrimary', 'background'],
    ['textPrimary', 'surface'],
  ];
  for (const [fg, bg] of pairs) {
    const ratio = contrastRatio(p[fg], p[bg]);
    if (ratio < MIN_TEXT_CONTRAST) {
      warnings.push(`${path}: ${fg} on ${bg} contrast is ${ratio.toFixed(2)} (< ${MIN_TEXT_CONTRAST})`);
    }
  }
}

function parseTheme(raw: unknown, errors: string[], warnings: string[]): ThemeConfig | null {
  if (!isRecord(raw)) {
    errors.push('theme must be an object');
    return null;
  }
  const palette = parsePalette(raw, 'theme', errors, true);
  if (!isCompletePalette(palette)) return null;
  checkContrast(palette, 'theme', warnings);

  const theme: ThemeConfig = { ...palette };

  if (raw.festival !== undefined && raw.festival !== null) {
    const festival = parseFestival(raw.festival);
    if (festival) theme.festival = festival;
    else warnings.push('theme.festival is malformed and was ignored');
  }

  if (isRecord(raw.dark)) {
    const darkErrors: string[] = [];
    const dark = parsePalette(raw.dark, 'theme.dark', darkErrors, false);
    if (darkErrors.length > 0) warnings.push(...darkErrors.map((e) => `${e} (dark palette ignored)`));
    else theme.dark = dark;
  }

  return theme;
}

function parseFestival(raw: unknown): FestivalInfo | null {
  if (!isRecord(raw)) return null;
  if (!isNonEmptyString(raw.name) || !isNonEmptyString(raw.greeting)) return null;
  return {
    name: raw.name,
    greeting: raw.greeting,
    bannerImageUrl: isHttpUrl(raw.bannerImageUrl) ? raw.bannerImageUrl : '',
  };
}

function parseTabs(raw: unknown, warnings: string[]): TabConfig[] {
  if (!Array.isArray(raw)) {
    warnings.push('tabs missing, using default tabs');
    return DEFAULT_TABS;
  }
  const tabs: TabConfig[] = [];
  const seenScreens = new Set<ScreenId>();
  raw.forEach((t, i) => {
    if (
      !isRecord(t) ||
      !isNonEmptyString(t.id) ||
      !isNonEmptyString(t.label) ||
      !isNonEmptyString(t.icon) ||
      !SCREEN_IDS.includes(t.screen as ScreenId)
    ) {
      warnings.push(`tabs[${i}] is malformed and was dropped`);
      return;
    }
    const screen = t.screen as ScreenId;
    if (seenScreens.has(screen)) {
      warnings.push(`tabs[${i}]: screen "${screen}" already has a tab`);
      return;
    }
    seenScreens.add(screen);
    tabs.push({ id: t.id, label: t.label, icon: t.icon, screen });
  });

  // Home and Profile (which hosts settings) must always be reachable.
  for (const required of ['home', 'profile'] as const) {
    if (!seenScreens.has(required)) {
      warnings.push(`tabs: "${required}" tab is required and was added`);
      const fallback = DEFAULT_TABS.find((d) => d.screen === required);
      if (fallback) {
        if (required === 'home') tabs.unshift(fallback);
        else tabs.push(fallback);
      }
    }
  }
  return tabs;
}

export function parseBackground(raw: unknown): SectionBackground | null {
  if (!isRecord(raw)) return null;
  const kind = raw.kind;
  const value = raw.value;
  if (!BACKGROUND_KINDS.includes(kind as SectionBackground['kind'])) return null;
  if (typeof value !== 'string') return null;
  if (kind === 'color' && !isHexColor(value)) return null;
  if (kind === 'gradient' && parseGradient(value) === null) return null;
  if (kind === 'image' && !isHttpUrl(value)) return null;
  return { kind: kind as SectionBackground['kind'], value };
}

/** "135deg,#a,#b" or "#a,#b" → { angle, colors }. Needs at least two stops. */
export function parseGradient(value: string): { angle: number; colors: string[] } | null {
  const parts = value.split(',').map((p) => p.trim()).filter(Boolean);
  let angle = 180;
  const first = parts[0];
  if (first !== undefined && /^-?\d+(\.\d+)?deg$/.test(first)) {
    angle = parseFloat(first);
    parts.shift();
  }
  if (parts.length < 2 || !parts.every(isHexColor)) return null;
  return { angle, colors: parts };
}

function parseSection(raw: unknown, index: number, warnings: string[]): SectionConfig | null {
  const where = `sections[${index}]`;
  if (!isRecord(raw)) {
    warnings.push(`${where} is not an object`);
    return null;
  }
  if (!isNonEmptyString(raw.id) || !isNonEmptyString(raw.type)) {
    warnings.push(`${where} needs a string id and type`);
    return null;
  }
  const background = parseBackground(raw.background);
  if (!background) {
    warnings.push(`${where} ("${raw.id}") has an invalid background and was dropped`);
    return null;
  }
  const section: SectionConfig = {
    id: raw.id,
    type: raw.type,
    background,
    title: typeof raw.title === 'string' ? raw.title : '',
    items: Array.isArray(raw.items) ? raw.items : [],
  };
  if (raw.columns === 2 || raw.columns === 3) section.columns = raw.columns;
  return section;
}
