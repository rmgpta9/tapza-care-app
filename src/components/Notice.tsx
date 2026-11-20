import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP_TARGET } from '@/theme/tokens';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface NoticeProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

// A small yellow message bar, e.g. "Couldn't refresh. Retry".
export function Notice({ message, actionLabel, onAction }: NoticeProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.row,
        {
          backgroundColor: colors.warningSoft,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          gap: spacing.sm,
          minHeight: TAP_TARGET,
        },
      ]}
    >
      <Icon name="cloud-offline-outline" color="warning" />
      <AppText variant="label" style={[styles.message, { paddingVertical: spacing.sm }]}>
        {message}
      </AppText>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          style={[styles.action, { minHeight: TAP_TARGET, paddingHorizontal: spacing.sm }]}
        >
          <AppText variant="label" color="warning">
            {actionLabel}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  message: { flex: 1 },
  action: { justifyContent: 'center' },
});
