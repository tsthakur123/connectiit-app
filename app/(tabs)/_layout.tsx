import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import CustomTabBar from '../../components/CustomTabBar';
import { AuthGuard } from '@/components/AuthGuard';

export default function TabLayout() {
  return (
    <AuthGuard>
      <Tabs 
        screenOptions={{ 
          tabBarActiveTintColor: 'blue', 
          headerShown: false,
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="communities"
          options={{
            title: 'Communities',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="group" color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={color} />,
          }}
        />
        <Tabs.Screen
          name="travel"
          options={{
            title: 'Travel',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="plane" color={color} />,
          }}
        />
        <Tabs.Screen
          name="random-chat"
          options={{
            title: 'Random Chat',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="comments" color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
