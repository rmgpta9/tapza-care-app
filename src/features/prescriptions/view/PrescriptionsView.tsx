import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { usePrescriptions } from '@/api/queries';
import { AppText, EmptyState, Icon, PrescriptionCard, Screen, Skeleton } from '@/components';
import { useDoses } from '@/store/doses';
import { useTheme } from '@/theme/ThemeProvider';
import { isPrescriptionActive, todaysDoses } from '@/utils/prescriptions';

// The Medicines tab: today's progress, then active and past prescriptions.
export function PrescriptionsView() {
  const { spacing, radius } = useTheme();
  const { data: prescriptions, isLoading, error, refetch } = usePrescriptions();

  return (
    <Screen title="Medicines" subtitle="Your prescriptions and today's doses">
      {isLoading && [1, 2, 3].map((n) => <Skeleton key={n} width="100%" height={120} radius={radius.lg} />)}

      {error && (
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load prescriptions"
          message="Please check your connection and try again."
          actionLabel="Try again"
          onAction={() => refetch()}
        />
      )}

      {prescriptions?.length === 0 && (
        <EmptyState
          icon="document-text-outline"
          title="No prescriptions yet"
          message="After your visit, your doctor's prescription will appear here, as well as on WhatsApp."
        />
      )}

      {prescriptions && prescriptions.length > 0 && (
        <>
          <TodayCard />

          <AppText variant="heading" style={{ marginTop: spacing.sm }}>
            Active
          </AppText>
          {prescriptions.filter(isPrescriptionActive).map((p) => (
            <PrescriptionCard key={p.id} prescription={p} />
          ))}

          <AppText variant="heading" style={{ marginTop: spacing.sm }}>
            Past
          </AppText>
          {prescriptions
            .filter((p) => !isPrescriptionActive(p))
            .map((p) => (
              <PrescriptionCard key={p.id} prescription={p} />
            ))}
        </>
      )}
    </Screen>
  );
}

// "Today: 3 of 9 doses taken" with a progress bar. Opens today's reminders.
function TodayCard() {
  const { colors, spacing, radius } = useTheme();
  const { data: prescriptions = [] } = usePrescriptions();
  const taken = useDoses((s) => s.taken);

  const doses = todaysDoses(prescriptions);
  const takenCount = doses.filter((dose) => taken[dose.key]).length;
  const progress = doses.length === 0 ? 0 : takenCount / doses.length;

  if (doses.length === 0) return null;

  return (
    <Pressable
      onPress={() => router.push('/reminders')}
      accessibilityRole="button"
      accessibilityLabel={`Today: ${takenCount} of ${doses.length} doses taken. Open today's reminders.`}
      style={({ pressed }) => ({
        gap: spacing.sm,
        padding: spacing.lg,
        borderRadius: radius.lg,
        backgroundColor: colors.primarySoft,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={styles.row}>
        <AppText variant="heading" style={styles.flex}>
          Today
        </AppText>
        <AppText variant="bodyBold" color="primary">
          {takenCount} of {doses.length} taken
        </AppText>
      </View>

      {/* progress bar: a grey track with a coloured fill */}
      <View style={[styles.track, { borderRadius: radius.pill, backgroundColor: colors.surface }]}>
        <View
          style={[
            styles.fill,
            { width: `${progress * 100}%`, borderRadius: radius.pill, backgroundColor: colors.primary },
          ]}
        />
      </View>

      <View style={[styles.row, { gap: spacing.xs }]}>
        <AppText variant="label" color="primary" style={styles.flex}>
          See today&apos;s schedule
        </AppText>
        <Icon name="chevron-forward" size={18} color="primary" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  track: { height: 10, overflow: 'hidden' },
  fill: { height: '100%' },
});
