import React, { useCallback, useEffect, useState, useRef } from "react";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Button,
  Alert,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pencil, MapPin, Edit } from "lucide-react-native";
import { ExpandableSection } from "@/components/ExpandableSection";
import * as ImagePicker from "expo-image-picker";

interface User {
  id: string;
  email: string;
  secondary_email: string | null;
  name: string;
  username: string;
  is_on_boarded: boolean;
  gender: string | null;
  interests: string[] | null;
  profile_url: string;
  last_seen: string;
  bio: string | null;
  college: string | null;
  created_at: string;
  updated_at: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  friends: any[] | null; // Consider defining a Friend type if structure is known
}


interface Post {
  id: string;
  media_urls?: string[];
  text_content?: string;
  likes_count: number;
  comments_count: number;
  interest_tags?: string[];
}

export const ProfileScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [userposts, setUserposts] = useState<any>([]);
  const [locationName, setLocationName] = useState<string | null>(
    "Locating..."
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);
  const imageLoadCount = useRef(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  // sample test case
  const baniUserData: User = {
    id: "9384bdb5-9305-4ae9-be03-1155f8e43a54",
    email: "tarun.singh.cer22@itbhu.ac.in",
    secondary_email: null,
    name: "Tarun Singh 4-Yr B.Tech.: Ceramic Engg., IIT(BHU)",
    username: "tarun.singh.cer22_1752260869",
    is_on_boarded: false,
    gender: null,
    interests: null,
    profile_url:
      "https://lh3.googleusercontent.com/a/ACg8ocKV06lB1yW_VDKTxWCie49UMtVd3cSKKneyw-fPrh9kW96R9w=s96-c",
    last_seen: "0001-01-01T05:30:00+05:30",
    bio: null,
    college: "IIT BHU, Varanasi",
    created_at: "2025-07-12T00:37:50.135208+05:30",
    updated_at: "2025-07-12T00:37:50.135208+05:30",
    followers_count: 50,
    following_count: 50,
    posts_count: 0,
    friends: null,
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

  const totalImages = images.length;

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

  const loadUser = useCallback(async () => {
    try {
      setPostsLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const userinfo: any = jwtDecode(token);

      const usedata = await axios.get(
        `http://localhost:3006/api/users/me/${userinfo.user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(usedata.data);

      const response = await axios.get(
        // Fetches posts for the current user from the feed service
        `http://localhost:3001/api/feed/user/${userinfo.user_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const feedData = response.data?.data ?? [];
      setUserposts(adaptProfileFeedToUI(feedData));
    } catch (err) {
      console.error(err);
    } finally {
      setPostsLoading(false); // ✅ always stop loader
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

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

  const handlePickImage = async () => {
    // No permissions needed to launch the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageModalVisible(false);
      setUser({ ...user, image: result.assets[0].uri });
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageModalVisible(false);
      setUser({ ...user, image: result.assets[0].uri });
    }
  };

  const firstName = user?.name?.split(" ")[0];
  const displayName = firstName
    ? firstName.length > 20
      ? `${firstName.substring(0, 20)}...`
      : firstName
    : "User";
  const handleImageLoaded = () => {
    imageLoadCount.current += 1;
    if (imageLoadCount.current >= totalImages) {
      setAllImagesLoaded(true);
    }
  };

  return (
    <ScrollView className="flex-1 bg-primary">
      {/* Header Section */}
      <View className="h-52 w-full bg-[#1A1A1A] rounded-b-[1.7rem] overflow-hidden relative">
        <TouchableOpacity
          className="absolute top-2 right-2 z-10 px-4 py-1 rounded-full "
          style={{
            borderWidth: 2,
            borderColor: "#FE744D",
            backgroundColor: "#1F1F1F",
          }}
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
          {/* profile image and edit option */}
          <View>
            <View className="w-24 h-24 rounded-full bg-white shadow-lg justify-center items-center overflow-hidden">
              <Image
                source={{
                  uri: `${user?.profile_url}`,
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* Edit Icon for profile image */}
            <TouchableOpacity
              className="absolute -bottom-1 right-2 bg-[#FE744D] p-1.5 rounded-full"
              onPress={() => setImageModalVisible(true)}
            >
              <Pencil size={12} color="white" />
            </TouchableOpacity>
          </View>

          {/* name, college and location */}
          <View className="mt-1 items-center -space-y-0.5">
            <Text className="text-lg font-bold text-white text-center">
              {displayName}
            </Text>
            <Text className="text-sm text-gray-300 font-semibold">
              {user?.college || "IIT"}
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

      {/* Connected / Edit Profile */}
      <View className=" mx-auto bg-white2 w-[80%] h-10 bottom-5 rounded-full flex-row items-center justify-around shadow-md">
        <View className="items-center">
          <Text className="text-orange text-sm font-bold">Connected</Text>
          <Text className="text-orange text-sm font-bold ">
            {user?.followers_count ?? 0}
          </Text>
        </View>

        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.push("/edit-profile")}
        >
          <Text className="text-orange font-bold text-sm text-center">
            {"Edit\nProfile"}
          </Text>
          <Edit size={24} color="#FE744D" className="ml-2" />
        </TouchableOpacity>
      </View>

      {/* bio and other */}

      {/* Bio and other Section */}
      <View className="flex-row -mt-2 px-4 space-x-2 ">
        {/* Bio Box */}
        <View className="flex-1  shadow-sm ">
          <Text className="text-base font-bold text-white mb-1">Bio :</Text>
          <View className="h-24 p-2 rounded-xl border border-gray-700 bg-gray-800">
            <ScrollView nestedScrollEnabled={true}>
              <Text className="text-sm text-white">
                {user?.bio || "Click on Edit Profile to change your bio"}
              </Text>
            </ScrollView>
          </View>
        </View>

        {/* other half Box */}
        <View className="flex-1"></View>
      </View>

      {/* Expandable Section */}

      <View className="mt-4 px-4">
        <ExpandableSection interests={user?.interests || []} />
      </View>

      {/* icon for posts */}
      <View className="px-8 mt-6">
        <View className="w-full border-b border-orange h-12 mb-2 flex items-center justify-center">
          <Image
            source={require("../assets/images/post_icon.png")}
            className="w-10 h-10"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Posts Grid with likes, comments and tags*/}
      <View className="px-2 mt-0">
        {(() => {
          // ⏳ DATA LOADING
          if (postsLoading) {
            return (
              <View className="py-6">
                <ActivityIndicator size="large" color="#FE744D" />
              </View>
            );
          }

          // ✅ EMPTY STATE
          if (userposts.length === 0) {
            return (
              <View className="flex items-center justify-center py-12">
                <Text className="text-gray-400 text-sm">No posts to show</Text>
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
                {smallPosts.map((post: Post) => (
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
                    {(post.interest_tags ?? []).length > 0 && (
                      <View
                        className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "#FE744DAA" }}
                      >
                        <Text className="text-white text-[10px]">
                          #{(post.interest_tags ?? [])[0]}
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
                {remainingPosts.map((post: Post) => (
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
                    {(post.interest_tags ?? []).length > 0 && (
                      <View
                        className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "#FE744DAA" }}
                      >
                        <Text className="text-white text-[10px]">
                          #{(post.interest_tags ?? [])[0]}
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

      {/* Image Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isImageModalVisible}
        onRequestClose={() => {
          setImageModalVisible(!isImageModalVisible);
        }}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPressOut={() => setImageModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View className="bg-white p-5 rounded-t-2xl">
              <Text className="text-lg font-bold mb-5 text-center">
                Update Profile Picture
              </Text>
              <View className="mb-2">
                <Button title="Select from Gallery" onPress={handlePickImage} />
              </View>
              <View className="mb-2">
                <Button title="Take Photo" onPress={handleTakePhoto} />
              </View>
              <View className="mt-4">
                <Button
                  title="Cancel"
                  onPress={() => setImageModalVisible(false)}
                  color="red"
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};
