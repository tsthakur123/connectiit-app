import DMScreen from '@/screens/DMScreen'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
  return (
    <SafeAreaView className='flex-1'>
      <DMScreen/>
    </SafeAreaView>
  )
}

export default index
