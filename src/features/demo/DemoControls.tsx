import { useQueryClient } from '@tanstack/react-query';
import { View } from 'react-native';
import {
  useMockControls,
  type ConfigVariant,
  type FailureMode,
  type MockControls,
  type NetworkSpeed,
} from '@/api/mock/controls';
import { AppText, Button, Card, SegmentedControl, ToggleRow, type SegmentOption } from '@/components';
import { useLayoutConfig } from '@/config/ConfigProvider';
import { useConfigCache } from '@/config/configCache';
import { useTheme } from '@/theme/ThemeProvider';

const CONFIG_OPTIONS: SegmentOption<ConfigVariant>[] = [
  { value: 'normal', label: 'Normal day' },
  { value: 'festival', label: 'Diwali' },
];

const SPEED_OPTIONS: SegmentOption<NetworkSpeed>[] = [
  { value: 'fast', label: 'Fast' },
  { value: 'slow', label: 'Slow 2.5s' },
  { value: 'very_slow', label: 'Very slow 6s' },
];

const FAILURE_OPTIONS: SegmentOption<FailureMode>[] = [
  { value: 'none', label: 'None' },
  { value: 'config', label: 'Config fails' },
  { value: 'flaky', label: 'Flaky 30%' },
  { value: 'all', label: 'All fail' },
];

// Switches for the fake backend, so slow network, errors and the festival
// theme can be shown without changing any code.
export function DemoControls() {
  const { spacing } = useTheme();
  const queryClient = useQueryClient();
  const controls = useMockControls();
  const { source } = useLayoutConfig();
  const clearSavedConfig = useConfigCache((s) => s.clear);

  // Change a switch, then reload all data so the effect shows straight away.
  function change(changes: Partial<MockControls>) {
    controls.update(changes);
    queryClient.invalidateQueries();
  }

  return (
    <Card style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="heading">Demo controls</AppText>
        <AppText variant="small" color="textSecondary">
          Controls the fake backend. Home is currently showing the {source} config.
        </AppText>
      </View>

      <View style={{ gap: spacing.sm }}>
        <AppText variant="label">Home config</AppText>
        <SegmentedControl
          options={CONFIG_OPTIONS}
          value={controls.configVariant}
          onChange={(configVariant) => change({ configVariant })}
        />
      </View>

      <View style={{ gap: spacing.sm }}>
        <AppText variant="label">Network speed</AppText>
        <SegmentedControl options={SPEED_OPTIONS} value={controls.speed} onChange={(speed) => change({ speed })} />
      </View>

      <View style={{ gap: spacing.sm }}>
        <AppText variant="label">Server failures</AppText>
        <SegmentedControl
          options={FAILURE_OPTIONS}
          value={controls.failure}
          onChange={(failure) => change({ failure })}
        />
      </View>

      <ToggleRow
        label="Offline"
        description="Every request fails as if there's no signal"
        value={controls.offline}
        onChange={(offline) => change({ offline })}
      />
      <ToggleRow
        label="Empty lists"
        description="Doctors, slots and prescriptions come back empty"
        value={controls.emptyLists}
        onChange={(emptyLists) => change({ emptyLists })}
      />
      <ToggleRow
        label="Next booking: slot taken"
        description="The next booking fails with 409"
        value={controls.forceSlotTaken}
        onChange={(forceSlotTaken) => controls.update({ forceSlotTaken })}
      />

      <Button variant="outline" icon="trash-outline" label="Clear saved config" onPress={clearSavedConfig} />
      <Button
        variant="outline"
        icon="refresh-outline"
        label="Reset demo controls"
        onPress={() => {
          controls.reset();
          queryClient.invalidateQueries();
        }}
      />
    </Card>
  );
}
