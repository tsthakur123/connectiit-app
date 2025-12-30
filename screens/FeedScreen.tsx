import { Topbar } from "@/components/Topbar";
import CommentsSheet from "@/components/Scrollable-Bottomsheet";
import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { Heart, MessageCircle, Send } from "lucide-react-native";
import { api } from "@/lib/api";

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { FeedSkeleton } from "@/components/FeedSkeleton";
import MediaCarousel from "@/components/MediaCarousel";

const FeedScreen = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%", "90%"], []);

  const [initialLoading, setInitialLoading] = useState(true);

  // ❤️ Reanimated values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [likeAnimatingPost, setLikeAnimatingPost] = useState<string | null>(
    null
  );
  const lastTapRef = useRef<number | null>(null);
  const DOUBLE_TAP_DELAY = 300; // ms

  const [posts, setPosts] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [activePostID, setActivePostID] = useState<string | undefined>();
  const [commentsData, setCommentsData] = useState<any[]>([]);

  // ─────────────────────────────────────────────
  // Fetch feed
  // ─────────────────────────────────────────────
  const fetchFeed = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await api.get("/feed", {
        params: { limit: 5, cursor },
      });

      setPosts((prev) => [
        ...prev,
        ...res.data.data.map((p: any) => ({
          ...p,
          is_liked_by_user: p.is_liked_by_user ?? false,
        })),
      ]);

      setCursor(res.data.next_cursor);
    } catch (err) {
      console.error("Feed fetch error:", err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

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
      }
    );

    // Fade out slowly (2s total experience)
    opacity.value = withTiming(
      0,
      {
        duration: 2000,
        easing: Easing.out(Easing.ease),
      },
      () => {
        runOnJS(setLikeAnimatingPost)(null);
      }
    );
  };

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // ─────────────────────────────────────────────
  // Like toggle
  // ─────────────────────────────────────────────
  const handleLikePress = useCallback(
    async (postID: string) => {
      if (likeAnimatingPost === postID) return;

      try {
        triggerLikeAnimation(postID);

        const res = await api.post(`/feed/${postID}/like`);
        const liked = res.data.liked;

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postID
              ? {
                  ...p,
                  is_liked_by_user: liked,
                  like_count: liked
                    ? p.like_count + 1
                    : Math.max(0, p.like_count - 1),
                }
              : p
          )
        );
      } catch (err) {
        console.error("Like error:", err);
      }
    },
    [likeAnimatingPost]
  );

  const handleImageTap = (post: any) => {
    const now = Date.now();

    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // 👆👆 DOUBLE TAP DETECTED
      lastTapRef.current = null;

      // Prevent spam / duplicate likes
      if (post.is_liked_by_user) return;
      if (likeAnimatingPost === post.id) return;

      handleLikePress(post.id);
    } else {
      // First tap
      lastTapRef.current = now;
    }
  };

  // ─────────────────────────────────────────────
  // Comments
  // ─────────────────────────────────────────────
  const handleCommentPress = useCallback(async (postID: string) => {
    try {
      setActivePostID(postID);
      const res = await api.get(`/feed/${postID}/comments`, {
        params: { limit: 10 },
      });
      setCommentsData(res.data.data);
      sheetRef.current?.snapToIndex(1);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  }, []);

  const handleCommentAdded = useCallback(async () => {
    if (!activePostID) return;
    const res = await api.get(`/feed/${activePostID}/comments`, {
      params: { limit: 10 },
    });
    setCommentsData(res.data.data);
  }, [activePostID]);

  // ─────────────────────────────────────────────
  // Render post
  // ─────────────────────────────────────────────
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.avatar} />
        <Text style={styles.username}>{item.user_id.slice(0, 8)}</Text>
      </View>

      <Text style={styles.caption}>{item.caption}</Text>

      {/* ✅ MEDIA CAROUSEL (NO EXTRA PRESSABLE) */}
      {item.media?.length > 0 && (
        <MediaCarousel
          media={item.media}
          post={item}
          likeAnimatingPost={likeAnimatingPost}
          heartStyle={heartStyle}
          onDoubleTap={handleImageTap}
        />
      )}

      {/* {likeAnimatingPost === item.id && (
              <Animated.View style={[styles.heartOverlay, heartStyle]}>
                <Heart size={90} color="#FE744D" fill="#FE744D" />
              </Animated.View>
            )} */}
      {/* </Pressable> */}

      {/* {likeAnimatingPost === item.id && (
            <Animated.View style={[styles.heartOverlay, heartStyle]}>
              <Heart size={90} color="#FE744D" fill="#FE744D" />
            </Animated.View>
          )} */}
      {/* </View> */}
      {/* )} */}

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleLikePress(item.id)}
          style={styles.iconBtn}
        >
          <Heart
            size={20}
            color={item.is_liked_by_user ? "#FE744D" : "#fafafa"}
            fill={item.is_liked_by_user ? "#FE744D" : "none"}
          />
          <Text style={styles.count}>{item.like_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleCommentPress(item.id)}
          style={styles.iconBtn}
        >
          <MessageCircle size={20} color="#fafafa" />
          <Text style={styles.count}>{item.comment_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Send size={20} color="#fafafa" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Topbar />

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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/modal")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <CommentsSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        data={commentsData}
        postID={activePostID}
        onCommentAdded={handleCommentAdded}
      />
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1B1730" },

  post: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
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
    backgroundColor: "#444",
    marginRight: 10,
  },
  username: {
    color: "#fafafa",
    fontWeight: "600",
  },
  caption: {
    color: "#fafafa",
    fontSize: 16,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  postImage: {
    height: 300,
    marginHorizontal: 8,
    borderRadius: 20,
  },
  actions: {
    flexDirection: "row",
    padding: 10,
  },
  iconBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  count: {
    color: "#fafafa",
    marginLeft: 6,
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
  },
  fabText: {
    color: "white",
    fontSize: 30,
  },
  heartOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
