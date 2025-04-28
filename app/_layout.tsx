// app/_layout.tsx
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TabLayout from "./(tabs)/_layout";

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" />
      </Stack>
    </GestureHandlerRootView>
  );
}
