import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { usePrescriptions } from '@/api/queries';
import { AppText, Card, DoseSchedule, EmptyState, Skeleton } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { formatDate } from '@/utils/format';
import { courseDay, daysLeft, isPrescriptionActive, todaysDoses } from '@/utils/prescriptions';

// One prescription: who prescribed it, today's doses to tick off, and the full medicine list.
// There's no GET /prescriptions/:id in the API, so it's found in the list (already cached).
export function PrescriptionDetailView() {
  const { colors, spacing, radius } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: prescriptions, isLoading } = usePrescriptions();
  const prescription = prescriptions?.find((p) => p.id === id);

  const header = <Stack.Screen options={{ headerShown: true, title: 'Prescription' }} />;

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
          title="Prescription not found"
          message="It may have been removed by the clinic."
          actionLabel="Back to medicines"
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
          Issued {formatDate(prescription.issuedAt)}
          {prescription.patientName ? ` · for ${prescription.patientName}` : ''}
        </AppText>
        {prescription.diagnosis && (
          <AppText variant="bodyBold" style={{ marginTop: spacing.sm }}>
            {prescription.diagnosis}
          </AppText>
        )}
        <AppText variant="label" color={active ? 'success' : 'textSecondary'} style={{ marginTop: spacing.sm }}>
          {active
            ? `Day ${courseDay(prescription)} of ${longest} · ${daysLeft(prescription)} days left`
            : 'Course completed'}
        </AppText>
      </Card>

      <AppText variant="title">Today</AppText>
      {doses.length > 0 ? (
        <DoseSchedule doses={doses} />
      ) : (
        <AppText color="textSecondary">No doses today. This course is complete.</AppText>
      )}

      <AppText variant="title" style={{ marginTop: spacing.sm }}>
        All medicines
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
              {medicine.days} days
            </AppText>
          </View>
          <AppText variant="small" color="textSecondary">
            {medicine.dose} · {medicine.timing.map((t) => t[0]?.toUpperCase() + t.slice(1)).join(', ')}
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
