import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { SectionBackground as Background } from '@/config/types';
import { withOpacity } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  background: Background;
  children: ReactNode;
}

// Paints a section's band: a solid colour, a gradient or an image.
//
// Config backgrounds are light colours, so in dark mode we use the dark theme
// background instead; otherwise the text on top would be unreadable.
export function SectionBackground({ background, children }: Props) {
  const { colors, scheme } = useTheme();

  if (scheme === 'dark' && background.kind !== 'image') {
    return <View style={{ backgroundColor: colors.background }}>{children}</View>;
  }

  if (background.kind === 'gradient') {
    // "#FFFFFF,#EEEEEE" goes top to bottom. "90deg,#FFFFFF,#EEEEEE" goes left to right.
    const parts = background.value.split(',').map((part) => part.trim());
    const gradientColors = parts.filter((part) => part.startsWith('#'));
    const leftToRight = parts[0] === '90deg';

    if (gradientColors.length >= 2) {
      return (
        <LinearGradient
          colors={gradientColors as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={leftToRight ? { x: 1, y: 0 } : { x: 0, y: 1 }}
        >
          {children}
        </LinearGradient>
      );
    }
  }

  if (background.kind === 'image') {
    return (
      <View>
        <Image source={{ uri: background.value }} style={StyleSheet.absoluteFill} contentFit="cover" />
        {/* a see-through layer over the photo so normal text stays readable */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: withOpacity(colors.background, 0.85) }]} />
        {children}
      </View>
    );
  }

  // 'color', or a gradient with fewer than two colours
  const color = background.value.split(',')[0] ?? colors.background;
  return <View style={{ backgroundColor: color }}>{children}</View>;
}
