import { parseGradient, validateLayoutConfig } from '@/config/validate';
import { buildTheme } from '@/theme/buildTheme';
import { contrastRatio } from '@/theme/color';

const validConfig = {
  version: 1,
  theme: {
    primary: '#0F766E',
    secondary: '#155E75',
    background: '#F6F8F7',
    surface: '#FFFFFF',
    textPrimary: '#14211F',
    textSecondary: '#53625F',
    accent: '#F59E0B',
  },
  tabs: [
    { id: 'home', label: 'Home', icon: 'home-outline', screen: 'home' },
    { id: 'profile', label: 'Profile', icon: 'person-outline', screen: 'profile' },
  ],
  sections: [
    { id: 'offer', type: 'offer_strip', background: { kind: 'color', value: '#FFF4E5' }, title: 'Offer', items: [] },
    { id: 'future', type: 'video_story', background: { kind: 'color', value: '#FFFFFF' }, title: 'New', items: [] },
  ],
};

describe('validateLayoutConfig', () => {
  it('accepts a valid config and keeps unknown section types for the renderer to skip', () => {
    const result = validateLayoutConfig(validConfig);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.config.sections.map((s) => s.type)).toEqual(['offer_strip', 'video_story']);
  });

  it('rejects non-objects and bad theme colours', () => {
    expect(validateLayoutConfig(null).ok).toBe(false);
    const bad = validateLayoutConfig({ ...validConfig, theme: { ...validConfig.theme, primary: 'teal' } });
    expect(bad.ok).toBe(false);
    if (bad.ok) return;
    expect(bad.errors.join()).toContain('theme.primary');
  });

  it('drops malformed sections and duplicate ids but keeps the rest', () => {
    const result = validateLayoutConfig({
      ...validConfig,
      sections: [
        validConfig.sections[0],
        { id: 'broken', type: 'offer_strip', background: { kind: 'color', value: 'red' } },
        { ...validConfig.sections[0] },
        'not a section',
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.config.sections).toHaveLength(1);
    expect(result.warnings.length).toBeGreaterThanOrEqual(3);
  });

  it('always keeps home and profile tabs reachable', () => {
    const result = validateLayoutConfig({ ...validConfig, tabs: [] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.config.tabs.map((t) => t.screen)).toEqual(['home', 'profile']);
  });

  it('warns on unreadable text contrast', () => {
    const result = validateLayoutConfig({
      ...validConfig,
      theme: { ...validConfig.theme, textPrimary: '#EEEEEE' },
    });
    expect(result.warnings.join()).toContain('contrast');
  });
});

describe('parseGradient', () => {
  it('parses stops with and without an angle', () => {
    expect(parseGradient('#FFFFFF,#000000')).toEqual({ angle: 180, colors: ['#FFFFFF', '#000000'] });
    expect(parseGradient('135deg,#FFF,#000')?.angle).toBe(135);
    expect(parseGradient('#FFFFFF')).toBeNull();
  });
});

describe('buildTheme', () => {
  it('derives readable on-colours in light and dark', () => {
    const result = validateLayoutConfig(validConfig);
    if (!result.ok) throw new Error('fixture invalid');
    for (const scheme of ['light', 'dark'] as const) {
      const { colors } = buildTheme(result.config.theme, scheme);
      expect(contrastRatio(colors.onPrimary, colors.primary)).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(colors.textPrimary, colors.surface)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
