import { View, Text, Pressable, Image } from "react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import "@/global.css";

export default function Login() {
  const handleLogin = () => {
    // Replace this with actual Google Auth logic
    router.push("/(tabs)/home");

    // Right after login/signup response from backend:

    // const { setUser, setToken } = useAuthStore.getState();

    // setUser(response.user);
    // setToken(response.token);
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#1B1730] px-6">
      {/* Logo / Branding */}
      {/* <Image
        source={require('@/assets/logo.png')} // Replace with your actual logo path
        className="w-24 h-24 mb-6"
        resizeMode="contain"
      /> */}

      {/* Welcome Text */}
      <Text className="text-white text-3xl font-bold mb-2">
        Welcome to ConnectIIT
      </Text>
      <Text className="text-gray-300 text-base text-center mb-8">
        Connect, collaborate, and grow with IITians across the nation.
      </Text>

      {/* Google Sign In Button */}
      <Pressable
        onPress={handleLogin}
        className="flex-row items-center bg-[#FE744D] px-5 py-3 rounded-2xl"
      >
        <AntDesign name="google" size={20} color="white" />
        <Text className="text-white text-base font-semibold ml-3">
          Continue with Google
        </Text>
      </Pressable>

      {/* Footer */}
      <Text className="text-gray-400 text-xs mt-10 text-center">
        Only accessible by verified IITians.
      </Text>
    </View>
  );
}
