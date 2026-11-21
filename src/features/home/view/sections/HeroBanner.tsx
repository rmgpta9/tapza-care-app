import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { AppText } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP_TARGET } from '@/theme/tokens';
import { greeting } from '@/utils/format';
import { isObject } from '@/utils/isObject';
import type { SectionProps } from './types';

const BANNER_HEIGHT = 200;
const PARALLAX_EXTRA = 80; // the image is taller than the banner so it has room to move

interface HeroItem {
  headline: string;
  subtitle?: string;
  ctaLabel?: string;
}

function readHero(value: unknown): HeroItem | null {
  if (!isObject(value) || typeof value.headline !== 'string') return null;
  return {
    headline: value.headline,
    subtitle: typeof value.subtitle === 'string' ? value.subtitle : undefined,
    ctaLabel: typeof value.ctaLabel === 'string' ? value.ctaLabel : undefined,
  };
}

// Big banner at the top of home: greeting, headline and a button.
// On festival days it shows the festival image and greeting from the config.
export function HeroBanner({ section, scrollY }: SectionProps) {
  const { colors, spacing, radius, festival } = useTheme();
  const hero = readHero(section.items[0]);

  // Parallax: when the page scrolls down 100px, the image moves down 40px,
  // so it looks like it's further away than the text.
  const parallax = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrollY.value, [0, 200], [0, 80], 'clamp') }],
  }));

  if (!hero) return null;

  const imageUrl = festival?.bannerImageUrl;

  return (
    <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.lg }}>
      <View style={[styles.banner, { borderRadius: radius.lg }]}>
        <LinearGradient colors={[colors.primary, colors.secondary]} style={StyleSheet.absoluteFill} />

        {imageUrl ? (
          <>
            <Animated.View style={[styles.parallaxImage, parallax]}>
              <Image source={{ uri: imageUrl }} style={styles.fill} contentFit="cover" transition={300} />
            </Animated.View>
            {/* darkens the photo so the white text stays readable */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]} />
          </>
        ) : null}

        <View style={[styles.content, { padding: spacing.lg, gap: spacing.xs }]}>
          <AppText variant="label" color="onPrimary">
            {festival ? festival.greeting : greeting()}
          </AppText>
          <AppText variant="title" color="onPrimary">
            {hero.headline}
          </AppText>
          {hero.subtitle && (
            <AppText variant="small" color="onPrimary">
              {hero.subtitle}
            </AppText>
          )}

          {hero.ctaLabel && (
            <Pressable
              onPress={() => router.push('/bookings')} // TODO: open the booking flow
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.cta,
                {
                  minHeight: TAP_TARGET,
                  marginTop: spacing.sm,
                  paddingHorizontal: spacing.lg,
                  borderRadius: radius.md,
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <AppText variant="bodyBold" color="primary">
                {hero.ctaLabel}
              </AppText>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { minHeight: BANNER_HEIGHT, overflow: 'hidden' },
  parallaxImage: { position: 'absolute', left: 0, right: 0, top: -PARALLAX_EXTRA, bottom: 0 },
  fill: { flex: 1 },
  content: { flex: 1, justifyContent: 'flex-end' },
  cta: { alignSelf: 'flex-start', justifyContent: 'center' },
});
