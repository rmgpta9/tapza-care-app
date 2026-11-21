import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';
import type { DoseTiming } from '@/api/types';
import { useT, type TranslationKey } from '@/i18n';
import { useDoses } from '@/store/doses';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP_TARGET } from '@/theme/tokens';
import { TIMINGS, type Dose } from '@/utils/prescriptions';
import { AppText } from './AppText';
import { Icon } from './Icon';

const TIMING_INFO: Record<DoseTiming, { label: TranslationKey; time: string; icon: string }> = {
  morning: { label: 'dose.morning', time: '8 AM', icon: 'sunny-outline' },
  afternoon: { label: 'dose.afternoon', time: '2 PM', icon: 'partly-sunny-outline' },
  night: { label: 'dose.night', time: '9 PM', icon: 'moon-outline' },
};

interface DoseScheduleProps {
  doses: Dose[];
  showWhoFor?: boolean; // show the doctor / family member on each row (used when mixing prescriptions)
}

// Today's doses in three groups: Morning, Afternoon, Night. Tap a row to mark it taken.
export function DoseSchedule({ doses, showWhoFor = false }: DoseScheduleProps) {
  const { spacing } = useTheme();
  const t = useT();

  return (
    <View style={{ gap: spacing.lg }}>
      {TIMINGS.map((timing) => {
        const group = doses.filter((dose) => dose.timing === timing);
        if (group.length === 0) return null;
        const info = TIMING_INFO[timing];

        return (
          <View key={timing} style={{ gap: spacing.sm }}>
            <View style={[styles.row, { gap: spacing.sm }]}>
              <Icon name={info.icon} color="primary" />
              <AppText variant="heading">{t(info.label)}</AppText>
              <AppText color="textSecondary">· {info.time}</AppText>
            </View>
            {group.map((dose) => (
              <DoseRow key={dose.key} dose={dose} showWhoFor={showWhoFor} />
            ))}
          </View>
        );
      })}
    </View>
  );
}

function DoseRow({ dose, showWhoFor }: { dose: Dose; showWhoFor: boolean }) {
  const { colors, spacing, radius } = useTheme();
  const taken = useDoses((s) => s.taken[dose.key] ?? false);
  const toggleDose = useDoses((s) => s.toggleDose);
  const t = useT();

  function onPress() {
    toggleDose(dose.key);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  const details = [dose.medicine.dose, dose.medicine.instructions].filter(Boolean).join(' · ');
  const whoFor = dose.prescription.patientName ?? dose.prescription.doctorName;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: taken }}
      accessibilityLabel={`${dose.medicine.name}, ${details}`}
      accessibilityHint={taken ? t('dose.markNotTaken') : t('dose.markTaken')}
      style={({ pressed }) => [
        styles.row,
        {
          gap: spacing.md,
          minHeight: TAP_TARGET + 16,
          padding: spacing.md,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: taken ? colors.success : colors.border,
          backgroundColor: taken ? colors.successSoft : colors.surface,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {/* the tick box */}
      <View
        style={[
          styles.check,
          {
            borderColor: taken ? colors.success : colors.border,
            backgroundColor: taken ? colors.success : colors.surface,
          },
        ]}
      >
        {taken && <Icon name="checkmark" size={20} color="onPrimary" />}
      </View>

      <View style={styles.flex}>
        <AppText variant="bodyBold" style={taken ? styles.done : undefined}>
          {dose.medicine.name}
        </AppText>
        <AppText variant="small" color="textSecondary">
          {details}
        </AppText>
        {showWhoFor && (
          <AppText variant="small" color="textSecondary">
            {dose.prescription.patientName ? t('rx.forPatient', { name: whoFor }) : whoFor}
          </AppText>
        )}
      </View>

      {taken && (
        <AppText variant="label" color="success">
          {t('dose.taken')}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  check: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  done: { textDecorationLine: 'line-through' },
});
