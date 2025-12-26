import React, { useEffect, useState, useRef } from "react";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
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
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pencil, MapPin, Edit } from "lucide-react-native";
import { ExpandableSection } from "@/components/ExpandableSection";
import * as ImagePicker from "expo-image-picker";

export const ProfileScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [locationName, setLocationName] = useState<string | null>("Locating...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const imageLoadCount = useRef(0);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        let userinfo = jwtDecode(token || "");
        console.log(userinfo)
        setUser(userinfo)
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
    loadUser();
  }, []);

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

  const images = [...Array(14)].map((_, index) => ({
    id: index,
    uri: `https://picsum.photos/id/${index + 10}/500/500`,
  }));
  const totalImages = images.length;

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
          <View className="w-24 h-24 rounded-full bg-white shadow-lg justify-center items-center overflow-hidden">
            <Image
              source={{
                uri: `${user?.image}`,
              }}
              className="w-full h-full"
              resizeMode="cover"
            />

          </View>
          
            {/* Edit Icon for profile image */}
            <TouchableOpacity
              className="absolute bottom-3 right-2 bg-[#FE744D] p-1.5 rounded-full"
              onPress={() => setImageModalVisible(true)}
            >
              <Pencil size={12} color="white" />
            </TouchableOpacity>

              {/* name, college and location */}
          <View className="mt-1 items-center -space-y-0.5">
            <Text className="text-lg font-bold text-white text-center">
              {displayName}
            </Text>
            <Text className="text-sm text-gray-300 font-semibold">
              IIT (BHU) Varanasi
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

      {/* Followers / Following */}
      <View className=" mx-auto bg-white2 w-[80%] h-10 bottom-5 rounded-full flex-row items-center justify-around shadow-md">
        <View className="items-center">
          <Text className="text-orange text-sm font-bold">Connected</Text>
          <Text className="text-orange text-sm font-bold ">120</Text>
        </View>

        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.push("./profile")}
        >
          <Text className="text-orange font-bold text-sm text-center">
            {'Edit\nProfile'}
          </Text>
          <Edit size={24} color="#FE744D" className="ml-2" />
        </TouchableOpacity>
      </View>

      {/* Expandable Section */}
      <View className="mt-4 px-4">
        <ExpandableSection />
      </View>

      {/* Posts Grid */}
      <View className="px-2 mt-10">
        {(() => {
          const fullPatterns = Math.floor(images.length / 6);
          const grids = [];

          // Full bentogrid patterns (6 images each)
          for (let i = 0; i < fullPatterns; i++) {
            const patternImages = images.slice(i * 6, (i + 1) * 6);
            grids.push(
              <View key={`pattern-${i}`} className="grid grid-cols-3 gap-2 mb-4">
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
                {patternImages.slice(1).map((img, idx) => (
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
          const remainingImages = images.length % 6;
          if (remainingImages > 0) {
            const remaining = images.slice(fullPatterns * 6);
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
      {!allImagesLoaded && (
        <View className="py-4">
          <ActivityIndicator size="large" color="#FE744D" />
        </View>
      )}

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
                <Button title="Cancel" onPress={() => setImageModalVisible(false)} color="red" />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};