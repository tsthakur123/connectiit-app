import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

interface TabItem {
  name: string;
  icon: string;
  path: string;
}

const tabs: TabItem[] = [
  { name: 'Home', icon: 'home', path: '/(tabs)/home' },
  { name: 'Communities', icon: 'group', path: '/(tabs)/communities' },
  { name: 'Search', icon: 'search', path: '/(tabs)/search' },
  { name: 'Travel', icon: 'plane', path: '/(tabs)/travel' },
  { name: 'Random Chat', icon: 'comments', path: '/(tabs)/random-chat' },
];

interface CustomTabBarProps extends Partial<BottomTabBarProps> {
  showProfile?: boolean;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ showProfile = false, ...props }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<string>('');

  // Update active tab when pathname changes
  useEffect(() => {
    if (!pathname) return;
    // console.log("path", pathname);
    
    
    // First check if we're on a tab route
    for (const tab of tabs) {
      if (pathname === tab.path || tab.path.endsWith(pathname)) {
        setActiveTab(tab.path);
        return;
      }
    }
    
    // Then check if we're on the profile page
    if (pathname === '/profile') {
      // console.log("setting /profile");
      
      setActiveTab('/profile');
      return;
    }
    
    // For any other route, don't change the active tab
  }, []);

  // Handle tab press
  const handleTabPress = (path: string) => {
    setActiveTab(path);
    
    router.push(path as any);
  };

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={[
            styles.tabItem,
            activeTab === tab.path && styles.activeTabItem
          ]}
          onPress={() => handleTabPress(tab.path)}
        >
          <FontAwesome
            size={24}
            name={tab.icon as any}
            color={activeTab === tab.path ? '#007AFF' : '#8E8E93'}
          />
          <Text style={[
            styles.tabLabel,
            activeTab === tab.path && styles.activeTabLabel
          ]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
      
      {showProfile && (
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === '/profile' && styles.activeTabItem
          ]}
          onPress={() => handleTabPress('/profile')}
        >
          <FontAwesome
            size={24}
            name="user"
            color={activeTab === '/profile' ? '#007AFF' : '#8E8E93'}
          />
          <Text style={[
            styles.tabLabel,
            activeTab === '/profile' && styles.activeTabLabel
          ]}>
            Profile
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTabItem: {
    borderTopWidth: 2,
    borderTopColor: '#007AFF',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#8E8E93',
  },
  activeTabLabel: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default CustomTabBar; 