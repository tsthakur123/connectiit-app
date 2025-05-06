import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

const UserProfile = () => {
  const { username } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center bg-[#1B1730]">
      <Text className="text-white text-xl font-semibold">
        Profile: {username}
      </Text>
    </View>
  );
};

export default UserProfile;
