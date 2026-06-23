/**
 * (auth)/_layout.tsx — Stack navigator for all authentication screens.
 * No header shown; each screen manages its own top-bar UI.
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="otp-verify" />
        <Stack.Screen name="register" />
        <Stack.Screen name="aadhaar-verify" />
        <Stack.Screen name="kyc-pending" />
      </Stack>
    </>
  );
}
