import { useEffect } from 'react';
import type { DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';

interface SkeletonProps {
  width: DimensionValue;
  height: number;
  radius?: number;
}

// A grey placeholder block that gently pulses while content is loading.
// Screens combine several of these into the same shape as the real content.
export function Skeleton({ width, height, radius }: SkeletonProps) {
  const theme = useTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Fade between 100% and 50%, forever, back and forth.
    opacity.set(withRepeat(withTiming(0.5, { duration: 700 }), -1, true));
  }, [opacity]);

  const pulse = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius ?? theme.radius.sm, backgroundColor: theme.colors.skeleton },
        pulse,
      ]}
    />
  );
}
