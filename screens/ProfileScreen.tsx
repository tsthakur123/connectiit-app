<<<<<<< Updated upstream
import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ExpandableSection } from "@/components/ExpandableSection";
=======
import React, { useCallback, useState } from "react";
import { router } from "expo-router";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
>>>>>>> Stashed changes
import { Pencil } from "lucide-react-native";

export const ProfileScreen = () => {
<<<<<<< Updated upstream
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
=======
  const [user, setUser] = useState<any>(null);
  const [userposts, setUserposts] = useState<any>([]);

  const loadUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const userinfo: any = jwtDecode(token || "");
      const usedata = await axios.get(
        `http://localhost:3006/api/users/me/${userinfo.user_id}`
      );
      const response = await axios.get(
        `http://localhost:3009/api/post/user/${userinfo.user_id}/posts`
      );

      setUser(usedata.data);
      setUserposts(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  return (
    <ScrollView className="flex-1 bg-primary">
      {/* Header Section */}
      <View className="h-32 w-full bg-[#1A1A1A] rounded-b-[3rem] overflow-hidden relative">
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
              source={{ uri: `${user?.profile_url}` }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Edit Icon */}
          <TouchableOpacity
            className="absolute bottom-2 right-2 bg-[#FE744D] p-2 rounded-full"
            onPress={() => router.push("/edit-profile")}
          >
            <Pencil size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Name + College + Bio + Secondary Email */}
      <View className="mt-6 items-center px-4">
        <Text className="text-3xl font-bold text-white">{user?.name || "User"}</Text>
        <Text className="text-lg text-white/70 font-semibold">{user?.college || "IIT"}</Text>

        <View className="mt-4 w-full rounded-xl p-4" style={{ backgroundColor: "#262438" }}>
          {user?.bio ? (
            <>
              <Text className="text-white font-semibold mb-2">Bio</Text>
              <Text className="text-white/70 text-sm mb-3">{user.bio}</Text>
            </>
          ) : null}

          {user?.secondary_email ? (
            <>
              <Text className="text-white font-semibold mb-2">Secondary Email</Text>
              <Text className="text-white/70 text-sm">{user.secondary_email}</Text>
            </>
          ) : null}
        </View>

        <TouchableOpacity
          className="mt-4 px-4 py-1 rounded-full"
          style={{ borderWidth: 2, borderColor: "#FE744D" }}
          onPress={async () => {
            try {
              await AsyncStorage.removeItem("token");
              router.push("/");
            } catch (e) {
              console.error("Error clearing token:", e);
            }
          }}
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Followers / Following */}
      <View className="mt-6 mx-auto bg-white2 w-[90%] h-16 rounded-full flex-row items-center justify-around shadow-md">
        <View className="items-center">
          <Text className="text-secondary font-bold">Followers</Text>
          <Text className="text-xl font-bold text-primary">{user?.followers_count || 0}</Text>
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  {/* Right: Edit Icon */}
  <TouchableOpacity className="p-2 rounded-full bg-[#FE744D]">
    <Pencil size={16} color="white" />
  </TouchableOpacity>
</View>
=======
        <View className="items-center">
          <Text className="text-secondary font-bold">Following</Text>
          <Text className="text-xl font-bold text-primary">{user?.following_count || 0}</Text>
        </View>
>>>>>>> Stashed changes
      </View>
      <ExpandableSection/>

<<<<<<< Updated upstream
           {/* Posts Grid - Bento Style */}
      <View className="flex flex-wrap flex-row px-2 gap-2 mt-10">
        {[...Array(12)].map((_, index) => {
          const isLarge =
            index === 0 || index === 4 || index === 8; // Every 4th is large
=======
      {/* Expandable Section */}
      <View className="mt-4 px-4">
        <ExpandableSection interests={user?.interests || []} />
      </View>

      {/* Posts Grid */}
      <View className="mt-10 px-2 flex flex-row flex-wrap justify-between">
        {userposts.map((post, index) => {
          const isLarge = index % 4 === 0;
          const hasImage = post.media_urls && post.media_urls.length > 0;
          const imageUrl = hasImage ? post.media_urls[0] : null;
>>>>>>> Stashed changes

          return (
            <View
              key={post.id}
              style={{
                width: isLarge ? "66%" : "31%",
                marginBottom: 8,
              }}
            >
              {hasImage ? (
                <Image
                  source={{ uri: imageUrl }}
                  className="rounded-xl"
                  style={{
                    height: isLarge ? 220 : 140,
                    backgroundColor: "#262438",
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  className="rounded-xl p-4 justify-center"
                  style={{
                    height: isLarge ? 220 : 140,
                    backgroundColor: "#262438",
                  }}
                >
                  <Text className="text-white font-semibold text-base">{post.text_content}</Text>
                </View>
              )}

              {/* Likes & comments overlay */}
              <View
                className="absolute bottom-2 left-2 px-2 py-1 rounded-full flex-row items-center"
                style={{ backgroundColor: "#1B1730AA" }}
              >
                <Text className="text-white text-xs mr-2">❤️ {post.likes_count}</Text>
                <Text className="text-white text-xs">💬 {post.comments_count}</Text>
              </View>

              {/* Interest tag */}
              {post.interest_tags?.length > 0 && (
                <View
                  className="absolute top-2 left-2 px-2 py-1 rounded-full"
                  style={{ backgroundColor: "#FE744DAA" }}
                >
                  <Text className="text-white text-xs">#{post.interest_tags[0]}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

    </ScrollView>
  );
};
