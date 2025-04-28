import CommunityTabs from "@/components/CommunityTabs";
import { useState } from "react";
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const communities = () => {
  const [currentCommunity, setCurrentCommunity] = useState("all");
  return (
    <SafeAreaView>
       <CommunityTabs onChange={setCurrentCommunity} />
      <View className="items-center justify-center">
        <Text className="text-lg text-black">Showing: {currentCommunity}</Text>
        {/* Replace with flatlist of community posts/messages */}
        </View>
    </SafeAreaView>
  )
}

export default communities
