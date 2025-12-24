import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router"; // ✅
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

const token= async()=>{
    const token = await AsyncStorage.getItem("token");
      if (!token) return;
     return token;
}

const Search = () => {
  const [userinfo, setUserinfo] = useState<any>(null);
  useEffect(() => {
    token();
  token().then(data=>{
     const userinfo: any = jwtDecode(data);
  setUserinfo(userinfo)});
  }, [])
  
  const [query, setQuery] = useState("");
  const router = useRouter(); // ✅
  const [users, setUsers] = useState<any[]>([]);

  const toggleFollow = async (userId: string, currentlyFriend: boolean) => {
    try {
      const action = currentlyFriend ? "unfollow" : "follow";

      const payload = {
        followee_id: userId,
        follower_id: userinfo.user_id,
        action: action,
      };

      const res = await axios.post(
        `http://localhost:3006/api/users/follow/user`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        // Update UI immediately
        setUsers(prev =>
          prev.map(u =>
            u.user_id === userId ? { ...u, isFriend: !currentlyFriend } : u
          )
        );
      }
    } catch (err) {
      console.error("Follow/Unfollow error:", err);
    }
  };

  const loader = async (query: string) => {
    if (!query || query.trim().length === 0) {
      setUsers([]);
      return;
    }

    try {
      const tokenValue = await AsyncStorage.getItem("token");
      if (!tokenValue) return;
      const payload={
        user_id: userinfo.user_id
      }
      const res = await axios.post(
        `http://localhost:3006/api/users/${query}`,
        payload
      );

      setUsers(res.data);
    } catch (err) {
      console.error("Search error:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      loader(query);
    }, 400); // debounce

    return () => clearTimeout(delay);
  }, [query]);


  return (
    <SafeAreaView className="flex-1 bg-primary px-4">
      {/* Search Bar */}
      <View className="py-2">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search users..."
          placeholderTextColor="#aaa"
          className="bg-secondary text-white px-4 py-2 rounded-xl"
        />
      </View>

      {/* User Cards */}
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
              <Text className="text-white font-semibold">{item.username}</Text>
              <Text className="text-gray-400 text-sm">{item.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleFollow(item.user_id, item.isFriend)}
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
    </SafeAreaView>
  );
};

export default Search;
