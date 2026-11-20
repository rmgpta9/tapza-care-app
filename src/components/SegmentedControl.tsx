import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP_TARGET } from '@/theme/tokens';
import { AppText } from './AppText';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

// A row of buttons where exactly one is selected, e.g. Light / Dark.
export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={[styles.row, { gap: spacing.sm }]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={[
              styles.option,
              {
                minHeight: TAP_TARGET,
                paddingHorizontal: spacing.md,
                borderRadius: radius.md,
                backgroundColor: selected ? colors.primary : colors.surface,
                borderColor: selected ? colors.primary : colors.border,
              },
            ]}
          >
            <AppText variant="label" color={selected ? 'onPrimary' : 'textPrimary'}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // flexWrap lets options move to a second line when the font is large.
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  option: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});
