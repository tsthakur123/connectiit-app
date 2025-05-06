import React from "react";
import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native";

type OnlineUser = {
  id: string;
  name: string;
  avatar: string;
};

interface Props {
  users: OnlineUser[];
  onPressUser?: (id: string) => void;
}

const OnlineUsers: React.FC<Props> = ({ users, onPressUser }) => {
  return (
    <View className="py-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-2"
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {users.map((user,i) => (
          <TouchableOpacity
            key={user.id}
            onPress={() => onPressUser?.(user.id)}
            className="items-center mx-2"
          >
            <View className="relative w-14 h-14 rounded-full mb-1">
            <View className="relative w-14 h-14 rounded-full overflow-hidden mb-1">
              <Image
                source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=User${i + 1}` }}
                className="w-full h-full"
                resizeMode="cover"
              />
              {/* Green dot */}
            </View>
              <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-orange rounded-full" />
            </View>
            <Text className="text-xs text-white2">{user.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default OnlineUsers;
