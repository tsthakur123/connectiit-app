import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import OnlineUsers from "@/components/OnlineUsers";

const onlineUsers = [
  {
    id: "1",
    name: "Alice",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "2",
    name: "Bob",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "3",
    name: "Cathy",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "4",
    name: "Dan",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "5",
    name: "Eva",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "6",
    name: "Frank",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: "7",
    name: "Grace",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    id: "8",
    name: "Henry",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: "9",
    name: "Isla",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    id: "10",
    name: "Jake",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
  },
];

const DMScreen = () => {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      // Set status bar for DM screen
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("#FE744D");

      return () => {
        // Reset to default when leaving (optional)
        StatusBar.setBarStyle("light-content");
        StatusBar.setBackgroundColor("#1B1730");
      };
    }, [])
  );

  return (
    // <View className="flex-1 bg-primary">
    // {/* Header */}
    <View className="flex-1 bg-orange border-b border-gray-200 dark:border-gray-700">
      <Text className="p-2 pt-4 text-3xl font-bold text-black dark:text-white2">
        Hi, Tarun!
      </Text>
      {/* <Text className="p-2 text-lg font-bold text-black dark:text-white">
        Direct Messages
      </Text> */}
      <Text className="px-4 text-xl font-bold text-black dark:text-white mt-20">
        active now
      </Text>
      <OnlineUsers
        users={onlineUsers}
        onPressUser={(id) => console.log("Tapped user:", id)}
      />
      <View className="flex-1 bg-primary rounded-t-[2.5rem] pt-32">
        {/* // Chat List */}
        <ScrollView className="flex-1">
          {onlineUsers.map((user, i) => {
            return (
              <TouchableOpacity
                key={i}
                className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800"
                onPress={() => router.push(`/`)}
              >
                <View className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=User${i + 1}`}}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-black dark:text-white">
                    {user.name}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    This is a message preview...
                  </Text>
                </View>
                <Text className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                  5m
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>

    //   {/* Chat List
    //   <ScrollView className="flex-1">
    //     {Array(22)
    //       .fill(0)
    //       .map((_, i) => {
    //         const username = `User${i + 1}`;

    //         return (
    //           <TouchableOpacity
    //             key={i}
    //             className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800"
    //             onPress={() => router.push(`/`)}
    //           >
    //             <View className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-4" />
    //             <View className="flex-1">
    //               <Text className="font-semibold text-black dark:text-white">
    //                 {username}
    //               </Text>
    //               <Text className="text-sm text-gray-500 dark:text-gray-400">
    //                 This is a message preview...
    //               </Text>
    //             </View>
    //             <Text className="text-xs text-gray-400 dark:text-gray-500 ml-2">
    //               5m
    //             </Text>
    //           </TouchableOpacity>
    //         );
    //       })}
    //   </ScrollView> */}
    // {/* </View> */}
  );
};

export default DMScreen;
