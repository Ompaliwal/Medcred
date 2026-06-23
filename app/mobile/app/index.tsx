/**
 * app/index.tsx — Root entry point redirect.
 *
 * Expo Router lands here first (route "/").
 * We immediately redirect to the auth splash screen.
 * Once auth is complete, the login/register screens
 * call router.replace('/(tabs)') to move into the main app.
 */

import { Redirect } from 'expo-router';

export default function Index() {
  // Always start at the splash screen.
  // Future: check AsyncStorage for a saved JWT token here —
  // if found and valid, redirect to /(tabs) instead.
  return <Redirect href="/(auth)/splash" />;
}
