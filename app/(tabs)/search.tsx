import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router"; // ✅

const dummyUsers = Array.from({ length: 15 }, (_, i) => ({
  id: i.toString(),
  username: `user${i}`,
  fullname: `User Fullname ${i}`,
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
}));

const Search = () => {
  const [query, setQuery] = useState("");
  const router = useRouter(); // ✅

  const filteredUsers = dummyUsers.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  );

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
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        className="mt-2"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({
              pathname: "/profile/[username]",
              params: { username: item.username }
            })} // ✅ Navigate
            className="flex-row items-center bg-secondary rounded-2xl p-4 mb-3"
          >
            <Image
              source={{ uri: item.avatar }}
              className="w-12 h-12 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-white font-semibold">{item.username}</Text>
              <Text className="text-gray-400 text-sm">{item.fullname}</Text>
            </View>
            <TouchableOpacity className="bg-orange px-4 py-1.5 rounded-xl">
              <Text className="text-white font-medium text-sm">Follow</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
