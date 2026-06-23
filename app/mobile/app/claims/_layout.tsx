import { Stack } from 'expo-router';

export default function ClaimsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="upload" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
