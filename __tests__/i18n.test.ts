import { translate } from '@/i18n';
import { en } from '@/i18n/en';
import { hi } from '@/i18n/hi';
import { te } from '@/i18n/te';

describe('translations', () => {
  it('fills in {values}', () => {
    expect(translate('en', 'rx.daysLeft', { count: 3 })).toBe('3 days left');
    expect(translate('hi', 'rx.daysLeft', { count: 3 })).toBe('3 दिन बाकी');
    expect(translate('te', 'rx.daysLeft', { count: 3 })).toBe('3 రోజులు మిగిలాయి');
  });

  it('has no empty translations', () => {
    for (const strings of [en, hi, te]) {
      for (const text of Object.values(strings)) expect(text.trim()).not.toBe('');
    }
  });

  it('uses the same {placeholders} in every language', () => {
    const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort().join(',');
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(placeholders(hi[key])).toBe(placeholders(en[key]));
      expect(placeholders(te[key])).toBe(placeholders(en[key]));
    }
  });
});
