import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { buildTheme } from '@/theme/buildTheme';

/**
 * Temporary placeholder so the app boots. Replaced by the config-driven home
 * in a later step. Uses the fallback theme (no config is fetched yet).
 */
export default function PlaceholderHome() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const { colors, spacing, typography, radius } = buildTheme(null, scheme);

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: colors.background }]}>
      <View style={[styles.center, { padding: spacing.xxl, gap: spacing.md }]}>
        <View
          style={{
            backgroundColor: colors.primarySoft,
            borderRadius: radius.pill,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
          }}
        >
          <Text style={[typography.micro, { color: colors.primary }]}>STEP 1 · FOUNDATION</Text>
        </View>
        <Text style={[typography.display, { color: colors.textPrimary }]}>Tapza Care</Text>
        <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
          Theme and config validation are wired up. The home screen comes next.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
