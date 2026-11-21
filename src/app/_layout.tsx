import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { queryClient } from '@/api/queryClient';
import { ConfigProvider } from '@/config/ConfigProvider';
import { loadSavedData } from '@/store/loadSavedData';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { openRemindersOnTap, setUpNotifications } from '@/utils/notifications';

setUpNotifications();

function AppStack() {
  const { scheme, colors } = useTheme();
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {/* Headers are hidden by default; screens that want one turn it on.
          These colours apply whenever a header is shown. */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.textPrimary },
          headerShadowVisible: false,
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSavedData().finally(() => setReady(true));
  }, []);

  // Tapping a medicine reminder opens today's reminders.
  useEffect(() => openRemindersOnTap(), []);

  return (
    <GestureHandlerRootView style={styles.fill}>
      <QueryClientProvider client={queryClient}>
        {ready && (
          <ConfigProvider>
            <ThemeProvider>
              <AppStack />
            </ThemeProvider>
          </ConfigProvider>
        )}
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
