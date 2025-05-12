import CustomTabBar from '@/components/CustomTabBar'
import DMChatScreen from '@/screens/DMChatScreen'
import DMScreen from '@/screens/DMScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
  return (
    <SafeAreaView className='flex-1'>
      <ProfileScreen/>
      {/* <DMChatScreen/> */}
      <CustomTabBar/>
    </SafeAreaView>
  )
}

export default index
