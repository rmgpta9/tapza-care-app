import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLayoutConfig } from '@/config/ConfigProvider';
import type { ScreenId } from '@/config/types';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP_TARGET } from '@/theme/tokens';
import { AppText } from './AppText';
import { Icon } from './Icon';

// Which file in src/app/(tabs) each config screen opens.
const ROUTE_NAME: Record<ScreenId, string> = {
  home: 'index',
  bookings: 'bookings',
  prescriptions: 'prescriptions',
  profile: 'profile',
};

// The bottom tab bar. Order, labels and icons come from config.tabs.
export function ConfigTabBar({ state, navigateToTab }: BottomTabBarProps) {
  const { config } = useLayoutConfig();
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: spacing.sm,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
    >
      {config.tabs.map((tab) => {
        const route = state.routes.find((r) => r.name === ROUTE_NAME[tab.screen]);
        if (!route) return null;

        const isActive = state.routes[state.index]?.key === route.key;
        const color = isActive ? 'primary' : 'textSecondary';

        return (
          <Pressable
            key={tab.id}
            onPress={() => navigateToTab(route.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            style={[styles.tab, { minHeight: TAP_TARGET }]}
          >
            <View
              style={{
                paddingHorizontal: spacing.lg,
                paddingVertical: 2,
                borderRadius: radius.pill,
                backgroundColor: isActive ? colors.primarySoft : 'transparent',
              }}
            >
              <Icon name={tab.icon} color={color} />
            </View>
            <AppText variant="label" color={color} numberOfLines={1}>
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
