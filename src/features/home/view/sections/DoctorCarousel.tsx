import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useDoctors } from '@/api/queries';
import type { Doctor } from '@/api/types';
import { AppText, DoctorAvatar, Notice, SectionTitle, Skeleton } from '@/components';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { formatRupees, formatSlot } from '@/utils/format';
import { isObject } from '@/utils/isObject';
import type { SectionProps } from './types';

const CARD_WIDTH = 250;
const PHOTO_SIZE = 56;

// Horizontal cards: photo, name, specialty, languages and next available slot.
// The config lists which doctors to show; their details come from GET /doctors.
export function DoctorCarousel({ section }: SectionProps) {
  const { spacing } = useTheme();
  const t = useT();
  const { data: doctors, isLoading, error, refetch } = useDoctors();

  const wantedIds = section.items
    .map((item) => (isObject(item) && typeof item.doctorId === 'string' ? item.doctorId : null))
    .filter((id): id is string => id !== null);

  // Keep the order from the config.
  const shown = wantedIds
    .map((id) => doctors?.find((doctor) => doctor.id === id))
    .filter((doctor): doctor is Doctor => doctor !== undefined);

  if (!isLoading && !error && shown.length === 0) return null;

  return (
    <>
      <SectionTitle title={section.title} />

      {error ? (
        <View style={{ paddingHorizontal: spacing.lg }}>
          <Notice message={t('home.doctorsFailed')} actionLabel={t('common.retry')} onAction={() => refetch()} />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
        >
          {isLoading
            ? [1, 2, 3].map((n) => <DoctorCardSkeleton key={n} />)
            : shown.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
        </ScrollView>
      )}
    </>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const { colors, spacing, radius } = useTheme();
  const t = useT();

  return (
    <Pressable
      onPress={() => router.push(`/book/${doctor.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${doctor.name}, ${doctor.specialty}`}
      style={({ pressed }) => [
        styles.card,
        {
          padding: spacing.lg,
          gap: spacing.sm,
          borderRadius: radius.lg,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.row, { gap: spacing.md }]}>
        <DoctorAvatar name={doctor.name} photoUrl={doctor.photoUrl} size={PHOTO_SIZE} />
        <View style={styles.flex}>
          <AppText variant="bodyBold" numberOfLines={1}>
            {doctor.name}
          </AppText>
          <AppText variant="small" color="textSecondary" numberOfLines={1}>
            {doctor.specialty}
          </AppText>
        </View>
      </View>

      <AppText variant="small" color="textSecondary" numberOfLines={1}>
        {t('common.speaks', { languages: doctor.languages.join(', ') })}
      </AppText>

      <View
        style={[
          styles.slot,
          {
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            borderRadius: radius.sm,
            backgroundColor: doctor.nextAvailableAt ? colors.successSoft : colors.warningSoft,
          },
        ]}
      >
        <AppText variant="label" color={doctor.nextAvailableAt ? 'success' : 'warning'}>
          {doctor.nextAvailableAt
            ? t('common.next', { slot: formatSlot(doctor.nextAvailableAt) })
            : t('common.noSlotsThisWeek')}
        </AppText>
      </View>

      {doctor.feeInr > 0 && (
        <AppText variant="bodyBold">
          {formatRupees(doctor.feeInr)}{' '}
          <AppText variant="small" color="textSecondary">
            {t('common.consultation')}
          </AppText>
        </AppText>
      )}
    </Pressable>
  );
}

// Same size and layout as DoctorCard, in grey, while doctors load.
function DoctorCardSkeleton() {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { padding: spacing.lg, gap: spacing.sm, borderRadius: radius.lg, borderColor: colors.border, backgroundColor: colors.surface },
      ]}
    >
      <View style={[styles.row, { gap: spacing.md }]}>
        <Skeleton width={PHOTO_SIZE} height={PHOTO_SIZE} radius={PHOTO_SIZE / 2} />
        <View style={[styles.flex, { gap: spacing.xs }]}>
          <Skeleton width="80%" height={16} />
          <Skeleton width="50%" height={12} />
        </View>
      </View>
      <Skeleton width="70%" height={12} />
      <Skeleton width="60%" height={24} />
      <Skeleton width="40%" height={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: CARD_WIDTH, borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  slot: { alignSelf: 'flex-start' },
});
