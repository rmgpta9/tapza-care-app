import { Tabs } from 'expo-router';
import { ConfigTabBar } from '@/components';
import { useTheme } from '@/theme/ThemeProvider';

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      tabBar={(props) => <ConfigTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: theme.colors.background } }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="prescriptions" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
