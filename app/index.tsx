import { Text, View, Pressable } from "react-native";
import { Link, router } from "expo-router";
import '@/global.css';

export default function Page() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl text-orange mb-4">Hi guys..</Text>

        <Pressable onPress={()=>router.push('/(tabs)/home')} className="bg-orange px-4 py-2 rounded">
          <Text className="text-white text-lg">Click to home</Text>
        </Pressable>
    </View>
  );
}
