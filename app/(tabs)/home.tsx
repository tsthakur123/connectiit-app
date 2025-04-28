import { useRouter } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  useAnimatedReaction,
  runOnJS,
  interpolate,
  Extrapolate,
  SharedValue
} from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Gesture, 
  GestureHandlerRootView, 
  GestureDetector, 
  ScrollView, 
  NativeViewGestureHandler 
} from 'react-native-gesture-handler';
import { useEffect, useRef } from "react";
import FeedContent from "@/screens/FeedScreen";
import DMContent from "@/screens/DMScreen";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get('window');

// Define types for context and navigation
interface GestureContext {
  startX: number;
}

interface TabBarStyle {
  display: 'flex' | 'none';
  height: number;
}

const Home: React.FC = () => {
  const navigation = useNavigation();
  const translateX: SharedValue<number> = useSharedValue(0);
  const context: SharedValue<GestureContext> = useSharedValue({ startX: 0 });
  
  // Refs for the ScrollViews and NativeViewGestureHandlers
  const feedScrollRef = useRef<ScrollView>(null);
  const dmScrollRef = useRef<ScrollView>(null);
  const feedScrollHandlerRef = useRef<NativeViewGestureHandler>(null);
  const dmScrollHandlerRef = useRef<NativeViewGestureHandler>(null);
  
  // Function to toggle tab bar visibility
  const setTabBarVisible = (visible: boolean): void => {
    navigation.setOptions({
      tabBarStyle: {
        display: visible ? 'flex' : 'none',
        height: visible ? 50 : 0
      } as TabBarStyle
    });
  };
  
  // Watch animation value and update tab bar visibility accordingly
  useAnimatedReaction(
    () => {
      return interpolate(
        translateX.value,
        [0, -width / 2],
        [0, 1],
        Extrapolate.CLAMP
      );
    },
    (progress: number) => {
      if (progress > 0.8) {
        runOnJS(setTabBarVisible)(false);
      } else if (progress < 0.2) {
        runOnJS(setTabBarVisible)(true);
      }
    }
  );
  
  // Reset position and show tab bar when component mounts
  useEffect(() => {
    translateX.value = 0;
    setTabBarVisible(true);
    
    return () => {
      setTabBarVisible(true);
    };
  }, []);
  
  // Pan gesture handler for horizontal swipe
  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { startX: translateX.value };
    })
    .onUpdate((event) => {
      // Only handle horizontal gestures with significant horizontal movement
      if (Math.abs(event.translationX) > Math.abs(event.translationY) * 2) {
        if (event.translationX < 0) {
          const delta = event.translationX;
          const resistantDelta = delta > -width ? delta : -width + (delta + width) / 5;
          translateX.value = context.value.startX + resistantDelta;
        }
      }
    })
    .onEnd((event) => {
      if (event.translationX < -width / 3) {
        translateX.value = withSpring(-width, {
          damping: 15,
          stiffness: 100
        });
      } else {
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 100
        });
      }
    })
    .simultaneousWithExternalGesture(feedScrollHandlerRef, dmScrollHandlerRef);

  // Animated styles for horizontal swipe
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }]
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.content, rStyle]}>
            <View style={styles.screen}>
              {/* Feed Content with Vertical Scroll */}
              <NativeViewGestureHandler
                ref={feedScrollHandlerRef}
                simultaneousHandlers={dmScrollHandlerRef}
              >
                <ScrollView
                  ref={feedScrollRef}
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  <FeedContent />
                </ScrollView>
              </NativeViewGestureHandler>
            </View>
            <View style={[styles.screen, styles.dmScreenPreview]}>
              {/* DM Content with Vertical Scroll */}
              <NativeViewGestureHandler
                ref={dmScrollHandlerRef}
                simultaneousHandlers={feedScrollHandlerRef}
              >
                <ScrollView
                  ref={dmScrollRef}
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  <DMContent />
                </ScrollView>
              </NativeViewGestureHandler>
            </View>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  content: {
    flex: 1,
    flexDirection: "row",
    width: width * 2,
  },
  screen: {
    width: width,
  },
  dmScreenPreview: {
    backgroundColor: "#fafafa"
  },
  scrollView: {
    flex: 1,
  }
});