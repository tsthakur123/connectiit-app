import ComingSoon from "@/components/ComingSoon"
import TripsScreen from "@/screens/TripsScreen"
import { Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"


const search = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary px-4">
      {/* <TripsScreen/> */}
      <ComingSoon/>
    </SafeAreaView>
  )
}

export default search
