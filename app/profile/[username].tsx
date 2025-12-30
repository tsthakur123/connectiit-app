import React, { useEffect, useCallback, useState, useRef } from "react";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
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
import { jwtDecode } from "jwt-decode";

const token = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) return;
  return token;
};

const adaptProfileFeedToUI = (posts: any[]) => {
  return posts.map((p) => ({
    id: p.id,
    media_urls: p.cover_media_url ? [p.cover_media_url] : [],
    text_content: "",
    likes_count: 0,
    comments_count: 0,
    interest_tags: [],
  }));
};

interface User {
  username: string;
  name: string;
  user_id: string;
  isFriend: boolean;
}

interface Post {
  id: string;
  media_urls?: string[];
  text_content?: string;
  likes_count: number;
  comments_count: number;
  interest_tags?: string[];
}

// sample test case
const baniUserData: User = {
  username: "bani.singh.met22_1766221299",
  name: "Bani Singh 4-Yr B.Tech.: Metallurgical Engg., IIT(BHU)",
  user_id: "2db847fd-7597-4bb3-8ba5-c81185684a4a",
  isFriend: false,
};

// sample test case
const images: Post[] = [...Array(14)].map((_, index) => ({
  id: `post_${index}`,
  // Make some posts text-only for variety
  media_urls:
    index % 5 !== 0 ? [`https://picsum.photos/id/${index + 10}/500/500`] : [],
  text_content: `This is post number ${
    index + 1
  }. Some posts might have longer text to see how it wraps and fits inside the container.`,
  likes_count: Math.floor(Math.random() * 250),
  comments_count: Math.floor(Math.random() * 50),
  interest_tags: ["mockdata", "testing"],
}));

