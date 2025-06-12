import { Topbar } from "@/components/Topbar";
import CommentsSheet from "@/components/Scrollable-Bottomsheet";
import React, { useRef, useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { Heart, MessageCircle, Send } from "lucide-react-native";

// Separate component for the comment button
const CommentButton = ({
  index,
  onPress,
}: {
  index: number;
  onPress: (index: number) => void;
}) => {
  return (
    <Pressable
      onPress={() => onPress(index)}
      style={({ pressed }) => [
        styles.commentButton,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={[styles.actionText, styles.commentText]}>Comment</Text>
    </Pressable>
  );
};

const FeedScreen = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%", "90%"], []);
  const [activePostIndex, setActivePostIndex] = useState<number | null>(null);

  const mockComments = useMemo(
    () =>
      Array(30)
        .fill(0)
        .map((_, index) => `Comment ${index + 1}`),
    []
  );

  const handleCommentPress = useCallback((index: number) => {
    console.log("Comment button pressed for post:", index);
    setActivePostIndex(index);
    setTimeout(() => {
      if (sheetRef.current) {
        sheetRef.current.snapToIndex(1);
      }
    }, 50);
  }, []);

  const posts = useMemo(() => Array(10).fill(0), []);
  const commentsForActivePost = useMemo(() => {
    if (activePostIndex === null) return [];
    return Array(10)
      .fill(0)
      .map((_, i) => `Comment ${i + 1} on Post ${activePostIndex + 1}`);
  }, [activePostIndex]);

  const renderItem = ({ index }: { index: number }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.avatar} />
        <Text style={styles.username} className="text-white2">
          User {index + 1}
        </Text>
      </View>
      <Image
        source={{
          uri: "https://plus.unsplash.com/premium_photo-1673266633993-013acd448898?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        style={styles.postImage}
        className="rounded-[2.5rem] mx-2"
      />
      <View style={styles.postActions} className="gap-1">
        <TouchableOpacity className="flex-row items-center justify-center border border-orange rounded-full w-10 h-10">
          <Heart size={20} color="#fafafa" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCommentPress(index)}
          className="flex-row items-center justify-center border border-orange rounded-full w-10 h-10"
        >
          <MessageCircle size={20} color="#fafafa" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log("Share pressed")}
          className="flex-row items-center justify-center border border-orange rounded-full w-10 h-10"
        >
          <Send size={20} color="#fafafa" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container} className="bg-primary">
      <Topbar />
      <FlatList
        data={posts}
        keyExtractor={(_, i) => `post-${i}`}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator
        nestedScrollEnabled // 🔑 important for Android scroll
      />
      {/* Floating Create Post Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/modal")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
      <CommentsSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        data={commentsForActivePost}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    paddingBottom: 100,
  },
  post: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 15,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  username: {
    fontWeight: "600",
  },
  postImage: {
    height: 300,
    backgroundColor: "#f5f5f5",
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  actionText: {
    color: "#fafafa",
    fontSize: 14,
  },
  commentText: {
    fontWeight: "bold",
    color: "#FE744D",
  },
  commentButton: {
    padding: 5,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: "14%",
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
  fabText: {
    color: "white",
    fontSize: 30,
    lineHeight: 34,
  },
});

export default FeedScreen;
