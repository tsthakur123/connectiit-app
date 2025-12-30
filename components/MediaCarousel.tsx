import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import Animated from "react-native-reanimated";
import { Heart } from "lucide-react-native";

const { width } = Dimensions.get("window");

type MediaItem = {
  url: string;
  type: "image";
  position: number;
};

interface Props {
  media: MediaItem[];
  post: any;
  likeAnimatingPost: string | null;
  heartStyle: any;
  onDoubleTap: (post: any) => void;
}

export default function MediaCarousel({
  media,
  post,
  likeAnimatingPost,
  heartStyle,
  onDoubleTap,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  return (
    <View>
      <FlatList
        data={media}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, idx) => idx.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => onDoubleTap(post)}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.url }} style={styles.image} />

              {likeAnimatingPost === post.id && (
                <Animated.View style={[styles.heartOverlay, heartStyle]}>
                  <Heart size={90} color="#FE744D" fill="#FE744D" />
                </Animated.View>
              )}
            </View>
          </Pressable>
        )}
      />

      {media.length > 1 && (
        <View style={styles.dotsContainer}>
          {media.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === activeIndex && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    width,
    height: 320,
    borderRadius: 25,       // 👈 rounded corners
    overflow: "hidden",    // 👈 REQUIRED to clip image + heart
    backgroundColor: "#000",
    // marginHorizontal: 8,   // 👈 matches FeedScreen spacing
  },
  image: {
    width: "100%",
    height: "100%",
  },
  heartOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#777",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#FE744D",
  },
});
