import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Prescription } from '@/api/types';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { formatDate } from '@/utils/format';
import { daysLeft, isPrescriptionActive } from '@/utils/prescriptions';
import { AppText } from './AppText';
import { Icon } from './Icon';

// One prescription in the list: doctor, date, who it's for and whether it's still running.
export function PrescriptionCard({ prescription }: { prescription: Prescription }) {
  const { colors, spacing, radius } = useTheme();
  const t = useT();
  const active = isPrescriptionActive(prescription);
  const left = daysLeft(prescription);
  const count = prescription.medicines.length;

  return (
    <Pressable
      onPress={() => router.push(`/prescription/${prescription.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`Prescription from ${prescription.doctorName}, ${formatDate(prescription.issuedAt)}`}
      style={({ pressed }) => [
        {
          gap: spacing.xs,
          padding: spacing.lg,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.row}>
        <AppText variant="bodyBold" style={styles.flex}>
          {prescription.doctorName}
        </AppText>
        <View
          style={{
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            borderRadius: radius.sm,
            backgroundColor: active ? colors.successSoft : colors.border,
          }}
        >
          <AppText variant="label" color={active ? 'success' : 'textSecondary'}>
            {active ? (left === 1 ? t('rx.oneDayLeft') : t('rx.daysLeft', { count: left })) : t('rx.completed')}
          </AppText>
        </View>
      </View>

      {prescription.diagnosis && <AppText color="textSecondary">{prescription.diagnosis}</AppText>}

      <AppText variant="small" color="textSecondary">
        {formatDate(prescription.issuedAt)} · {prescription.clinicName}
      </AppText>

      <View style={[styles.row, { gap: spacing.xs, marginTop: spacing.xs }]}>
        <Icon name="medkit-outline" size={16} color="primary" />
        <AppText variant="label" color="primary" style={styles.flex}>
          {count === 1 ? t('rx.oneMedicine') : t('rx.medicines', { count })}
          {prescription.patientName ? ` · ${t('rx.forPatient', { name: prescription.patientName })}` : ''}
        </AppText>
        <Icon name="chevron-forward" size={18} color="textSecondary" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
});
