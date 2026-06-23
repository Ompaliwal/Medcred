import { Stack } from 'expo-router';

export default function CardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="details" />
      <Stack.Screen name="qr" />
    </Stack>
  );
}
