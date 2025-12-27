import { View, Text, Image, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:3006/api/users/me/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <View
        style={{ backgroundColor: "#1B1730" }}
        className="flex-1 justify-center items-center"
      >
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!user) {
    return (
      <View
        style={{ backgroundColor: "#1B1730" }}
        className="flex-1 justify-center items-center"
      >
        <Text className="text-white">User not found</Text>
      </View>
    );
  }

  return (
    <View
      style={{ backgroundColor: "#1B1730" }}
      className="flex-1 px-4 pt-6"
    >
      <View className="items-center">
        <Image
          source={{ uri: user.profile_url }}
          className="w-28 h-28 rounded-full"
        />
        <Text
          style={{ color: "#fafafa" }}
          className="text-xl font-bold mt-3"
        >
          {user.name}
        </Text>
        <Text style={{ color: "#9CA3AF" }}>
          @{user.username}
        </Text>
      </View>

      <View
        style={{ backgroundColor: "#262438" }}
        className="flex-row justify-around mt-6 py-4 rounded-2xl"
      >
        <View className="items-center">
          <Text style={{ color: "#fafafa" }} className="font-bold">
            {user.posts_count ?? 0}
          </Text>
          <Text className="text-gray-400 text-sm">Posts</Text>
        </View>
        <View className="items-center">
          <Text style={{ color: "#fafafa" }} className="font-bold">
            {user.followers_count ?? 0}
          </Text>
          <Text className="text-gray-400 text-sm">Followers</Text>
        </View>
        <View className="items-center">
          <Text style={{ color: "#fafafa" }} className="font-bold">
            {user.following_count ?? 0}
          </Text>
          <Text className="text-gray-400 text-sm">Following</Text>
        </View>
      </View>

      <View className="mt-6">
        <Text style={{ color: "#fafafa" }} className="font-semibold">
          Bio
        </Text>
        <Text style={{ color: "#D1D5DB" }} className="mt-2">
          {user.bio || "No bio available"}
        </Text>
      </View>
    </View>
  );
}
