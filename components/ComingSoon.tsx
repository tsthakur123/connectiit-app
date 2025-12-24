import { View, Text, Dimensions } from "react-native";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function ComingSoon() {
  const pulse = useSharedValue(0);
  const explosion = useSharedValue(0);
  const meteor = useSharedValue(0);
  const glitch = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    explosion.value = withRepeat(
      withTiming(1, { duration: 3600, easing: Easing.out(Easing.exp) }),
      -1,
      false
    );

    meteor.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.linear }),
      -1,
      false
    );

    glitch.value = withRepeat(
      withTiming(1, { duration: 160, easing: Easing.linear }),
      -1,
      true
    );
  }, []);

  /* ☢ Glow Pulse */
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.4, 0.9]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.9, 1.25]) }],
  }));

  /* 💥 Explosion */
  const blastStyle = useAnimatedStyle(() => ({
    opacity: interpolate(explosion.value, [0, 0.3, 1], [0, 0.7, 0]),
    transform: [{ scale: interpolate(explosion.value, [0, 0.3, 1], [0.2, 1.6, 3]) }],
  }));

  /* ☄️ Meteor */
  const meteorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(meteor.value, [0, 1], [-width, width]) },
      { translateY: interpolate(meteor.value, [0, 1], [-height * 0.3, height * 0.4]) },
    ],
    opacity: interpolate(meteor.value, [0, 0.8, 1], [0, 1, 0]),
  }));

  /* ⚡ Glitch */
  const glitchStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(glitch.value, [0, 1], [-2, 2]) },
    ],
    opacity: interpolate(glitch.value, [0, 1], [0.85, 1]),
  }));

  return (
    <LinearGradient
      colors={["#04030A", "#1B1730", "#262438"]}
      className="flex-1 items-center justify-center"
    >
      {/* 💥 Explosion Wave */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: width,
            height: width,
            borderRadius: width,
            backgroundColor: "#FE744D55",
          },
          blastStyle,
        ]}
      />

      {/* ☢ Radiation Glow */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: width * 0.7,
            height: width * 0.7,
            borderRadius: width,
            backgroundColor: "#FE744D22",
          },
          glowStyle,
        ]}
      />

      {/* ☄️ Meteor */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 120,
            height: 2,
            backgroundColor: "#FE744D",
            borderRadius: 10,
          },
          meteorStyle,
        ]}
      />

      {/* ⚠️ Core Card */}
      <Animated.View
        style={[
          {
            backgroundColor: "#262438",
            paddingVertical: 44,
            paddingHorizontal: 36,
            borderRadius: 32,
            alignItems: "center",
            shadowColor: "#FE744D",
            shadowOpacity: 0.6,
            shadowRadius: 30,
            elevation: 25,
          },
          glitchStyle,
        ]}
      >
        <Text
          style={{ color: "#FE744D" }}
          className="tracking-[6px] text-xs font-bold mb-4"
        >
          WARNING
        </Text>

        <Text
          style={{ color: "#fafafa" }}
          className="text-4xl font-extrabold text-center"
        >
          Coming Soon
        </Text>

        <Text
          style={{ color: "#D1D5DB" }}
          className="text-center mt-4 text-base leading-6"
        >
          Something powerful is under construction.
          {"\n"}Stand by.
        </Text>

        <View
          style={{
            height: 4,
            width: 120,
            backgroundColor: "#FE744D",
            borderRadius: 20,
            marginTop: 28,
          }}
        />
      </Animated.View>

      {/* Footer */}
      <Text
        style={{ color: "#6B7280" }}
        className="absolute bottom-10 text-[10px] tracking-[6px]"
      >
        SYSTEM STATUS: INITIALIZING
      </Text>
    </LinearGradient>
  );
}
