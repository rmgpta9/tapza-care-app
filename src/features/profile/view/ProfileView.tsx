import { AppText, Card, DemoControls, Screen, SegmentedControl, type SegmentOption } from '@/components';
import { LANGUAGE_NAMES, useT } from '@/i18n';
import { useSettings, type Appearance, type Language } from '@/store/settings';
import { useTheme } from '@/theme/ThemeProvider';

const LANGUAGE_OPTIONS: SegmentOption<Language>[] = [
  { value: 'en', label: LANGUAGE_NAMES.en },
  { value: 'hi', label: LANGUAGE_NAMES.hi },
  { value: 'te', label: LANGUAGE_NAMES.te },
];

export function ProfileView() {
  const { spacing } = useTheme();
  const t = useT();
  const { appearance, setAppearance, language, setLanguage } = useSettings();

  const appearanceOptions: SegmentOption<Appearance>[] = [
    { value: 'system', label: t('profile.phoneSetting') },
    { value: 'light', label: t('profile.light') },
    { value: 'dark', label: t('profile.dark') },
  ];

  return (
    <Screen title={t('profile.title')} subtitle={t('profile.subtitle')}>
      <Card style={{ gap: spacing.md }}>
        <AppText variant="heading">{t('profile.language')}</AppText>
        <SegmentedControl options={LANGUAGE_OPTIONS} value={language} onChange={setLanguage} />
      </Card>

      <Card style={{ gap: spacing.md }}>
        <AppText variant="heading">{t('profile.appearance')}</AppText>
        <SegmentedControl options={appearanceOptions} value={appearance} onChange={setAppearance} />
      </Card>

      {/* Demo controls stay in English: they're a tool for reviewers, not patients. */}
      <DemoControls />
    </Screen>
  );
}
