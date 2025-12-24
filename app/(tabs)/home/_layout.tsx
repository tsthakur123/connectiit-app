import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createMaterialTopTabNavigator();

// This makes the navigator work with Expo Router's file system
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function HomeLayout() {
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarStyle: { display: 'none' }, // Hides the tab bar if you have your own custom UI
      }}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: "Feed" }} />
      <MaterialTopTabs.Screen name="dm" options={{ title: "DM" }} />
    </MaterialTopTabs>
  );
}