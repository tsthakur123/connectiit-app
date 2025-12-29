import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

import {SearchSkeleton} from "@/components/SearchSkeleton";

const Search = () => {
  const router = useRouter();

  const [userinfo, setUserinfo] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ───────────────────────────────
  // Load user info from token
  // ───────────────────────────────
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const decoded: any = jwtDecode(token);
      setUserinfo(decoded);
    })();
  }, []);

  // ───────────────────────────────
  // Follow / Unfollow
  // ───────────────────────────────
  const toggleFollow = async (userId: string, isFriend: boolean) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !userinfo) return;

      const payload = {
        followee_id: userId,
        follower_id: userinfo.user_id,
        action: isFriend ? "unfollow" : "follow",
      };

      await axios.post(
        "http://localhost:3006/api/users/follow/user",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId ? { ...u, isFriend: !isFriend } : u
        )
      );
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  // ───────────────────────────────
  // Search loader
  // ───────────────────────────────
  const loader = async (q: string) => {
    if (!q || q.trim().length === 0) {
      setUsers([]);
      setLoading(false);
      return;
    }

    if (!userinfo) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:3006/api/users/${q}`,
        { user_id: userinfo.user_id }
      );

      setUsers(res.data);
    } catch (err) {
      console.error("Search error:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────
  // Debounce search
  // ───────────────────────────────
  useEffect(() => {
    const delay = setTimeout(() => {
      loader(query);
    }, 400);

    return () => clearTimeout(delay);
  }, [query, userinfo]);

  return (
    <SafeAreaView className="flex-1 bg-primary px-4">
      {/* Search bar */}
      <View className="py-2">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search users..."
          placeholderTextColor="#aaa"
          className="bg-secondary text-white px-4 py-2 rounded-xl"
        />
      </View>

      {/* Results / Shimmer */}
      {loading ? (
        <SearchSkeleton />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.user_id}
          className="mt-2"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/userprofile",
                  params: { id: item.user_id },
                })
              }
              className="flex-row items-center bg-secondary rounded-2xl p-4 mb-3"
            >
              <Image
                source={{ uri: item.profile_url }}
                className="w-12 h-12 rounded-full mr-4"
              />

              <View className="flex-1">
                <Text className="text-white font-semibold">
                  {item.username}
                </Text>
                <Text className="text-gray-400 text-sm">{item.name}</Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  toggleFollow(item.user_id, item.isFriend)
                }
                className={`px-4 py-1.5 rounded-xl ${
                  item.isFriend ? "bg-gray-600" : "bg-orange"
                }`}
              >
                <Text className="text-white font-semibold">
                  {item.isFriend ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Search;
