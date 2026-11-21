import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Icon, SectionTitle } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { isObject } from '@/utils/isObject';
import type { SectionProps } from './types';

// Where each action goes. The config can only pick from this list, so it can't
// send the user to a screen that doesn't exist.
const ACTION_ROUTES: Record<string, Href> = {
  book: '/doctors',
  prescriptions: '/prescriptions',
  reminders: '/reminders',
  family: '/profile',
};

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: string;
}

function isQuickAction(value: unknown): value is QuickAction {
  return (
    isObject(value) &&
    typeof value.id === 'string' &&
    typeof value.label === 'string' &&
    typeof value.icon === 'string' &&
    typeof value.action === 'string' &&
    value.action in ACTION_ROUTES
  );
}

// A row of big icon tiles: Book, Prescriptions, Reminders, Family.
export function QuickActions({ section }: SectionProps) {
  const { colors, spacing, radius } = useTheme();
  const actions = section.items.filter(isQuickAction).slice(0, 4);
  if (actions.length === 0) return null;

  return (
    <>
      <SectionTitle title={section.title} />
      <View style={[styles.row, { paddingHorizontal: spacing.lg, gap: spacing.sm }]}>
        {actions.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push(ACTION_ROUTES[item.action] ?? '/')}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            style={({ pressed }) => [styles.tile, { gap: spacing.sm, opacity: pressed ? 0.7 : 1 }]}
          >
            <View
              style={[
                styles.iconBox,
                { borderRadius: radius.lg, backgroundColor: colors.primarySoft },
              ]}
            >
              <Icon name={item.icon} size={28} color="primary" />
            </View>
            <AppText variant="label" numberOfLines={2} style={styles.label}>
              {item.label}
            </AppText>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  tile: { flex: 1, alignItems: 'center' },
  iconBox: { width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
  label: { textAlign: 'center' },
});
