import { View, Text, TouchableOpacity, Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

export const Topbar = () => {
      const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userinfo=await jwtDecode(token||"");
        console.log(userinfo)
        setUser(userinfo)
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
    loadUser();
  }, []);
  return (
    <View className="bg-primary w-full h-16 flex-row items-center justify-between px-4 pt-3">
      {/* Left - App logo or title */}
      <Text className="text-white text-xl font-bold">ConnectIIT</Text>

      {/* Right - Icons */}
      <View className="flex-row space-x-4">
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Image
            source={{  uri: `${user?.image}`, }}
            className="w-10 h-10 rounded-full border-2 border-orange"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
