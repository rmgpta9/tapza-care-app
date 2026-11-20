import { StyleSheet, View } from 'react-native';
import { AppText, Card, ConfigStatus, Screen } from '@/components';
import { useLayoutConfig } from '@/config/ConfigProvider';
import { useTheme } from '@/theme/ThemeProvider';

// TODO: replace with the real home sections. For now this lists what /config
// returned, so switching configs can be checked.
const KNOWN_TYPES = ['hero_banner', 'category_chips', 'quick_actions', 'service_grid', 'doctor_carousel', 'offer_strip'];

export default function HomeScreen() {
  const { config, source } = useLayoutConfig();
  const { colors, spacing, radius } = useTheme();
  const title = config.theme.festival?.greeting ?? 'Tapza Care';

  return (
    <Screen title={title} subtitle={`Config v${config.version} · ${source}`}>
      <ConfigStatus />

      {config.sections.map((section) => {
        const isKnown = KNOWN_TYPES.includes(section.type);
        // For a gradient "#A,#B" use the first colour as the preview swatch.
        const swatch = section.background.kind === 'image' ? colors.border : section.background.value.split(',')[0];

        return (
          <Card key={section.id} style={[styles.row, { gap: spacing.md, opacity: isKnown ? 1 : 0.5 }]}>
            <View
              style={{
                width: spacing.xxl,
                height: spacing.xxl,
                borderRadius: radius.sm,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: swatch,
              }}
            />
            <View style={styles.text}>
              <AppText variant="bodyBold">{section.title || section.id}</AppText>
              <AppText variant="small" color="textSecondary">
                {section.type} · {section.items.length} items
                {isKnown ? '' : ' · unknown type, will be skipped'}
              </AppText>
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { flex: 1 },
});
