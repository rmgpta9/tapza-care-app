import { Pressable, ScrollView } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP_TARGET } from '@/theme/tokens';
import { dayParts } from '@/utils/format';
import { AppText } from './AppText';

interface DateStripProps {
  dates: string[]; // "YYYY-MM-DD"
  selected: string | null;
  onSelect: (date: string) => void;
}

// A horizontal row of day buttons: "Today 21", "Tomorrow 22", "Mon 23", ...
export function DateStrip({ dates, selected, onSelect }: DateStripProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
      {dates.map((date) => {
        const { label, day } = dayParts(date);
        const isSelected = date === selected;
        return (
          <Pressable
            key={date}
            onPress={() => onSelect(date)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${label} ${day}`}
            style={{
              minWidth: 72,
              minHeight: TAP_TARGET + 16,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: spacing.md,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: isSelected ? colors.primary : colors.border,
              backgroundColor: isSelected ? colors.primary : colors.surface,
            }}
          >
            <AppText variant="small" color={isSelected ? 'onPrimary' : 'textSecondary'}>
              {label}
            </AppText>
            <AppText variant="heading" color={isSelected ? 'onPrimary' : 'textPrimary'}>
              {day}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
