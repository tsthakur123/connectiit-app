import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import {jwtDecode} from "jwt-decode";
import { View, Text, Image, TouchableOpacity, ScrollView, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pencil } from "lucide-react-native";

import { ExpandableSection } from "@/components/ExpandableSection";

export const ProfileScreen = () => {
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
    <ScrollView className="flex-1 bg-primary">
      {/* Header Section */}
      <View className="h-32 w-full bg-[#1A1A1A] rounded-b-[3rem] overflow-hidden relative">
        {/* Background Image */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1513909894411-7d7e04c28ecd?q=80",
          }}
          className="w-full h-full opacity-50"
          resizeMode="cover"
        />

        {/* Profile Picture */}
        <View className="absolute left-1/2 -translate-x-1/2 items-center">
          <View className="w-28 h-28 rounded-full bg-white shadow-lg justify-center items-center overflow-hidden">
            <Image
              source={{
                uri: `${user?.image}`,
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Edit Icon */}
          <TouchableOpacity className="absolute bottom-2 right-2 bg-[#FE744D] p-2 rounded-full">
            <Pencil size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Name + College */}
      <View className="mt-6 items-center">
        <Text className="text-3xl font-bold text-white">{user?.name || "User"}</Text>
        <Text className="text-lg text-gray-300 font-semibold">
          IIT (BHU) Varanasi
        </Text>
          <TouchableOpacity
            className="mt-2 px-4 py-1 border-2 border-gray-500 rounded-full"
            onPress={async () => {
              try {
                await AsyncStorage.removeItem("token"); 
                console.log("JWT removed, logged out");
                router.push("/");
              } catch (e) {
                console.error("Error clearing token:", e);
              }
            }}
          >
            <Text className="text-lg text-gray-300 font-semibold">Logout</Text>
          </TouchableOpacity>
      </View>

      {/* Followers / Following */}
      <View className="mt-6 mx-auto bg-white2 w-[90%] h-16 rounded-full flex-row items-center justify-around shadow-md">
        <View className="items-center">
          <Text className="text-secondary font-bold">Followers</Text>
          <Text className="text-xl font-bold text-primary">120</Text>
        </View>

        <View className="items-center">
          <Text className="text-secondary font-bold">Following</Text>
          <Text className="text-xl font-bold text-primary">180</Text>
        </View>
      </View>

      {/* Expandable Section */}
      <View className="mt-4 px-4">
        <ExpandableSection />
      </View>

      {/* Posts Grid */}
      <View className="flex flex-wrap flex-row px-2 gap-2 mt-10">
        {[...Array(12)].map((_, index) => {
          const isLarge = index % 4 === 0;

          return (
            <Image
              key={index}
              source={{ uri: `https://picsum.photos/id/${index + 10}/500/500` }}
              className={`rounded-xl ${
                isLarge ? "w-[66%] h-48" : "w-[31%] h-32"
              }`}
              style={{ marginBottom: 8 }}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};
