import { AppText, Card, DemoControls, Screen, SegmentedControl, type SegmentOption } from '@/components';
import { useSettings, type Appearance } from '@/store/settings';
import { useTheme } from '@/theme/ThemeProvider';

const APPEARANCE_OPTIONS: SegmentOption<Appearance>[] = [
  { value: 'system', label: 'Phone setting' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function ProfileView() {
  const { spacing } = useTheme();
  const appearance = useSettings((s) => s.appearance);
  const setAppearance = useSettings((s) => s.setAppearance);

  return (
    <Screen title="Profile" subtitle="Settings and demo controls">
      <Card style={{ gap: spacing.md }}>
        <AppText variant="heading">Appearance</AppText>
        <SegmentedControl options={APPEARANCE_OPTIONS} value={appearance} onChange={setAppearance} />
      </Card>

      <DemoControls />
    </Screen>
  );
}
