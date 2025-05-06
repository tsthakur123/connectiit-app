import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

interface TabItem {
  name: string;
  icon: string;
  path: string;
}

const tabs: TabItem[] = [
  { name: "Home", icon: "home", path: "/(tabs)/home" },
  { name: "Communities", icon: "group", path: "/(tabs)/communities" },
  { name: "Search", icon: "search", path: "/(tabs)/search" },
  { name: "Travel", icon: "plane", path: "/(tabs)/travel" },
  { name: "Random Chat", icon: "comments", path: "/(tabs)/random-chat" },
];

interface CustomTabBarProps extends Partial<BottomTabBarProps> {
  showProfile?: boolean;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ showProfile = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("");

  
  useEffect(() => {
    if (!pathname) return;
    
    for (const tab of tabs) {
      if (pathname === tab.path || tab.path.endsWith(pathname)) {
        setActiveTab(tab.path);
        return;
      }
    }
    if (pathname === "/profile") {
      setActiveTab("/profile");
    }
  }, [pathname]);

  const handleTabPress = (path: string) => {
    setActiveTab(path);
    router.push(path as any);
  };

  const allTabs = showProfile
    ? [...tabs, { name: "Profile", icon: "user", path: "/profile" }]
    : tabs;

  return (
    <View style={styles.wrapper}>
      <View style={styles.tabBar}>
        {allTabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.path)}
          >
            <View style={styles.iconTextContainer}>
              <FontAwesome
                size={22}
                name={tab.icon as any}
                color={activeTab === tab.path ? "#FE744D" : "#aaa"}
              />
              {activeTab === tab.path && (
                <Text style={styles.activeTabLabel}>{tab.name}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#262438",
    opacity: 0.92,
    borderRadius: 40,
    paddingVertical: 15,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    marginHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTextContainer: {
    alignItems: "center",
    width: 50, // Fixed width to prevent fluctuation
    justifyContent: "center",
    // backgroundColor:"white"
  },
  activeTabLabel: {
    fontSize: 10,
    marginTop: 4,
    color: "#FE744D",
    fontWeight: "600",
  },
});

export default CustomTabBar;
