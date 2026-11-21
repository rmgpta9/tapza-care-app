import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';

export function SectionTitle({ title }: { title: string }) {
  const { spacing } = useTheme();
  if (!title) return null;

  return (
    <AppText
      variant="heading"
      accessibilityRole="header"
      style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md }}
    >
      {title}
    </AppText>
  );
}
