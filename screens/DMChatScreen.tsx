import React, { useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ArrowLeft, ChevronLeft, SendHorizonal } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";

const messages = [
  { id: "1", fromMe: false, text: "Hey, what’s up?" },
  { id: "2", fromMe: true, text: "All good! You?" },
  { id: "3", fromMe: true, text: "All good! You?" },
  { id: "4", fromMe: false, text: "Just chilling 😎" },
];

export default function DMChatScreen() {
  useFocusEffect(
    useCallback(() => {
      // Set status bar for DM screen
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("#FE744D");

      return () => {
        // Reset to default when leaving (optional)
        StatusBar.setBarStyle("light-content");
        StatusBar.setBackgroundColor("#1B1730");
      };
    }, [])
  );
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-orange"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-6 bg-orange">
        <TouchableOpacity onPress={()=>router.back()}>
          <ChevronLeft color="white" size={32} />
        </TouchableOpacity>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=5" }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View>
          <View>
            <Text className="text-white font-bold text-base">Nilesran</Text>
            <Text className="text-white text-sm opacity-90">active now</Text>
          </View>
        </View>
      </View>

      <View className="flex-1 bg-primary rounded-t-[2.5rem]">
        {/* Chat Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className={`px-4 py-2 mb-1 mx-3 rounded-2xl max-w-[70%] ${
                item.fromMe
                  ? "self-end bg-orange text-white2"
                  : "self-start bg-white2 text-black"
              }`}
            >
              <Text
                className={`text-lg ${
                  item.fromMe ? "text-white2" : "text-black"
                }`}
              >
                {item.text}
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
          inverted
        />

        {/* Message Input */}
        <View className="flex-row items-center px-4 py-2 border-t border-secondary">
          <TextInput
            placeholder="Message..."
            placeholderTextColor="#aaa"
            className="flex-1 px-3 py-3 bg-secondary text-black dark:text-white rounded-full mr-2"
          />
          <TouchableOpacity style={styles.send}>
            <SendHorizonal color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  send: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 38,
    height: 38,
    borderRadius: 17.5,
    backgroundColor: "#FE744D",
  },
});
