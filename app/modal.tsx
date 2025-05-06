import { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, Image } from "react-native";
import { router, Link } from "expo-router";
// import * as ImagePicker from "expo-image-picker";

export default function CreatePostModal() {
  const isPresented = router.canGoBack();
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

//   const handlePickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

  const handlePost = () => {
    if (!content.trim()) return;

    // Submit the post (e.g., send to backend)
    console.log("Posted:", { content, imageUri });

    // Reset and dismiss
    setContent("");
    setImageUri(null);
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-2xl font-bold text-center mb-6">Create a Post</Text>

      <TextInput
        placeholder="What's on your mind?"
        multiline
        value={content}
        onChangeText={setContent}
        className="border border-gray-300 rounded-lg p-4 text-base min-h-[120px] mb-4"
        textAlignVertical="top"
      />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          className="w-full h-48 rounded-lg mb-4"
          resizeMode="cover"
        />
      )}

      <TouchableOpacity
        // onPress={handlePickImage}
        className="bg-gray-100 py-3 px-4 rounded-lg mb-4"
      >
        <Text className="text-center text-gray-800 font-medium">
          {imageUri ? "Change Image" : "Add Image"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handlePost}
        className="bg-orange-500 py-3 px-4 rounded-lg"
      >
        <Text className="text-center text-white font-semibold">Post</Text>
      </TouchableOpacity>

      {isPresented && (
        <Link
          href="/(tabs)/home"
          className="text-center text-orange-500 mt-6 font-medium"
        >
          Dismiss
        </Link>
      )}
    </View>
  );
}
