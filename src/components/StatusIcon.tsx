import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import type { BookingStatus } from '@/store/bookings';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';

const SIZE = 112;

// The big round icon on the booking screen: a clock while confirming, then a
// tick (or a cross) that pops in with a little bounce when the status changes.
export function StatusIcon({ status }: { status: BookingStatus }) {
  const { colors } = useTheme();
  const scale = useSharedValue(0);

  useEffect(() => {
    // Shrink a little, then spring up past full size and settle: a small "pop".
    scale.set(withSequence(withTiming(0.6, { duration: 120 }), withSpring(1, { damping: 8, stiffness: 140 })));
  }, [status, scale]);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const look = {
    confirming: { icon: 'time-outline', color: 'primary' as const, background: colors.primarySoft },
    confirmed: { icon: 'checkmark', color: 'success' as const, background: colors.successSoft },
    failed: { icon: 'close', color: 'danger' as const, background: colors.dangerSoft },
  }[status];

  return (
    <Animated.View style={[styles.circle, { backgroundColor: look.background }, popStyle]}>
      <Icon name={look.icon} size={56} color={look.color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  circle: { width: SIZE, height: SIZE, borderRadius: SIZE / 2, alignItems: 'center', justifyContent: 'center' },
});
