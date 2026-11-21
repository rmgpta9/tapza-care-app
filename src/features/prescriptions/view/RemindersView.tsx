import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { usePrescriptions } from '@/api/queries';
import { AppText, DoseSchedule, EmptyState, Skeleton } from '@/components';
import { useDoses } from '@/store/doses';
import { useTheme } from '@/theme/ThemeProvider';
import { todaysDoses } from '@/utils/prescriptions';

// Today's doses from every active prescription (including family members'), in one schedule.
export function RemindersView() {
  const { spacing, radius } = useTheme();
  const { data: prescriptions, isLoading, error, refetch } = usePrescriptions();
  const taken = useDoses((s) => s.taken);

  const doses = todaysDoses(prescriptions ?? []);
  const takenCount = doses.filter((dose) => taken[dose.key]).length;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      <Stack.Screen options={{ headerShown: true, title: "Today's reminders" }} />

      {isLoading && [1, 2, 3, 4].map((n) => <Skeleton key={n} width="100%" height={72} radius={radius.md} />)}

      {error && (
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load your medicines"
          message="Please check your connection and try again."
          actionLabel="Try again"
          onAction={() => refetch()}
        />
      )}

      {prescriptions && doses.length === 0 && (
        <EmptyState
          icon="happy-outline"
          title="No medicines today"
          message="You have no doses scheduled for today."
        />
      )}

      {doses.length > 0 && (
        <>
          <AppText color="textSecondary">
            {takenCount} of {doses.length} doses taken today. Tap a medicine when you&apos;ve taken it.
          </AppText>
          <DoseSchedule doses={doses} showWhoFor />
        </>
      )}
    </ScrollView>
  );
}
