import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

// A white (or dark-mode surface) box with rounded corners and a thin border.
export function Card({ style, ...props }: ViewProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radius.lg,
          padding: spacing.lg,
        },
        style,
      ]}
      {...props}
    />
  );
}
