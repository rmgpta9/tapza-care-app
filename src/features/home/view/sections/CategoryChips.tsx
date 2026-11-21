import { Pressable, ScrollView } from 'react-native';
import { AppText, Icon, SectionTitle } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP_TARGET } from '@/theme/tokens';
import { isObject } from '@/utils/isObject';
import type { SectionProps } from './types';

interface Chip {
  id: string;
  label: string;
  icon: string;
}

function isChip(value: unknown): value is Chip {
  return (
    isObject(value) &&
    typeof value.id === 'string' &&
    typeof value.label === 'string' &&
    typeof value.icon === 'string'
  );
}

// Horizontal row of chips (Consult, Lab tests, ...). Tapping one filters the
// service grids below to that category; tapping it again clears the filter.
export function CategoryChips({ section, selectedCategory, onSelectCategory }: SectionProps) {
  const { colors, spacing, radius } = useTheme();
  const chips = section.items.filter(isChip);
  if (chips.length === 0) return null;

  return (
    <>
      <SectionTitle title={section.title} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
      >
        {chips.map((chip) => {
          const selected = chip.id === selectedCategory;
          return (
            <Pressable
              key={chip.id}
              onPress={() => onSelectCategory(selected ? null : chip.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
                minHeight: TAP_TARGET,
                paddingHorizontal: spacing.lg,
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.primary : colors.surface,
              }}
            >
              <Icon name={chip.icon} size={18} color={selected ? 'onPrimary' : 'primary'} />
              <AppText variant="label" color={selected ? 'onPrimary' : 'textPrimary'}>
                {chip.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );
}