const UserProfileScreen = () => {
  const { username, userID } = useLocalSearchParams<{
    username: string;
    userID: string;
  }>();
  const [user, setUser] = useState<any>(null); // current seen profile user
  const [userinfo, setUserinfo] = useState<any>(null); //login user

  useEffect(() => {
    const init = async () => {
      const tokenString = await token();
      if (tokenString) {
        const decoded: any = jwtDecode(tokenString);
        setUserinfo(decoded);
      } else {
        setLoading(false);
      }
    };
    init();
  }, []); // my profile logined user

  const [userposts, setUserposts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const imageLoadCount = useRef(0);

  const totalImages = images.length;

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
        setUser((prev: any) =>
          prev ? { ...prev, isFriend: !currentlyFriend } : null
        );
      }
    } catch (err) {
      console.error("connect user with another error", err);
    }
  };

  const loadUser = useCallback(async () => {
    if (!userinfo || !username) {
      return;
    }
    setLoading(true);
    try {
      const tokenValue = await AsyncStorage.getItem("token");
      if (!tokenValue) {
        setLoading(false);
        return;
      }

      // Fetch user data first
      const userRes = await axios.post(
        `http://localhost:3006/api/users/${username}`,
        { user_id: userinfo.user_id }
      );
      // The API returns an array, so we take the first element.
      const fetchedUser = userRes.data[0];
      // if (!fetchedUser) throw new Error("User not found from API");
      setUser(fetchedUser);

      const response = await axios.get(
        // Fetches posts for the current user from the feed service
        `http://localhost:3001/api/feed/user/${userID}`,
        {
          headers: { Authorization: `Bearer ${tokenValue}` },
        }
      );

      const feedData = response.data?.data ?? [];
      setUserposts(adaptProfileFeedToUI(feedData));
    } catch (error) {
      console.error("Error fetching user data:", error);

      // Fallback to dummy data on error
      // setUser(baniUserData);
      // setUserposts(images);
    } finally {
      setLoading(false);
    }
  }, [username, userinfo]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission denied");
        setLocationName(null);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address.length > 0 && address[0].city && address[0].region) {
          setLocationName(`${address[0].city}, ${address[0].region}`);
        } else {
          setLocationName("Location not found");
        }
        setErrorMsg(null);
      } catch (error) {
        setErrorMsg("Could not fetch location");
        setLocationName(null);
      }
    })();
  }, []);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // If there's no back history (e.g., on page refresh),
      // navigate to a default screen. You may need to change "/" to your home route.
      router.replace("/search");
    }
  };

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
          onPress={handleBackPress}
          className="absolute top-14 left-4 z-10"
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

  const totalImagesWithMedia = userposts.filter(
    (p) => p.media_urls && p.media_urls.length > 0
  ).length;

  const handleImageLoaded = () => {
    imageLoadCount.current += 1;
    if (imageLoadCount.current >= totalImagesWithMedia) {
      setAllImagesLoaded(true);
    }
  };

  return (
    <ScrollView className="flex-1 bg-primary">
      {/* Header Section */}
      <View className="h-52 w-full bg-[#1A1A1A] rounded-b-[1.7rem] overflow-hidden relative">
        <TouchableOpacity
          onPress={handleBackPress}
          className="absolute top-14 left-4 z-10 bg-black/30 rounded-full p-1.5"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>

        {/* Background Image */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1513909894411-7d7e04c28ecd?q=80",
          }}
          className="w-full h-full opacity-50"
          resizeMode="cover"
        />

        {/* Profile Picture */}
        <View className="absolute py-4 left-1/2 -translate-x-1/2 items-center">
          <View>
            <View className="w-24 h-24 rounded-full bg-white shadow-lg justify-center items-center overflow-hidden">
              <Image
                source={{ uri: `${user?.profile_url}` }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* name, college and location */}
          <View className="mt-1 items-center -space-y-0.5">
            <Text className="text-lg font-bold text-white text-center">
              {displayName}
            </Text>
            <Text className="text-sm text-gray-300 font-semibold">
              {user?.college || "IIT (BHU) Varanasi"}
            </Text>
            {(locationName || errorMsg) && (
              <View className="flex-row items-center">
                <MapPin size={12} color="white" />
                <Text className="text-sm text-gray-300 ml-1">
                  {errorMsg || locationName}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Message / Connect */}
      <View className=" mx-auto bg-white2 w-[80%] h-16 bottom-7 rounded-full flex-row items-center justify-around shadow-md">
        <TouchableOpacity
          onPress={() => router.push(`/chat/${user.user_id}`)}
          className="flex-row items-center bg-orange-100 px-6 py-3 rounded-full"
        >
          <Text className="text-orange font-semibold text-lg mr-2">
            Message
          </Text>
          <MessageSquare color="#FE744D" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleFollow(user.user_id, user.isFriend)}
          className="flex-row items-center bg-orange-100 px-6 py-3 rounded-full"
        >
          <Text className="text-orange font-semibold text-lg mr-2">
            {user.isFriend ? "Connected" : "Connect"}
          </Text>
          {user.isFriend ? "" : <UserPlus color="#FE744D" size={20} />}
        </TouchableOpacity>
      </View>

      {/* Bio and Passions Section */}
      <View className="flex-row -mt-2 px-4 space-x-2 ">
        {/* Bio Box */}
        <View className="flex-1  shadow-sm ">
          <Text className="text-base font-bold text-white mb-1">Bio :</Text>
          <View className="h-24 p-2 rounded-xl border border-gray-700 bg-gray-800">
            <ScrollView nestedScrollEnabled={true}>
              <Text className="text-sm text-white">
                {user?.bio || "Please tell something about yourself"}
              </Text>
            </ScrollView>
          </View>
        </View>

        {/* other half Box */}
        <View className="flex-1"></View>
      </View>

      {/* Expandable section */}
      <View className="mt-4 px-4">
        <ExpandableSection interests={user?.interests || []} />
      </View>

      {/* icon for posts */}
      <View className="px-8 mt-6">
        <View className="w-full border-b border-orange h-12 mb-2 flex items-center justify-center">
          <Image
            source={require("../../assets/images/post_icon.png")}
            className="w-10 h-10"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Posts Grid with likes, comments and tags*/}
      <View className="px-2 mt-0">
        {(() => {
          if (!userposts || userposts.length === 0) {
            return (
              <View className="items-center justify-center py-10">
                <Text className="text-gray-400">
                  This user has no posts yet.
                </Text>
              </View>
            );
          }
          const fullPatterns = Math.floor(userposts.length / 6);
          const grids = [];

          // Full bentogrid patterns (6 images each)
          for (let i = 0; i < fullPatterns; i++) {
            const patternPosts = userposts.slice(i * 6, (i + 1) * 6);
            const largePost = patternPosts[0];
            const smallPosts = patternPosts.slice(1);

            grids.push(
              <View
                key={`pattern-${i}`}
                className="grid grid-cols-3 gap-2 mb-4"
              >
                {/* Large image (2x2) */}
                <View className="col-span-2 row-span-2 aspect-square">
                  {largePost.media_urls && largePost.media_urls.length > 0 ? (
                    <Image
                      source={{ uri: largePost.media_urls[0] }}
                      className="w-full h-full rounded-xl"
                      resizeMode="cover"
                      onLoadEnd={handleImageLoaded}
                    />
                  ) : (
                    <View
                      className="w-full h-full rounded-xl p-4 justify-center"
                      style={{ backgroundColor: "#262438" }}
                    >
                      <Text className="text-white font-semibold text-base">
                        {largePost.text_content}
                      </Text>
                    </View>
                  )}
                  <View
                    className="absolute bottom-2 left-2 px-2 py-1 rounded-full flex-row items-center"
                    style={{ backgroundColor: "#1B1730AA" }}
                  >
                    <Text className="text-white text-xs mr-2">
                      ❤️ {largePost.likes_count}
                    </Text>
                    <Text className="text-white text-xs">
                      💬 {largePost.comments_count}
                    </Text>
                  </View>
                  {largePost.interest_tags?.length > 0 && (
                    <View
                      className="absolute top-2 left-2 px-2 py-1 rounded-full"
                      style={{ backgroundColor: "#FE744DAA" }}
                    >
                      <Text className="text-white text-xs">
                        #{largePost.interest_tags[0]}
                      </Text>
                    </View>
                  )}
                </View>
                {/* Small images */}
                {smallPosts.map((post) => (
                  <View key={post.id} className="aspect-square">
                    {post.media_urls && post.media_urls.length > 0 ? (
                      <Image
                        source={{ uri: post.media_urls[0] }}
                        className="w-full h-full rounded-xl"
                        resizeMode="cover"
                        onLoadEnd={handleImageLoaded}
                      />
                    ) : (
                      <View
                        className="w-full h-full rounded-xl p-2 justify-center"
                        style={{ backgroundColor: "#262438" }}
                      >
                        <Text
                          className="text-white font-semibold text-xs"
                          numberOfLines={4}
                        >
                          {post.text_content}
                        </Text>
                      </View>
                    )}
                    <View
                      className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full flex-row items-center"
                      style={{ backgroundColor: "#1B1730AA" }}
                    >
                      <Text className="text-white text-[10px] mr-1.5">
                        ❤️ {post.likes_count}
                      </Text>
                      <Text className="text-white text-[10px]">
                        💬 {post.comments_count}
                      </Text>
                    </View>
                    {post.interest_tags?.length > 0 && (
                      <View
                        className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "#FE744DAA" }}
                      >
                        <Text className="text-white text-[10px]">
                          #{post.interest_tags[0]}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            );
          }

          // Remaining images (horizontal layout)
          const remainingImagesCount = userposts.length % 6;
          if (remainingImagesCount > 0) {
            const remainingPosts = userposts.slice(fullPatterns * 6);
            grids.push(
              <View key="remaining" className="flex flex-row gap-2 mb-4">
                {remainingPosts.map((post) => (
                  <View key={post.id} className="flex-1 aspect-square">
                    {post.media_urls && post.media_urls.length > 0 ? (
                      <Image
                        source={{ uri: post.media_urls[0] }}
                        className="w-full h-full rounded-xl"
                        resizeMode="cover"
                        onLoadEnd={handleImageLoaded}
                      />
                    ) : (
                      <View
                        className="w-full h-full rounded-xl p-2 justify-center"
                        style={{ backgroundColor: "#262438" }}
                      >
                        <Text
                          className="text-white font-semibold text-xs"
                          numberOfLines={4}
                        >
                          {post.text_content}
                        </Text>
                      </View>
                    )}
                    <View
                      className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full flex-row items-center"
                      style={{ backgroundColor: "#1B1730AA" }}
                    >
                      <Text className="text-white text-[10px] mr-1.5">
                        ❤️ {post.likes_count}
                      </Text>
                      <Text className="text-white text-[10px]">
                        💬 {post.comments_count}
                      </Text>
                    </View>
                    {post.interest_tags?.length > 0 && (
                      <View
                        className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "#FE744DAA" }}
                      >
                        <Text className="text-white text-[10px]">
                          #{post.interest_tags[0]}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            );
          }

          return grids;
        })()}
      </View>
      {!allImagesLoaded && !loading && userposts.length > 0 && (
        <View className="py-4">
          <ActivityIndicator size="large" color="#FE744D" />
        </View>
      )}
    </ScrollView>
  );
};

export default UserProfileScreen;
