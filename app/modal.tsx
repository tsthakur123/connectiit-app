import axios from "axios";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";
import { Text, TextInput, View, TouchableOpacity, Image } from "react-native";
import { router, Link } from "expo-router";
// import * as ImagePicker from "expo-image-picker";

export default function CreatePostModal() {
      const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userinfo=await jwtDecode(token||"");
        console.log(userinfo)
        setUser(userinfo)
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
    loadUser();
  }, []);
  const isPresented = router.canGoBack();
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const handlePost = async() => {
    if (!content.trim()) return;
    
    // Parse comma-separated tags
    const interest_tags = tagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    const payload={
      text_content:content,
      user_id:user?.user_id,
      interest_tags:interest_tags
    }
    
    try {
      await axios.post("http://localhost:3009/api/post",payload)
      setContent("");
      setTagsInput("");
      router.back();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <View className="flex-1 p-6 justify-center" style={{ backgroundColor: "#1B1730" }}>
      <Text className="text-2xl font-bold text-center mb-6" style={{ color: "#fafafa" }}>Create a Post</Text>

      <TextInput
        placeholder="What's on your mind?"
        multiline
        value={content}
        onChangeText={setContent}
        className="border-2 rounded-lg p-4 text-base min-h-[120px] mb-4"
        textAlignVertical="top"
        placeholderTextColor="#999"
        style={{
          borderColor: "#FE744D",
          backgroundColor: "#262438",
          color: "#fafafa"
        }}
      />

      <TextInput
        placeholder="Interest tags (comma separated, e.g. travel, iit, events)"
        value={tagsInput}
        onChangeText={setTagsInput}
        className="border-2 rounded-lg p-4 text-base mb-6"
        placeholderTextColor="#999"
        style={{
          borderColor: "#FE744D",
          backgroundColor: "#262438",
          color: "#fafafa"
        }}
      />

      <TouchableOpacity
        onPress={handlePost}
        className="py-3 px-4 rounded-lg mb-4"
        style={{ backgroundColor: "#FE744D" }}
      >
        <Text className="text-center font-semibold text-lg" style={{ color: "#1B1730" }}>Post</Text>
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