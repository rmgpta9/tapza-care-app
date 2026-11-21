import { StyleSheet, View } from 'react-native';
import { AppText, Icon, SectionTitle } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { formatRupees } from '@/utils/format';
import { isObject } from '@/utils/isObject';
import type { SectionProps } from './types';

interface Service {
  id: string;
  name: string;
  priceInr: number;
  mrpInr?: number; // original price, shown crossed out
  badge?: string;
  icon?: string;
  category?: string;
}

function isService(value: unknown): value is Service {
  return (
    isObject(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.priceInr === 'number'
  );
}

// Splits [a, b, c, d, e] into rows of 2: [[a, b], [c, d], [e]].
function toRows<T>(items: T[], perRow: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += perRow) rows.push(items.slice(i, i + perRow));
  return rows;
}

// Cards in 2 or 3 columns: icon, name, price in rupees and an optional badge.
export function ServiceGrid({ section, selectedCategory }: SectionProps) {
  const { colors, spacing, radius } = useTheme();
  const columns = section.columns === 3 ? 3 : 2;

  let services = section.items.filter(isService);
  // If a category chip is selected, only show services in that category.
  if (selectedCategory) services = services.filter((s) => s.category === selectedCategory);
  if (services.length === 0) return null;

  return (
    <>
      <SectionTitle title={section.title} />
      <View style={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}>
        {toRows(services, columns).map((row, rowIndex) => (
          <View key={rowIndex} style={[styles.row, { gap: spacing.sm }]}>
            {row.map((service) => (
              <View
                key={service.id}
                style={[
                  styles.card,
                  {
                    padding: spacing.md,
                    gap: spacing.xs,
                    borderRadius: radius.md,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <View style={[styles.iconBox, { borderRadius: radius.sm, backgroundColor: colors.accentSoft }]}>
                  <Icon name={service.icon ?? 'medkit-outline'} color="primary" />
                </View>

                {service.badge && (
                  <View
                    style={[
                      styles.badge,
                      { borderRadius: radius.sm, paddingHorizontal: spacing.xs, backgroundColor: colors.primarySoft },
                    ]}
                  >
                    <AppText variant="label" color="primary" numberOfLines={1}>
                      {service.badge}
                    </AppText>
                  </View>
                )}

                <AppText variant={columns === 3 ? 'small' : 'bodyBold'} numberOfLines={2}>
                  {service.name}
                </AppText>

                <View style={[styles.priceRow, { gap: spacing.xs }]}>
                  <AppText variant="bodyBold" color="primary">
                    {formatRupees(service.priceInr)}
                  </AppText>
                  {service.mrpInr && service.mrpInr > service.priceInr && (
                    <AppText variant="small" color="textSecondary" style={styles.strike}>
                      {formatRupees(service.mrpInr)}
                    </AppText>
                  )}
                </View>
              </View>
            ))}

            {/* empty spaces keep the last row's cards the same width as the others */}
            {Array.from({ length: columns - row.length }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.card} />
            ))}
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  card: { flex: 1, borderWidth: StyleSheet.hairlineWidth, borderColor: 'transparent' },
  iconBox: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  badge: { alignSelf: 'flex-start' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' },
  strike: { textDecorationLine: 'line-through' },
});
