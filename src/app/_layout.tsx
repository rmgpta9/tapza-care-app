import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ConfigProvider } from '@/config/ConfigProvider';
import { loadSavedData } from '@/store/loadSavedData';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

function AppStack() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
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
