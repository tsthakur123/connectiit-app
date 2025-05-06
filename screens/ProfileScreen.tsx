import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ExpandableSection } from "@/components/ExpandableSection";
import { Pencil } from "lucide-react-native";

export const ProfileScreen = () => {
  return (
    <ScrollView className="flex-1 bg-primary">
      {/* Header */}
      <View className="flex-1 h-72">
        <View className="flex-1 h-72 rounded-b-[3rem] overflow-hidden relative">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1513909894411-7d7e04c28ecd?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            className="w-full h-full opacity-95"
            resizeMode="cover" // Ensures it fills and crops if necessary
          />
          {/* Profile Info */}
          <View className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <View className="bg-white w-32 h-32 rounded-full flex-1 justify-center items-center shadow-md shadow-black">
              <View className="w-[7.5rem] h-[7.5rem] rounded-full overflow-hidden">
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1921&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  }}
                  className="w-full h-full"
                  resizeMode="cover" // Ensures it fills and crops if necessary
                />
              </View>
            </View>
            <View className="flex-1 justify-center">
              <Text className="text-2xl font-bold text-center text-[#fafafa] shadow-xl shadow-black">
                Tarun Singh
              </Text>
              <Text className="font-semibold text-center text-[#fafafa] shadow-xl shadow-black">
                IIT (BHU) Varanasi
              </Text>
            </View>
          </View>
        </View>
        <View
  className="absolute h-14 pl-10 rounded-full bg-white2 bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 flex-row items-center justify-between px-4"
  style={{ width: 330 }}
>
  {/* Left: Followers & Following */}
  <View className="flex-row gap-16">
    <View className="items-center">
      <Text className="text text-secondary font-bold">Followers</Text>
      <Text className="text-lg font-bold text-primary">120</Text>
    </View>
    <View className="items-center">
      <Text className="text-secondary font-bold">Following</Text>
      <Text className="text-lg font-bold text-primary">180</Text>
    </View>
  </View>

  {/* Right: Edit Icon */}
  <TouchableOpacity className="p-2 rounded-full bg-[#FE744D]">
    <Pencil size={16} color="white" />
  </TouchableOpacity>
</View>
      </View>
      <ExpandableSection/>

           {/* Posts Grid - Bento Style */}
      <View className="flex flex-wrap flex-row px-2 gap-2 mt-10">
        {[...Array(12)].map((_, index) => {
          const isLarge =
            index === 0 || index === 4 || index === 8; // Every 4th is large

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
