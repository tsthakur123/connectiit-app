import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export const ProfileScreen = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
        <Text className="text-xl font-bold">tarun_singh</Text>
        <FontAwesome name="bars" size={24} />
      </View>

      {/* Profile Info */}
      <View className="flex-row items-center px-4 mt-4">
        {/* Profile Picture */}
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          className="w-20 h-20 rounded-full"
        />

        {/* Stats */}
        <View className="flex-row justify-around flex-1 ml-6">
          <View className="items-center">
            <Text className="font-bold text-lg">34</Text>
            <Text className="text-gray-500 text-sm">Posts</Text>
          </View>
          <View className="items-center">
            <Text className="font-bold text-lg">2.1k</Text>
            <Text className="text-gray-500 text-sm">Followers</Text>
          </View>
          <View className="items-center">
            <Text className="font-bold text-lg">180</Text>
            <Text className="text-gray-500 text-sm">Following</Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      <View className="px-4 mt-4">
        <Text className="font-semibold">Tarun Singh</Text>
        <Text>🧠 Building ConnectIIT | IIT (BHU)</Text>
        <Text className="text-blue-500">connectiit.app</Text>
      </View>

      {/* Edit Profile Button */}
      <View className="px-4 mt-4">
        <TouchableOpacity className="border border-gray-300 rounded-lg py-1 items-center">
          <Text className="font-medium">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Grid (placeholder) */}
      <View className="flex-row flex-wrap mt-6">
        {[...Array(12)].map((_, index) => (
          <Image
            key={index}
            source={{ uri: `https://picsum.photos/id/${index + 10}/200/200` }}
            className="w-1/3 h-32"
          />
        ))}
      </View>
    </ScrollView>
  );
};
