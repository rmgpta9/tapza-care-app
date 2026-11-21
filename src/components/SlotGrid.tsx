import { Pressable, StyleSheet, View } from 'react-native';
import type { Slot } from '@/api/types';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP_TARGET } from '@/theme/tokens';
import { formatTime } from '@/utils/format';
import { AppText } from './AppText';

interface SlotGridProps {
  slots: Slot[];
  selectedId: string | null;
  onSelect: (slot: Slot) => void;
}

// Time buttons split into "Morning" and "Evening". Booked slots are greyed out.
export function SlotGrid({ slots, selectedId, onSelect }: SlotGridProps) {
  const { spacing } = useTheme();
  const t = useT();

  // The clinic's morning session ends before 1 PM and the evening one starts after 4 PM,
  // so 2 PM is a safe place to split them.
  const morning = slots.filter((slot) => new Date(slot.startsAt).getHours() < 14);
  const evening = slots.filter((slot) => new Date(slot.startsAt).getHours() >= 14);

  return (
    <View style={{ gap: spacing.lg }}>
      <SlotGroup title={t('slots.morning')} slots={morning} selectedId={selectedId} onSelect={onSelect} />
      <SlotGroup title={t('slots.evening')} slots={evening} selectedId={selectedId} onSelect={onSelect} />
    </View>
  );
}

function SlotGroup({ title, slots, selectedId, onSelect }: SlotGridProps & { title: string }) {
  const { colors, spacing, radius } = useTheme();
  const t = useT();
  if (slots.length === 0) return null;

  return (
    <View style={{ gap: spacing.sm }}>
      <AppText variant="label" color="textSecondary">
        {title}
      </AppText>
      <View style={[styles.grid, { gap: spacing.sm }]}>
        {slots.map((slot) => {
          const selected = slot.id === selectedId;
          return (
            <Pressable
              key={slot.id}
              disabled={!slot.available}
              onPress={() => onSelect(slot)}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: !slot.available }}
              accessibilityLabel={`${formatTime(slot.startsAt)}${slot.available ? '' : `, ${t('slots.booked')}`}`}
              style={[
                styles.slot,
                {
                  minHeight: TAP_TARGET,
                  borderRadius: radius.md,
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected ? colors.primary : slot.available ? colors.surface : colors.skeleton,
                },
              ]}
            >
              <AppText
                variant="label"
                color={selected ? 'onPrimary' : slot.available ? 'textPrimary' : 'textSecondary'}
                style={slot.available ? undefined : styles.booked}
              >
                {formatTime(slot.startsAt)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  // 4 per row: each takes a bit under a quarter, the gap fills the rest
  slot: { width: '22.5%', alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  booked: { textDecorationLine: 'line-through' },
});
