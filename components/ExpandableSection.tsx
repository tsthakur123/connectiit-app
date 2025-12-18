import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import { ChevronUp } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ExpandableSectionProps {
  interests: string[];
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({ interests }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Animated shared values
  const rotation = useSharedValue(0);
  const height = useSharedValue(0);

  // Update animation values on expand/collapse
  useEffect(() => {
    rotation.value = withTiming(isExpanded ? 180 : 0, { duration: 300 });
    height.value = withTiming(isExpanded ? 200 : 0, { duration: 500 });
  }, [isExpanded]);

  // Animated styles
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  };

  return (
    <View className="flex-1 relative mt-12">
      {/* Expand Button */}
      <View className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-50">
        <Pressable
          onPress={toggleExpand}
          className="relative w-12 h-12 bg-orange rounded-full flex-row justify-center items-center"
        >
          <Animated.View style={animatedIconStyle}>
            <ChevronUp size={24} color="white" />
          </Animated.View>
        </Pressable>
      </View>

      {/* Spacer / Radar Section */}
      <View className="flex-1 h-12"></View>

      {/* Expandable Section with animated height */}
      <Animated.View
        style={[animatedContainerStyle]}
        className="overflow-hidden px-4 bg-primary"
      >
        <View className="w-full min-h-16 border-t border-white/10 mb-2 pt-4">
          <Text className="text-center font-semibold text-white2">
            Interests
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-center gap-3">
          {interests && interests.length > 0 ? (
            interests.map((interest) => (
              <Text
                key={interest}
                className="bg-secondary border border-[#FE744D] text-[#FE744D] px-3 py-1 rounded-full text-sm"
              >
                {interest}
              </Text>
            ))
          ) : (
            <Text className="text-white2 text-sm text-center">
              No interests added
            </Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
};
