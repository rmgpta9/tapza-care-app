import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { usePrescriptions } from '@/api/queries';
import { AppText, Card, DoseSchedule, EmptyState, Notice, Skeleton, ToggleRow } from '@/components';
import { useT } from '@/i18n';
import { useDoses } from '@/store/doses';
import { useSettings } from '@/store/settings';
import { useTheme } from '@/theme/ThemeProvider';
import { cancelReminders, remindersSupported, scheduleReminders } from '@/utils/notifications';
import { TIMINGS, todaysDoses } from '@/utils/prescriptions';

// Today's doses from every active prescription (including family members'), in one schedule,
// plus the switch for daily reminder notifications.
export function RemindersView() {
  const { spacing, radius } = useTheme();
  const t = useT();
  const { data: prescriptions, isLoading, error, refetch } = usePrescriptions();
  const taken = useDoses((s) => s.taken);
  const remindersOn = useSettings((s) => s.remindersOn);
  const setRemindersOn = useSettings((s) => s.setRemindersOn);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const doses = todaysDoses(prescriptions ?? []);
  const takenCount = doses.filter((dose) => taken[dose.key]).length;

  async function toggleReminders(on: boolean) {
    if (!on) {
      await cancelReminders();
      setRemindersOn(false);
      return;
    }
    // Only remind at times of day that actually have medicines.
    const timings = TIMINGS.filter((timing) => doses.some((dose) => dose.timing === timing));
    const allowed = await scheduleReminders(timings);
    setRemindersOn(allowed);
    setPermissionDenied(!allowed);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      <Stack.Screen options={{ headerShown: true, title: t('reminders.title') }} />

      <Card style={{ gap: spacing.sm }}>
        {remindersSupported ? (
          <ToggleRow
            label={t('reminders.remindMe')}
            description={t('reminders.remindMeHint')}
            value={remindersOn}
            onChange={toggleReminders}
          />
        ) : (
          <AppText color="textSecondary">{t('reminders.notOnWeb')}</AppText>
        )}
        {permissionDenied && <Notice message={t('reminders.permissionDenied')} />}
      </Card>

      {isLoading && [1, 2, 3, 4].map((n) => <Skeleton key={n} width="100%" height={72} radius={radius.md} />)}

      {error && (
        <EmptyState
          icon="cloud-offline-outline"
          title={t('reminders.failedTitle')}
          message={t('common.offline')}
          actionLabel={t('common.tryAgain')}
          onAction={() => refetch()}
        />
      )}

      {prescriptions && doses.length === 0 && (
        <EmptyState icon="happy-outline" title={t('reminders.emptyTitle')} message={t('reminders.emptyMessage')} />
      )}

      {doses.length > 0 && (
        <>
          <AppText color="textSecondary">{t('reminders.progress', { taken: takenCount, total: doses.length })}</AppText>
          <DoseSchedule doses={doses} showWhoFor />
        </>
      )}
    </ScrollView>
  );
}
