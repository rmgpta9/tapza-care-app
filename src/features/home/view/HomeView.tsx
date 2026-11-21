import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { ConfigStatus, HomeHeader, HomeSkeleton, RevealOnScroll, useHomeHeaderHeight } from '@/components';
import { useLayoutConfig } from '@/config/ConfigProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { SectionRenderer } from './SectionRenderer';

// The home screen draws whatever sections the config lists, in that order.
export function HomeView() {
  const { config, isFirstLoad } = useLayoutConfig();
  const { colors, spacing } = useTheme();
  const headerHeight = useHomeHeaderHeight();
  const { height: screenHeight } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Scroll position, shared with the header, the hero parallax and the reveal animations.
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });

  if (isFirstLoad) return <HomeSkeleton />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: spacing.xxl }}
      >
        <View style={{ paddingHorizontal: spacing.lg }}>
          <ConfigStatus />
        </View>

        {/* The version is part of the key, so when a new config arrives every
            section starts fresh and animates in again. */}
        {config.sections.map((section) => (
          <RevealOnScroll key={`${config.version}-${section.id}`} scrollY={scrollY} screenHeight={screenHeight}>
            <SectionRenderer
              section={section}
              scrollY={scrollY}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </RevealOnScroll>
        ))}
      </Animated.ScrollView>

      <HomeHeader scrollY={scrollY} />
    </View>
  );
}
