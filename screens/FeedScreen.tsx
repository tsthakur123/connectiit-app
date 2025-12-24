import { Topbar } from "@/components/Topbar";
import axios from 'axios';
import CommentsSheet from "@/components/Scrollable-Bottomsheet";
import React, { useRef, useMemo, useCallback, useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
const getuserInfo = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      return null};

    const userinfo: any = jwtDecode(token || "");
    console.log("Decoded User Info:", userinfo);

    return userinfo;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

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
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <Text style={{ color: "#FE744D", fontWeight: "bold" }}>Comment</Text>
    </Pressable>
  );
};

const FeedScreen = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%", "90%"], []);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [postsData, setPostsData] = useState<any[]>([]);
  const [activePostIndex, setActivePostIndex] = useState<number | null>(null);
  const [activePostID, setActivePostID] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [commentsData, setCommentsData] = useState<any[]>([]);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getuserInfo();
      setUserInfo(res);
      console.log("User Info in Feed Screen:", res);
    };
    fetchUser();
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3009/api/post/");
        setPostsData(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  const posts = useMemo(() => postsData, [postsData]);

  // Like function
  const handleLikePress = useCallback(
    async (postID: string) => {
      if (!userInfo) return;
      try {
        const res = await axios.post(
          `http://localhost:3009/api/post/posts/${postID}/like`,
          { userId: userInfo.user_id }
        );
        if (!res.data.error) {
          setLikedPosts((prev) => ({ ...prev, [postID]: true }));
        }
      } catch (err) {
        console.error("Error liking post:", err);
      }
    },
    [userInfo]
  );

  // Comment function
  const handleCommentPress = useCallback(
    async (index: number) => {
      if (!userInfo) return;
      const postID = posts[index]?.id;
      if (!postID) return;
      setActivePostIndex(index);
      setActivePostID(postID);
      try {
        const response = await axios.get(
          `http://localhost:3009/api/post/comments/${postID}`
        );
        const comments = response.data.message === "No comments found" ? [] : response.data;
        setCommentsData(comments);
        setTimeout(() => sheetRef.current?.snapToIndex(1), 50);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setCommentsData([]);
      }
    },
    [posts, userInfo]
  );

  const handleCommentAdded = useCallback(() => {
    if (!activePostID) return;
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3009/api/post/comments/${activePostID}`
        );
        const comments = response.data.message === "No comments found" ? [] : response.data;
        setCommentsData(comments);
      } catch (err) {
        console.error("Error refreshing comments:", err);
      }
    };
    fetchComments();
  }, [activePostID]);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.avatar} />
        <Text style={{ color: "#fafafa", fontWeight: "600" }}>
          {item.user_id?.substring(0, 8) || `User ${index + 1}`}
        </Text>
      </View>
      <Text style={{ color: "#fafafa", fontSize: 16, marginVertical: 10 }}>
        {item.text_content}
      </Text>
      {item.media_urls && (
        <Image
          source={{ uri: item.media_urls }}
          style={styles.postImage}
        />
      )}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <TouchableOpacity
          onPress={() => handleLikePress(item.id)}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#FE744D",
            borderRadius: 50,
            width: 40,
            height: 40,
            marginRight: 5,
          }}
        >
          <Heart size={20} color={likedPosts[item.id] ? "green" : "#fafafa"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCommentPress(index)}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#FE744D",
            borderRadius: 50,
            width: 40,
            height: 40,
            marginRight: 5,
          }}
        >
          <MessageCircle size={20} color="#fafafa" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log("Share pressed")}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#FE744D",
            borderRadius: 50,
            width: 40,
            height: 40,
          }}
        >
          <Send size={20} color="#fafafa" />
        </TouchableOpacity>
      </View>
      {item.interest_tags && item.interest_tags.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 10 }}>
          {item.interest_tags.map((tag: string, tagIndex: number) => (
            <Text
              key={tagIndex}
              style={{
                fontSize: 12,
                color: "#1B1730",
                fontWeight: "600",
                backgroundColor: "#FE744D",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,
                marginRight: 5,
                marginBottom: 5,
              }}
            >
              #{tag}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#1B1730" }}>
      <Topbar />
      <FlatList
        data={posts}
        keyExtractor={(_, i) => `post-${i}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator
        nestedScrollEnabled
      />
      <TouchableOpacity
        style={{
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
        }}
        onPress={() => router.push("/modal")}
      >
        <Text style={{ color: "white", fontSize: 30, lineHeight: 34 }}>＋</Text>
      </TouchableOpacity>
      <CommentsSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        data={commentsData}
        postID={activePostID}
        userID={userInfo?.user_id}
        onCommentAdded={handleCommentAdded}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  postImage: {
    height: 300,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 8,
    borderRadius: 40,
  },
});

export default FeedScreen;