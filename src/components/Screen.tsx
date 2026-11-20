import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { AppText } from './AppText';

interface ScreenProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

// A scrollable page with a big title at the top.
export function Screen({ title, subtitle, children }: ScreenProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
        gap: spacing.lg,
      }}
    >
      <AppText variant="title" accessibilityRole="header">
        {title}
      </AppText>
      {subtitle && <AppText color="textSecondary">{subtitle}</AppText>}
      {children}
    </ScrollView>
  );
}
