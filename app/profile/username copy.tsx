import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  MapPin,
  ArrowLeft,
  MessageSquare,
  UserPlus,
} from "lucide-react-native";
import { ExpandableSection } from "@/components/ExpandableSection";
import { SafeAreaView } from "react-native-safe-area-context";

// This is dummy data. In a real app, you'd fetch this from your backend.
const dummyUsers = Array.from({ length: 15 }, (_, i) => ({
  id: i.toString(),
  username: `user${i}`,
  name: `User Fullname ${i}`,
  image: `https://i.pravatar.cc/150?img=${i + 1}`,
  location: { city: "Mumbai", region: "MH" },
  posts: Array.from({ length: 14 }, (_, pIndex) => ({
    id: pIndex,
    uri: `https://picsum.photos/id/${i * 15 + pIndex + 10}/500/500`,
  })),
}));

const UserProfileScreen = () => {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const imageLoadCount = useRef(0);

  useEffect(() => {
    // Simulate fetching user data based on username
    const fetchUserData = () => {
      setLoading(true);
      // In a real app, you would make an API call here.
      // e.g., fetch(`https://yourapi.com/users/${username}`)
      const foundUser = dummyUsers.find((u) => u.username === username);

      setTimeout(() => {
        // Simulate network delay
        if (foundUser) {
          setUser(foundUser);
          // If user has no posts, mark images as "loaded" to hide the loader
          if (!foundUser.posts || foundUser.posts.length === 0) {
            setAllImagesLoaded(true);
          }
        } else {
          console.log("User not found");
        }
        setLoading(false);
      }, 500);
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#FE744D" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-16 left-4 z-10"
        >
          <ArrowLeft size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white">User not found.</Text>
      </SafeAreaView>
    );
  }

  const firstName = user?.name?.split(" ")[0];
  const displayName = firstName
    ? firstName.length > 20
      ? `${firstName.substring(0, 20)}...`
      : firstName
    : "User";

  const images = user.posts;
  const totalImages = images.length;

  const handleImageLoaded = () => {
    imageLoadCount.current += 1;
    if (imageLoadCount.current >= totalImages) {
      setAllImagesLoaded(true);
    }
  };

  return (
    <ScrollView className="flex-1 bg-primary">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-16 left-4 z-10 bg-black/30 rounded-full p-2"
      >
        <ArrowLeft size={28} color="white" />
      </TouchableOpacity>
      {/* Header Section */}
      <View className="h-80 w-full bg-[#1A1A1A] rounded-b-[3rem] overflow-hidden relative">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1513909894411-7d7e04c28ecd?q=80",
          }}
          className="w-full h-full opacity-50"
          resizeMode="cover"
        />

        <View className="absolute py-8 left-1/2 -translate-x-1/2 items-center">
          <View className="w-28 h-28 rounded-full bg-white shadow-lg justify-center items-center overflow-hidden">
            <Image
              source={{ uri: user.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <View className="mt-4 items-center">
            <Text className="text-3xl font-bold text-white text-center">
              {/* change it --> show only displayname */}
              {user?.name || displayName}
            </Text>
            <Text className="text-lg text-gray-300 font-semibold">
              IIT (BHU) Varanasi
            </Text>
            {user.location && (
              <View className="flex-row items-center mt-1">
                <MapPin size={14} color="white" />
                <Text className="text-sm text-gray-300 ml-1">
                  {`${user.location.city}, ${user.location.region}`}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Message / Connect */}
      <View className=" mx-auto bg-white2 w-[80%] h-16 bottom-7 rounded-full flex-row items-center justify-around shadow-md">
        <TouchableOpacity className="flex-row items-center bg-orange-100 px-6 py-3 rounded-full">
          <Text className="text-orange font-semibold text-2xl mr-2">
            Message
          </Text>
          <MessageSquare color="#FE744D" size={24} />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center bg-orange-100 px-6 py-3 rounded-full">
          <Text className="text-orange font-semibold text-2xl mr-2">
            Connect
          </Text>
          <UserPlus color="#FE744D" size={24} />
        </TouchableOpacity>
      </View>

      {/* Expandable Section */}
      <View className="mt-4 px-4">
        <ExpandableSection interests={user?.interests || []} />
      </View>

      {/* Posts Grid */}
      <View className="px-2 mt-10">
        {(() => {
          if (!images || images.length === 0) {
            return (
              <View className="items-center justify-center py-10">
                <Text className="text-gray-400">
                  This user has no posts yet.
                </Text>
              </View>
            );
          }
          const fullPatterns = Math.floor(images.length / 6);
          const grids = [];

          // Full bentogrid patterns (6 images each)
          for (let i = 0; i < fullPatterns; i++) {
            const patternImages = images.slice(i * 6, (i + 1) * 6);
            grids.push(
              <View
                key={`pattern-${i}`}
                className="grid grid-cols-3 gap-2 mb-4"
              >
                {/* Large image (2x2) */}
                <View className="col-span-2 row-span-2 aspect-square">
                  <Image
                    source={{ uri: patternImages[0].uri }}
                    className="w-full h-full rounded-xl"
                    resizeMode="cover"
                    onLoadEnd={handleImageLoaded}
                  />
                </View>
                {/* Small images */}
                {patternImages.slice(1).map((img) => (
                  <View key={img.id} className="aspect-square">
                    <Image
                      source={{ uri: img.uri }}
                      className="w-full h-full rounded-xl"
                      resizeMode="cover"
                      onLoadEnd={handleImageLoaded}
                    />
                  </View>
                ))}
              </View>
            );
          }

          // Remaining images (horizontal layout)
          const remaining = images.slice(fullPatterns * 6);
          if (remaining.length > 0) {
            grids.push(
              <View key="remaining" className="flex flex-row gap-2 mb-4">
                {remaining.map((img) => (
                  <View key={img.id} className="flex-1 aspect-square">
                    <Image
                      source={{ uri: img.uri }}
                      className="w-full h-full rounded-xl"
                      resizeMode="cover"
                      onLoadEnd={handleImageLoaded}
                    />
                  </View>
                ))}
              </View>
            );
          }

          return grids;
        })()}
      </View>
      {!allImagesLoaded && !loading && (
        <View className="py-4">
          <ActivityIndicator size="large" color="#FE744D" />
        </View>
      )}
    </ScrollView>
  );
};

export default UserProfileScreen;