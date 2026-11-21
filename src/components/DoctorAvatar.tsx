import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { AppText } from './AppText';

// "Dr. Ananya Reddy" -> "AR"
function initials(name: string): string {
  return name
    .replace('Dr. ', '')
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('');
}

// Round doctor photo. The initials sit underneath, so they show if the photo fails to load.
export function DoctorAvatar({ name, photoUrl, size = 56 }: { name: string; photoUrl: string; size?: number }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primarySoft },
      ]}
    >
      <AppText variant="bodyBold" color="primary">
        {initials(name)}
      </AppText>
      <Image source={{ uri: photoUrl }} style={StyleSheet.absoluteFill} transition={200} accessibilityIgnoresInvertColors />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
});
