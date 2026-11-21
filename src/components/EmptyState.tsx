import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { AppText } from './AppText';
import { Button } from './Button';
import { Icon } from './Icon';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

// Shown when a list has nothing in it, or something failed: an icon, a short
// explanation and (optionally) a button for what to do next.
export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primarySoft,
          marginBottom: spacing.sm,
        }}
      >
        <Icon name={icon} size={32} color="primary" />
      </View>
      <AppText variant="heading" style={{ textAlign: 'center' }}>
        {title}
      </AppText>
      <AppText color="textSecondary" style={{ textAlign: 'center' }}>
        {message}
      </AppText>
      {actionLabel && onAction && (
        <View style={{ marginTop: spacing.md }}>
          <Button label={actionLabel} onPress={onAction} variant="outline" />
        </View>
      )}
    </View>
  );
}
