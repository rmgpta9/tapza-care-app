import type { ReactNode } from 'react';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

interface Props {
  scrollY: SharedValue<number>;
  screenHeight: number;
  children: ReactNode;
}

// Fades and slides a section in the first time it scrolls into view.
// Runs on the UI thread (Reanimated), so scrolling stays smooth.
export function RevealOnScroll({ scrollY, screenHeight, children }: Props) {
  const reduceMotion = useReducedMotion(); // the phone's "remove animations" setting
  const sectionTop = useSharedValue(Number.MAX_SAFE_INTEGER); // set once we know where the section is
  const progress = useSharedValue(reduceMotion ? 1 : 0); // 0 = hidden, 1 = fully shown

  // Is the top of the section above the bottom edge of the screen?
  useAnimatedReaction(
    () => scrollY.value + screenHeight > sectionTop.value + 40,
    (isVisible, wasVisible) => {
      if (isVisible && !wasVisible && progress.value === 0) {
        progress.set(withTiming(1, { duration: 450 }));
      }
    },
  );

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 24 }],
  }));

  return (
    <Animated.View style={style} onLayout={(e) => sectionTop.set(e.nativeEvent.layout.y)}>
      {children}
    </Animated.View>
  );
}
