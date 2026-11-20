import { DEFAULT_TABS, validateLayoutConfig } from '@/config/validate';

const goodConfig = {
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
  tabs: [{ id: 'home', label: 'Home', icon: 'home-outline', screen: 'home' }],
  sections: [
    { id: 'offer', type: 'offer_strip', background: { kind: 'color', value: '#FFF4E5' }, title: 'Offer', items: [] },
    { id: 'new', type: 'video_stories', background: { kind: 'color', value: '#FFFFFF' }, title: 'New', items: [] },
  ],
};

describe('validateLayoutConfig', () => {
  it('accepts a good config', () => {
    const result = validateLayoutConfig(goodConfig);
    expect(result.ok).toBe(true);
  });

  it('keeps unknown section types (the home screen skips them)', () => {
    const result = validateLayoutConfig(goodConfig);
    if (!result.ok) throw new Error(result.error);
    expect(result.config.sections.map((s) => s.type)).toEqual(['offer_strip', 'video_stories']);
  });

  it('rejects a config that is not an object', () => {
    expect(validateLayoutConfig(null).ok).toBe(false);
    expect(validateLayoutConfig('hello').ok).toBe(false);
  });

  it('rejects a theme colour that is not #RRGGBB', () => {
    const result = validateLayoutConfig({ ...goodConfig, theme: { ...goodConfig.theme, primary: 'teal' } });
    expect(result.ok).toBe(false);
  });

  it('drops a broken section and a duplicate id, keeps the rest', () => {
    const result = validateLayoutConfig({
      ...goodConfig,
      sections: [
        goodConfig.sections[0],
        { id: 'broken', type: 'offer_strip' }, // no background
        goodConfig.sections[0], // same id again
        'not a section',
      ],
    });
    if (!result.ok) throw new Error(result.error);
    expect(result.config.sections).toHaveLength(1);
  });

  it('falls back to the default tabs when tabs are missing', () => {
    const result = validateLayoutConfig({ ...goodConfig, tabs: undefined });
    if (!result.ok) throw new Error(result.error);
    expect(result.config.tabs).toEqual(DEFAULT_TABS);
  });
});
