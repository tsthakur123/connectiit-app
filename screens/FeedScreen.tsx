import { Topbar } from "@/components/Topbar";
<<<<<<< HEAD
<<<<<<< Updated upstream
import axios from 'axios';
=======
import OnlineUsers from '@/components/OnlineUsers';
import { PresenceService } from '@/services/presence.service';
import { useAuthStore } from '@/store/authStore';
>>>>>>> Stashed changes
=======
import axios from 'axios';
>>>>>>> 5fc5d96 (Recovery)
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
<<<<<<< HEAD
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
=======
import { getuserInfo } from "@/services/user_info.service";

var userInfo;
>>>>>>> 5fc5d96 (Recovery)

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
<<<<<<< HEAD
  const [userInfo, setUserInfo] = useState<any>(null);
  const [postsData, setPostsData] = useState<any[]>([]);
=======
  const [postsdata, setpostsdata] = useState([])
>>>>>>> 5fc5d96 (Recovery)
  const [activePostIndex, setActivePostIndex] = useState<number | null>(null);
  const [activePostID, setActivePostID] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [commentsData, setCommentsData] = useState<any[]>([]);
<<<<<<< HEAD
  const { user, token } = useAuthStore();
  const [onlineUsersList, setOnlineUsersList] = useState<any[]>([]);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getuserInfo();
      setUserInfo(res);
      console.log("User Info in Feed Screen:", res);
    };
    fetchUser();
  }, []);

<<<<<<< Updated upstream
  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3009/api/post/");
        setPostsData(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
=======
  // Presence: initial fetch and realtime subscribe
  useEffect(() => {
    let mounted = true;
    let unsub: any = null;

    (async () => {
      try {
        const res = await PresenceService.fetchList(100);
        if (mounted && res.success) {
          setOnlineUsersList(res.data.map((u: any) => ({ id: u.userId, name: u.userId })));
        }
        // connect socket for realtime updates
        unsub = PresenceService.connect(token, (evt: any) => {
          if (!evt || !evt.userId) return;
          setOnlineUsersList((prev) => {
            if (evt.type === 'online') {
              if (prev.find((p) => p.id === evt.userId)) return prev;
              return [{ id: evt.userId, name: evt.userId }, ...prev];
            }
            if (evt.type === 'offline') {
              return prev.filter((p) => p.id !== evt.userId);
            }
            return prev;
          });
        });
      } catch (err) {
        console.warn('presence init error', err);
      }
    })();

    return () => {
      mounted = false;
      try { PresenceService.disconnect(); } catch (e) {}
      if (unsub) unsub();
    };
  }, [token]);

  // ─────────────────────────────────────────────
  // ❤️ Heart animation (Reanimated)
  // ─────────────────────────────────────────────
  const triggerLikeAnimation = (postID: string) => {
    setLikeAnimatingPost(postID);

    // Reset
    scale.value = 0.5;
    opacity.value = 1;

    // Scale up
    scale.value = withTiming(
      1.6,
      {
        duration: 800,
        easing: Easing.out(Easing.ease),
      },
      () => {
        // Settle back to normal size
        scale.value = withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.ease),
        });
>>>>>>> Stashed changes
      }
    };
    fetchPosts();
  }, []);

  const posts = useMemo(() => postsData, [postsData]);

  // Like function
  const handleLikePress = useCallback(
    async (postID: string) => {
      if (!userInfo) {
        console.warn("User info not loaded yet.");
        return;
      }

      try {
        console.log("Calling like API for post:", postID, "user:", userInfo.user_id);
        // Replace 192.168.x.x with your local machine IP if using Expo Go
        const res = await axios.post(
          `http://localhost:3009/api/post/posts/${postID}/like?userId=${userInfo.user_id}`
        );

        console.log("Like API response:", res.data);

        if (!res.data.error) {
          setLikedPosts((prev) => ({
            ...prev,
            [postID]: true,
          }));
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
=======

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
>>>>>>> 5fc5d96 (Recovery)
  }, [activePostID]);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.avatar} />
<<<<<<< HEAD
        <Text style={{ color: "#fafafa", fontWeight: "600" }}>
          {item.user_id?.substring(0, 8) || `User ${index + 1}`}
        </Text>
      </View>
      <Text style={{ color: "#fafafa", fontSize: 16, marginVertical: 10 }}>
=======
        <Text style={styles.username} className="text-white2">
          {item.user_id?.substring(0, 8) || `User ${index + 1}`}
        </Text>
      </View>
      <Text style={styles.postContent} className="text-white2 px-4 py-2">
>>>>>>> 5fc5d96 (Recovery)
        {item.text_content}
      </Text>
      {item.media_urls && (
        <Image
<<<<<<< HEAD
          source={{ uri: item.media_urls }}
          style={styles.postImage}
        />
      )}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <TouchableOpacity
          onPress={() => handleLikePress(item.id)}
          disabled={!userInfo} // disable until userInfo loaded
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
            opacity: userInfo ? 1 : 0.5, // visually disabled
          }}
        >
=======
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
>>>>>>> 5fc5d96 (Recovery)
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
<<<<<<< HEAD
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
=======
        <View style={styles.tagsContainer} className="flex-row flex-wrap px-4 py-2">
          {item.interest_tags.map((tag: string, tagIndex: number) => (
            <Text key={tagIndex} style={styles.tag} className="bg-orange rounded-full px-3 py-1 mr-2 mb-2">
>>>>>>> 5fc5d96 (Recovery)
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
<<<<<<< Updated upstream
      <FlatList
        data={posts}
        keyExtractor={(_, i) => `post-${i}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator
        nestedScrollEnabled
      />
=======
      <OnlineUsers users={onlineUsersList} fetchUsers={async (cursor, limit=30) => ({ users: onlineUsersList, nextCursor: null })} />


      {initialLoading ? (
        <FeedSkeleton />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReached={fetchFeed}
          onEndReachedThreshold={0.6}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListFooterComponent={
            loading ? (
              <View style={{ paddingVertical: 20 }}>
                <Text style={{ color: "#aaa", textAlign: "center" }}>
                  Loading more...
                </Text>
              </View>
            ) : null
          }
        />
      )}

>>>>>>> Stashed changes
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
<<<<<<< HEAD
        data={commentsData}
=======
        data={commentsForActivePost}
>>>>>>> 5fc5d96 (Recovery)
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
<<<<<<< HEAD
    marginHorizontal: 8,
    borderRadius: 40,
=======
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
>>>>>>> 5fc5d96 (Recovery)
  },
});

export default FeedScreen;