import { StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';
import { useTheme } from '@/theme/ThemeProvider';
import { useHomeHeaderHeight } from './HomeHeader';

// Grey placeholder in the same shape as the home screen (header, banner, chips,
// quick actions, cards). Shown only on the very first launch while the config loads.
export function HomeSkeleton() {
  const { colors, spacing, radius } = useTheme();
  const headerHeight = useHomeHeaderHeight();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: headerHeight - 56, gap: spacing.xl }]}>
      <View style={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}>
        <Skeleton width="55%" height={14} />
        <Skeleton width="40%" height={26} />
      </View>

      <View style={{ paddingHorizontal: spacing.lg }}>
        <Skeleton width="100%" height={200} radius={radius.lg} />
      </View>

      <View style={[styles.row, { paddingHorizontal: spacing.lg, gap: spacing.sm }]}>
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} width={110} height={44} radius={radius.pill} />
        ))}
      </View>

      <View style={[styles.row, { paddingHorizontal: spacing.lg, justifyContent: 'space-between' }]}>
        {[1, 2, 3, 4].map((n) => (
          <View key={n} style={{ alignItems: 'center', gap: spacing.sm }}>
            <Skeleton width={60} height={60} radius={radius.lg} />
            <Skeleton width={56} height={12} />
          </View>
        ))}
      </View>

      <View style={[styles.row, { paddingHorizontal: spacing.lg, gap: spacing.sm }]}>
        <View style={styles.flex}>
          <Skeleton width="100%" height={140} radius={radius.md} />
        </View>
        <View style={styles.flex}>
          <Skeleton width="100%" height={140} radius={radius.md} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  row: { flexDirection: 'row' },
  flex: { flex: 1 },
});
