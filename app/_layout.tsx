// app/_layout.tsx
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TabLayout from "./(tabs)/_layout";
import { StatusBar } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { SocketProvider } from "@/context/SocketContext";

export default function Layout() {
  const { hydrate, user, loading } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SocketProvider>
        <StatusBar backgroundColor="#1B1730" translucent={false} />
        <Stack screenOptions={{ headerShown: false }}>
          {/* Public routes */}
          <Stack.Screen name="index" />
          
          {/* Protected routes */}
          <Stack.Screen 
            name="(tabs)" 
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="profile" />
          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
            }}
          />
        </Stack>
      </SocketProvider>
    </GestureHandlerRootView>
  );
}
