import { View, Text, TouchableOpacity, Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import NotificationsButton from './NotificationsButton';
const getuserInfo = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      return null};

    const userinfo: any = jwtDecode(token || "");
    console.log("Decoded User Info:", userinfo);

    return userinfo;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const Topbar = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await getuserInfo();
      setUser(userInfo);
    };
    fetchUser();
  }, []);

  return (
    <View className="bg-primary w-full h-16 flex-row items-center justify-between px-4 pt-3">
      {/* Left - App logo or title */}
      <Text className="text-white text-xl font-bold">ConnectIIT</Text>

      {/* Right - Icons */}
      <View className="flex-row space-x-4">
        <NotificationsButton />
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Image
            source={{ uri: user?.image  }}
            className="w-10 h-10 rounded-full border-2 border-orange"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
