import { View, Text, TouchableOpacity, Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router } from "expo-router";

export const Topbar = () => {
  return (
    <View className="bg-primary w-full h-16 flex-row items-center justify-between px-4 pt-3">
      {/* Left - App logo or title */}
      <Text className="text-white text-xl font-bold">ConnectIIT</Text>

      {/* Right - Icons */}
      <View className="flex-row space-x-4">
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=5" }}
            className="w-10 h-10 rounded-full border-2 border-orange"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
