import CustomTabBar from '@/components/CustomTabBar'
import DMScreen from '@/screens/DMScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
  return (
    <SafeAreaView className='flex-1'>
      <DMScreen/>
      <CustomTabBar/>
    </SafeAreaView>
  )
}

export default index
