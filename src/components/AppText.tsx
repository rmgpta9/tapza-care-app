import { Text, type TextProps } from 'react-native';
import type { ThemeColors } from '@/theme/buildTheme';
import { useTheme } from '@/theme/ThemeProvider';
import { MAX_FONT_SCALE } from '@/theme/tokens';

type Variant = 'hero' | 'title' | 'heading' | 'body' | 'bodyBold' | 'label' | 'small';

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: keyof ThemeColors;
}

// Use this instead of <Text> so every font size and colour comes from the theme.
export function AppText({ variant = 'body', color = 'textPrimary', style, ...props }: AppTextProps) {
  const { colors, fontSizes } = useTheme();

  const variants = {
    hero: { fontSize: fontSizes.hero, fontWeight: '800' as const },
    title: { fontSize: fontSizes.title, fontWeight: '700' as const },
    heading: { fontSize: fontSizes.large, fontWeight: '700' as const },
    body: { fontSize: fontSizes.body },
    bodyBold: { fontSize: fontSizes.body, fontWeight: '600' as const },
    label: { fontSize: fontSizes.small, fontWeight: '600' as const },
    small: { fontSize: fontSizes.small },
  };

  return (
    <Text
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      style={[variants[variant], { color: colors[color] }, style]}
      {...props}
    />
  );
}
