import { View } from 'react-native';
import { AppText, Icon } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP_TARGET } from '@/theme/tokens';
import { isObject } from '@/utils/isObject';
import type { SectionProps } from './types';

// A thin coloured band with one message, e.g. "Free BP check this week".
export function OfferStrip({ section }: SectionProps) {
  const { spacing } = useTheme();
  const item = section.items[0];

  const message = isObject(item) && typeof item.message === 'string' ? item.message : section.title;
  const icon = isObject(item) && typeof item.icon === 'string' ? item.icon : 'pricetag-outline';
  if (!message) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        minHeight: TAP_TARGET,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
      }}
    >
      <Icon name={icon} color="primary" />
      <AppText variant="bodyBold" style={{ flex: 1 }}>
        {message}
      </AppText>
    </View>
  );
}
