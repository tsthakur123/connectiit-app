import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FeedScreen from '@/screens/FeedScreen';
import DMScreen from '@/screens/DMScreen';

const Tab = createMaterialTopTabNavigator();

const home = () => {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarStyle: { display: 'none' }
    }}>
    <Tab.Screen name="Home" component={FeedScreen} />
    <Tab.Screen name="DM" component={DMScreen} />
  </Tab.Navigator>
  )
}

export default home
