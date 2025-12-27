import React, { useState } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { router, Link } from "expo-router";
import { api } from "@/lib/api";

export default function CreatePostModal() {
  const [content, setContent] = useState("");

  const isPresented = router.canGoBack();

  const handlePost = async () => {
    if (!content.trim()) return;

    const payload = {
      caption: content,
      cover_media_url:
        "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      cover_media_type: "image",
    };

    try {
      await api.post("/feed", payload);
      setContent("");
      router.back();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <View
      className="flex-1 p-6 justify-center"
      style={{ backgroundColor: "#1B1730" }}
    >
      <Text
        className="text-2xl font-bold text-center mb-6"
        style={{ color: "#fafafa" }}
      >
        Create a Post
      </Text>

      <TextInput
        placeholder="What's on your mind?"
        multiline
        value={content}
        onChangeText={setContent}
        className="border-2 rounded-lg p-4 text-base min-h-[120px] mb-6"
        textAlignVertical="top"
        placeholderTextColor="#999"
        style={{
          borderColor: "#FE744D",
          backgroundColor: "#262438",
          color: "#fafafa",
        }}
      />

      <TouchableOpacity
        onPress={handlePost}
        className="py-3 px-4 rounded-lg mb-4"
        style={{ backgroundColor: "#FE744D" }}
      >
        <Text
          className="text-center font-semibold text-lg"
          style={{ color: "#1B1730" }}
        >
          Post
        </Text>
      </TouchableOpacity>

      {isPresented && (
        <Link
          href="/(tabs)/home"
          className="text-center mt-4 font-medium"
          style={{ color: "#FE744D" }}
        >
          Dismiss
        </Link>
      )}
    </View>
  );
}
