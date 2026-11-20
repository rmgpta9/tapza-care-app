import Ionicons from '@expo/vector-icons/Ionicons';
import type { ThemeColors } from '@/theme/buildTheme';
import { useTheme } from '@/theme/ThemeProvider';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface IconProps {
  name: string; // an Ionicons name, e.g. "home-outline"
  size?: number;
  color?: keyof ThemeColors;
}

export function Icon({ name, size = 22, color = 'textPrimary' }: IconProps) {
  const { colors } = useTheme();

  // Icon names can come from the config, so an unknown name shows a plain circle
  // instead of crashing.
  const safeName = (name in Ionicons.glyphMap ? name : 'ellipse-outline') as IoniconName;

  return <Ionicons name={safeName} size={size} color={colors[color]} />;
}
