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
import { getuserInfo } from "@/services/user_info.service";

var userInfo;

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
const handleLikePress = async (post_ID) => {
  try {
   const isLiked= await axios.post(
      `http://localhost:3009/api/post/posts/${post_ID}/like?userId=${userInfo?.user_id}`
    );
    return isLiked.data;
  } catch (error) {
    console.error("Error liking post:", error);
  }
};

const FeedScreen = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const userInfoFN= async() => {
  const res=await getuserInfo();
  console.log("User Info in Feed Screen:", res);
    userInfo=res;
  }
  const snapPoints = useMemo(() => ["40%", "90%"], []);
  const [postsdata, setpostsdata] = useState([])
  const [activePostIndex, setActivePostIndex] = useState<number | null>(null);
  const [activePostID, setActivePostID] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [commentsData, setCommentsData] = useState<any[]>([]);

  useEffect( () => {
    userInfoFN();
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3009/api/post/");
        const data = response.data;
        setpostsdata(data);
        console.log("Fetched posts:", data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const posts = useMemo(() => postsdata, [postsdata]);
  const handleCommentPress = useCallback((index: number) => {
    console.log("Comment button pressed for post:", index);
    setActivePostIndex(index);
    setActivePostID(posts[index]?.id);
    const fetchComments = async () => {
      try {
        const postID = posts[index]?.id;
        if (!postID) {
          console.error("Post ID not found");
          return;
        }
        
        const response = await axios.get(
          `http://localhost:3009/api/post/comments/${postID}`
        );
        console.log("Fetched comments:", response.data);
        if(response.data.message === "No comments found"){
          setCommentsData([]);
          if (sheetRef.current) {
            sheetRef.current.snapToIndex(1);
          }
          return;
        } 
        setCommentsData(response.data || []);
        setTimeout(() => {
          if (sheetRef.current) {
            sheetRef.current.snapToIndex(1);
          }
        }, 50);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setCommentsData([]);
      }
    };
    
    fetchComments();
  }, [posts]);

  const commentsForActivePost = useMemo(() => {
    return commentsData;
  }, [commentsData]);

  const handleCommentAdded = useCallback(() => {
    // Refresh comments after a new one is added
    if (activePostID) {
      const fetchComments = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3009/api/post/comments/${activePostID}`
          );
          console.log("Refreshed comments:", response.data);
          if(response.data.message === "No comments found"){
            setCommentsData([]);
          } else {
            setCommentsData(response.data || []);
          }
        } catch (error) {
          console.error("Error refreshing comments:", error);
        }
      };
      fetchComments();
    }
  }, [activePostID]);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.avatar} />
        <Text style={styles.username} className="text-white2">
          {item.user_id?.substring(0, 8) || `User ${index + 1}`}
        </Text>
      </View>
      <Text style={styles.postContent} className="text-white2 px-4 py-2">
        {item.text_content}
      </Text>
      {item.media_urls && (
        <Image
          source={{
            uri: item.media_urls,
          }}
          style={styles.postImage}
          className="rounded-[2.5rem] mx-2"
        />
      )}
      <View style={styles.postActions} className="gap-1">
        <TouchableOpacity 
        onPress={async () => {
          try {
            const res = await handleLikePress(item.id);
            if (res && !res.error) {
              setLikedPosts((prev) => ({
                ...prev,
                [item.id]: true,
              }));
            } else {
              console.log("Like failed on server response");
            }
          } catch (err) {
            console.error("Like request failed:", err);
          }
        }}
        className="flex-row items-center justify-center border border-orange rounded-full w-10 h-10">
          <Heart size={20} color={likedPosts[item.id] ? "green" : "#fafafa"} />
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
      {item.interest_tags && item.interest_tags.length > 0 && (
        <View style={styles.tagsContainer} className="flex-row flex-wrap px-4 py-2">
          {item.interest_tags.map((tag: string, tagIndex: number) => (
            <Text key={tagIndex} style={styles.tag} className="bg-orange rounded-full px-3 py-1 mr-2 mb-2">
              #{tag}
            </Text>
          ))}
        </View>
      )}
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
        postID={activePostID}
        userID={userInfo?.user_id}
        onCommentAdded={handleCommentAdded}
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
  postContent: {
    fontSize: 16,
    marginVertical: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  tag: {
    fontSize: 12,
    color: "#1B1730",
    fontWeight: "600",
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
