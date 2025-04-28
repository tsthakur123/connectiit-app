import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router } from "expo-router";

export const Topbar = () => {
  return (
    <View className="bg-primary w-full h-16 flex-row items-center justify-between px-4 pt-3">
      {/* Left - App logo or title */}
      <Text className="text-white text-xl font-bold">ConnectIIT</Text>

      {/* Right - Icons */}
      <View className="flex-row space-x-4">
        <Link href='/profile'>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <FontAwesome size={24} color="white" name="user"/>
        </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};
