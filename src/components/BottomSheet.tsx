import { useEffect, type ReactNode } from 'react';
import { BackHandler, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

const CLOSE_DISTANCE = 120; // drag down this far to close
const CLOSE_SPEED = 800; // or flick down at least this fast

// A panel that slides up from the bottom. Drag it down, tap outside it or press
// the Android back button to close it. The drag runs on the UI thread, so it
// follows the finger smoothly.
export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const { colors, spacing, radius } = useTheme();
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // How far the sheet is pushed down: 0 = fully open, screenHeight = hidden.
  const offset = useSharedValue(screenHeight);

  useEffect(() => {
    offset.set(withTiming(visible ? 0 : screenHeight, { duration: 280 }));
  }, [visible, screenHeight, offset]);

  // Android back button closes the sheet instead of leaving the screen.
  useEffect(() => {
    if (!visible) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => subscription.remove();
  }, [visible, onClose]);

  const drag = usePanGesture({
    activeOffsetY: 10, // only start dragging after the finger moves down 10px, so taps still work
    onUpdate: (event) => {
      'worklet';
      offset.set(Math.max(0, event.translationY)); // can't drag above fully open
    },
    onDeactivate: (event) => {
      'worklet';
      if (event.translationY > CLOSE_DISTANCE || event.velocityY > CLOSE_SPEED) {
        offset.set(withTiming(screenHeight, { duration: 220 }));
        scheduleOnRN(onClose); // onClose is normal JS, so run it on the JS thread
      } else {
        offset.set(withSpring(0, { damping: 20 })); // snap back open
      }
    },
  });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }] }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(offset.value, [0, screenHeight], [1, 0], 'clamp'),
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }, backdropStyle]}>
        <Pressable style={styles.fill} onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" />
      </Animated.View>

      <GestureDetector gesture={drag}>
        <Animated.View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              paddingHorizontal: spacing.lg,
              paddingBottom: insets.bottom + spacing.lg,
            },
            sheetStyle,
          ]}
        >
          {/* the little grab bar that shows the sheet can be dragged */}
          <View style={[styles.handle, { backgroundColor: colors.border, marginVertical: spacing.md }]} />
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3 },
});
