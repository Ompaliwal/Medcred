/**
 * Root layout — Registers all top-level route groups.
 * Unauthenticated flow starts at (auth)/splash.
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/context/AuthContext';

export const unstable_settings = {
  // Default anchor: auth splash
  anchor: '(auth)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Root redirect — sends "/" to /(auth)/splash */}
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/* Auth flow — splash → onboarding → welcome → login / register */}
          <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'none' }} />

          {/* Main app tabs — shown after successful login/registration */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Modal */}
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
