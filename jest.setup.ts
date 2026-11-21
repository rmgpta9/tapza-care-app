// Global test setup: in-memory replacements for native modules.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// A small stand-in for the parts of Reanimated the app uses. Animations don't
// run in tests; components just render in their final state.
// (Reanimated 4.7's own mock tries to start its native engine and fails in Jest.)
jest.mock('react-native-reanimated', () => {
  const { View, ScrollView } = require('react-native');
  return {
    __esModule: true,
    default: { View, ScrollView, createAnimatedComponent: (component: unknown) => component },
    useSharedValue: (value: unknown) => ({ value, set: () => {} }),
    useAnimatedStyle: () => ({}),
    useAnimatedScrollHandler: () => () => {},
    useAnimatedReaction: () => {},
    useReducedMotion: () => false,
    interpolate: () => 0,
    withTiming: (value: unknown) => value,
    withRepeat: (value: unknown) => value,
    withSpring: (value: unknown) => value,
    withSequence: (...values: unknown[]) => values[values.length - 1],
  };
});

// Worklets runs code on the UI thread; in tests just call the function directly.
jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (fn: (...args: unknown[]) => void, ...args: unknown[]) => fn(...args),
}));
