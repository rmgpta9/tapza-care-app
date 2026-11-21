import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP_TARGET } from '@/theme/tokens';

export const LOCATION_ROW_HEIGHT = 28;
export const TITLE_ROW_HEIGHT = 56;

// Full header height, used by the home screen to leave room above the content.
export function useHomeHeaderHeight(): number {
  const insets = useSafeAreaInsets();
  return insets.top + LOCATION_ROW_HEIGHT + TITLE_ROW_HEIGHT;
}

// Header that shrinks as you scroll: the clinic location row slides up out of
// sight and a bottom border fades in. Only `transform` and `opacity` change,
// which is cheap for the phone to animate.
export function HomeHeader({ scrollY }: { scrollY: SharedValue<number> }) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const t = useT();

  const slideUp = useAnimatedStyle(() => ({
    transform: [{ translateY: -interpolate(scrollY.value, [0, LOCATION_ROW_HEIGHT], [0, LOCATION_ROW_HEIGHT], 'clamp') }],
  }));
  const fadeOut = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, LOCATION_ROW_HEIGHT], [1, 0], 'clamp'),
  }));
  const fadeInBorder = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 60], [0, 1], 'clamp'),
  }));

  return (
    <>
      <Animated.View
        style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.background }, slideUp]}
      >
        <Animated.View style={[styles.row, { height: LOCATION_ROW_HEIGHT, paddingHorizontal: spacing.lg, gap: spacing.xs }, fadeOut]}>
          <Icon name="location-outline" size={16} color="primary" />
          <AppText variant="label" color="textSecondary" numberOfLines={1}>
            Tapza Sunrise Clinic · Banjara Hills
          </AppText>
        </Animated.View>

        <View style={[styles.row, { height: TITLE_ROW_HEIGHT, paddingHorizontal: spacing.lg }]}>
          <AppText variant="title" style={styles.flex} numberOfLines={1}>
            Tapza Care
          </AppText>
          <Pressable
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel={t('home.openProfile')}
            style={[styles.iconButton, { width: TAP_TARGET, height: TAP_TARGET }]}
          >
            <Icon name="person-circle-outline" size={32} color="primary" />
          </Pressable>
        </View>

        <Animated.View style={[styles.border, { backgroundColor: colors.border }, fadeInBorder]} />
      </Animated.View>

      {/* covers the status bar, so the location row slides up behind it */}
      <View style={[styles.statusBarCover, { height: insets.top, backgroundColor: colors.background }]} />
    </>
  );
}

const styles = StyleSheet.create({
  header: { position: 'absolute', top: 0, left: 0, right: 0 },
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  iconButton: { alignItems: 'center', justifyContent: 'center' },
  border: { height: StyleSheet.hairlineWidth },
  statusBarCover: { position: 'absolute', top: 0, left: 0, right: 0 },
});
