import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { usePrescriptions } from '@/api/queries';
import { AppText, Card, DoseSchedule, EmptyState, Skeleton } from '@/components';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { formatDate } from '@/utils/format';
import { courseDay, daysLeft, isPrescriptionActive, todaysDoses } from '@/utils/prescriptions';

// One prescription: who prescribed it, today's doses to tick off, and the full medicine list.
// There's no GET /prescriptions/:id in the API, so it's found in the list (already cached).
export function PrescriptionDetailView() {
  const { colors, spacing, radius } = useTheme();
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: prescriptions, isLoading } = usePrescriptions();
  const prescription = prescriptions?.find((p) => p.id === id);

  const header = <Stack.Screen options={{ headerShown: true, title: t('rx.detailTitle') }} />;

  if (isLoading) {
    return (
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        {header}
        <Skeleton width="100%" height={140} radius={radius.lg} />
        <Skeleton width="40%" height={20} />
        <Skeleton width="100%" height={64} />
        <Skeleton width="100%" height={64} />
      </View>
    );
  }

  if (!prescription) {
    return (
      <View style={{ padding: spacing.lg }}>
        {header}
        <EmptyState
          icon="document-text-outline"
          title={t('rx.notFoundTitle')}
          message={t('rx.notFoundMessage')}
          actionLabel={t('rx.backToMedicines')}
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const active = isPrescriptionActive(prescription);
  const longest = Math.max(...prescription.medicines.map((m) => m.days));
  const doses = todaysDoses([prescription]);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      {header}

      <Card style={{ gap: spacing.xs }}>
        <AppText variant="heading">{prescription.doctorName}</AppText>
        <AppText color="textSecondary">{prescription.clinicName}</AppText>
        <AppText variant="small" color="textSecondary">
          {t('rx.issued', { date: formatDate(prescription.issuedAt) })}
          {prescription.patientName ? ` · ${t('rx.forPatient', { name: prescription.patientName })}` : ''}
        </AppText>
        {prescription.diagnosis && (
          <AppText variant="bodyBold" style={{ marginTop: spacing.sm }}>
            {prescription.diagnosis}
          </AppText>
        )}
        <AppText variant="label" color={active ? 'success' : 'textSecondary'} style={{ marginTop: spacing.sm }}>
          {active
            ? t('rx.courseDay', { day: courseDay(prescription), total: longest, left: daysLeft(prescription) })
            : t('rx.courseCompleted')}
        </AppText>
      </Card>

      <AppText variant="title">{t('rx.today')}</AppText>
      {doses.length > 0 ? (
        <DoseSchedule doses={doses} />
      ) : (
        <AppText color="textSecondary">{t('rx.noDosesToday')}</AppText>
      )}

      <AppText variant="title" style={{ marginTop: spacing.sm }}>
        {t('rx.allMedicines')}
      </AppText>
      {prescription.medicines.map((medicine) => (
        <View
          key={medicine.id}
          style={{
            gap: spacing.xs,
            padding: spacing.md,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <View style={styles.row}>
            <AppText variant="bodyBold" style={styles.flex}>
              {medicine.name}
            </AppText>
            <AppText variant="label" color="textSecondary">
              {t('rx.days', { count: medicine.days })}
            </AppText>
          </View>
          <AppText variant="small" color="textSecondary">
            {medicine.dose} · {medicine.timing.map((timing) => t(`dose.${timing}`)).join(', ')}
          </AppText>
          {medicine.instructions && (
            <AppText variant="small" color="textSecondary">
              {medicine.instructions}
            </AppText>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
});
