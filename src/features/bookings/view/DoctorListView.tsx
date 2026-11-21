import { router, Stack } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useDoctors } from '@/api/queries';
import { AppText, DoctorAvatar, EmptyState, Skeleton } from '@/components';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { formatRupees, formatSlot } from '@/utils/format';

// List of all doctors. Tapping one opens the booking screen for that doctor.
export function DoctorListView() {
  const { colors, spacing, radius } = useTheme();
  const t = useT();
  const { data: doctors, isLoading, error, refetch } = useDoctors();

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: t('doctors.title') }} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
        {isLoading &&
          [1, 2, 3, 4].map((n) => (
            <View key={n} style={[styles.row, { gap: spacing.md, padding: spacing.lg }]}>
              <Skeleton width={56} height={56} radius={28} />
              <View style={[styles.flex, { gap: spacing.xs }]}>
                <Skeleton width="70%" height={16} />
                <Skeleton width="45%" height={12} />
              </View>
            </View>
          ))}

        {error && (
          <EmptyState
            icon="cloud-offline-outline"
            title={t('doctors.failedTitle')}
            message={t('common.offline')}
            actionLabel={t('common.tryAgain')}
            onAction={() => refetch()}
          />
        )}

        {doctors?.length === 0 && (
          <EmptyState icon="people-outline" title={t('doctors.emptyTitle')} message={t('doctors.emptyMessage')} />
        )}

        {doctors?.map((doctor) => (
          <Pressable
            key={doctor.id}
            onPress={() => router.push(`/book/${doctor.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`${doctor.name}, ${doctor.specialty}`}
            style={({ pressed }) => [
              styles.row,
              {
                gap: spacing.md,
                padding: spacing.lg,
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <DoctorAvatar name={doctor.name} photoUrl={doctor.photoUrl} />
            <View style={[styles.flex, { gap: spacing.xs }]}>
              <AppText variant="bodyBold">{doctor.name}</AppText>
              <AppText variant="small" color="textSecondary">
                {doctor.specialty}
                {doctor.feeInr > 0 ? ` · ${formatRupees(doctor.feeInr)}` : ''}
              </AppText>
              <AppText variant="label" color={doctor.nextAvailableAt ? 'success' : 'warning'}>
                {doctor.nextAvailableAt
                  ? t('common.next', { slot: formatSlot(doctor.nextAvailableAt) })
                  : t('common.noSlotsThisWeek')}
              </AppText>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
});
