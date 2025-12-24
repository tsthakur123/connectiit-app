import CommunityTabs from "@/components/CommunityTabs";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CommunityPostCard from "@/components/CommunityPostCard";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MessageCircle, Plus } from "lucide-react-native";
import { router } from "expo-router";

const dummyPosts = [
  {
    id: "1",
    community: "tech",
    title: "React Native vs Flutter in 2025",
    content: "Which one are you using and why?",
    author: "tarun_iitbhu",
    upvotes: 120,
    comments: 25,
    time: "2h ago",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // sample image
  },
  {
    id: "2",
    community: "startups",
    title: "Only IITians will relate 😂",
    content: "Why is the WiFi always fast during exams?",
    author: "iitian_meme_lord",
    upvotes: 340,
    comments: 48,
    time: "5h ago",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    community: "travel",
    title: "Best books to read this summer?",
    content: "I'm looking for fiction and productivity books 📚",
    author: "avid_reader",
    upvotes: 56,
    comments: 12,
    time: "1d ago",
    // No image
  },
  {
    id: "4",
    community: "tech",
    title: "React Native vs Flutter in 2025",
    content: "Which one are you using and why?",
    author: "tarun_iitbhu",
    upvotes: 120,
    comments: 25,
    time: "2h ago",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // sample image
  },
  {
    id: "5",
    community: "startups",
    title: "Only IITians will relate 😂",
    content: "Why is the WiFi always fast during exams?",
    author: "iitian_meme_lord",
    upvotes: 340,
    comments: 48,
    time: "5h ago",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "6",
    community: "travel",
    title: "Best books to read this summer?",
    content: "I'm looking for fiction and productivity books 📚",
    author: "avid_reader",
    upvotes: 56,
    comments: 12,
    time: "1d ago",
    // No image
  },
];

const Communities = () => {
  const [currentCommunity, setCurrentCommunity] = useState("all");

  const filteredPosts = currentCommunity === "all"
    ? dummyPosts
    : dummyPosts.filter(p => p.community === currentCommunity);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <CommunityTabs onChange={setCurrentCommunity} />
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => <CommunityPostCard post={item} />}
      />
      {/* Floating Buttons */}
      <View style={styles.fabContainer} className="flex-1 gap-2">
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/modal", params: { community: currentCommunity }})}
          style={styles.fab}
          className="bg-orange w-7 h-7 rounded-full p-4 mb-3 shadow-md"
        >
          <Plus color="white" size={24} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push({ pathname: "/", params: { community: currentCommunity }})}
          style={styles.fab}
          className="bg-[#FE744D] rounded-full p-4 shadow-md"
        >
          <MessageCircle color="white" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: "14%",
    right: 24,
    alignItems: "center",
  },
  fab: {
    backgroundColor: "#FE744D",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default Communities;