// app/_layout.tsx
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TabLayout from "./(tabs)/_layout";
import { StatusBar } from "react-native";

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <StatusBar backgroundColor="#1B1730" translucent={false} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" />
        <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
        }}
      />
      </Stack>
    </GestureHandlerRootView>
  );
}
