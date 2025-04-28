import { ProfileScreen } from '@/screens/ProfileScreen'
import React from 'react'
import { SafeAreaView, Text, View, StyleSheet } from 'react-native'
import CustomTabBar from '../components/CustomTabBar'

const profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* <Text style={styles.title}>Profile</Text> */}
          {/* <Text>HEYYYYY Profile</Text>
          Add your profile content here */}
          <ProfileScreen/>
      </View>
      
      {/* Custom TabBar with profile tab hidden */}
      <CustomTabBar showProfile={false} />
    </SafeAreaView>
  )
}

export default profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});