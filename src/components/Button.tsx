import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP_TARGET } from '@/theme/tokens';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({ label, onPress, variant = 'primary', icon, loading, disabled }: ButtonProps) {
  const { colors, spacing, radius } = useTheme();
  const isPrimary = variant === 'primary';
  const textColor = isPrimary ? 'onPrimary' : 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        {
          minHeight: TAP_TARGET,
          gap: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: radius.md,
          backgroundColor: isPrimary ? colors.primary : colors.surface,
          borderColor: isPrimary ? colors.primary : colors.border,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors[textColor]} />
      ) : (
        <>
          {icon && <Icon name={icon} color={textColor} />}
          <AppText variant="bodyBold" color={textColor}>
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
