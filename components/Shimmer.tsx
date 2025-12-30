import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

type Props = {
  width?: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
};

export const Shimmer = ({
  width = "100%",
  height,
  borderRadius = 8,
  style,
}: Props) => {
  const translateX = useSharedValue(-100);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(300, {
        duration: 1200,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#262438",
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, animatedStyle]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shimmer: {
    width: "40%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});
