import { AppText, Card, Screen, SegmentedControl, type SegmentOption } from '@/components';
import { DemoControls } from '@/features/demo/DemoControls';
import { useSettings, type Appearance } from '@/store/settings';
import { useTheme } from '@/theme/ThemeProvider';

const APPEARANCE_OPTIONS: SegmentOption<Appearance>[] = [
  { value: 'system', label: 'Phone setting' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function ProfileScreen() {
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
