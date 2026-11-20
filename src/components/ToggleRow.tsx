import { StyleSheet, Switch, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP_TARGET } from '@/theme/tokens';
import { AppText } from './AppText';

interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleRow({ label, description, value, onChange }: ToggleRowProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.row, { minHeight: TAP_TARGET, gap: spacing.md }]}>
      <View style={styles.text}>
        <AppText variant="bodyBold">{label}</AppText>
        {description && (
          <AppText variant="small" color="textSecondary">
            {description}
          </AppText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ false: colors.border, true: colors.primary }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { flex: 1 },
});
