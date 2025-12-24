import React, { useCallback, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import OnlineUsers from "@/components/OnlineUsers";
import { useSocket } from "@/context/SocketContext";

type ChatItem = {
  chatId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
};

const formatTime = (iso: string) => {
  if (!iso) return "";

  const date = new Date(iso);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHr < 24) return `${diffHr}h`;
  if (diffDay === 1) return "yesterday";

  return date.toLocaleDateString();
};


const DMScreen = () => {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userinfo=await jwtDecode(token||"");
        console.log(userinfo)
        setUser(userinfo)
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
    loadUser();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const base =
        process.env.CHAT_SERVICE_URL || "http://localhost:3000/api";

      // Get current user ID from decoded token
      const token = await AsyncStorage.getItem("token");
      let currentUserId = null;
      
      if (token) {
        try {
          const userinfo: any = await jwtDecode(token);
          // Try different possible fields for user ID
          currentUserId = userinfo?.user_id || userinfo?.id || user?.id || user?.user_id;
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
      
      // Fallback to user state if available
      if (!currentUserId && user) {
        currentUserId = (user as any)?.id || (user as any)?.user_id;
      }

      if (!currentUserId) {
        console.error("No user ID available for fetching chats");
        setLoading(false);
        return;
      }

      const resp = await fetch(`${base}/chats?userId=${currentUserId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (!resp.ok) {
        throw new Error(`Failed to fetch chats: ${resp.status}`);
      }

      const data = await resp.json();
      setChats(data.chats ?? []);
    } catch (err) {
      console.error("fetchChats error", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("#FE744D");
      // Refresh chats when screen comes into focus
      fetchChats();

      return () => {
        StatusBar.setBarStyle("light-content");
        StatusBar.setBackgroundColor("#1B1730");
      };
    }, [])
  );

  useEffect(() => {
    fetchChats();
  }, []);

  // Wrap fetchUsers in useCallback to prevent infinite re-renders
  const fetchOnlineUsers = useCallback(async (cursor?: string | null, limit = 30) => {
    try {
      const base =
        process.env.CHAT_SERVICE_URL ||
        "http://localhost:3000/api";
      const q =
        `?limit=${limit}` + (cursor ? `&cursor=${cursor}` : "");
      const resp = await fetch(`${base}/online${q}`);
      if (!resp.ok) throw new Error("Network response not ok");
      const data = await resp.json();
      return {
        users: data.users ?? [],
        nextCursor: data.nextCursor ?? null,
      };
    } catch (err) {
      console.error("fetchOnline error", err);
      return { users: [], nextCursor: null };
    }
  }, []); // Empty dependency array since it doesn't depend on any state

  // Listen for real-time chat updates via Socket.IO
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleChatUpdate = (updateData: { chatId: string; lastMessage: string; updatedAt: string }) => {
      console.log("📬 Received chat-update:", updateData); // Debug log
      setChats(prev => {
        const existingChatIndex = prev.findIndex(chat => chat.chatId === updateData.chatId);
        
        if (existingChatIndex >= 0) {
          // Update existing chat - move to top and update last message
          const updatedChats = [...prev];
          const updatedChat = {
            ...updatedChats[existingChatIndex],
            lastMessage: updateData.lastMessage,
            updatedAt: updateData.updatedAt, // Should be ISO string from backend
          };
          
          // Remove from current position and add to top
          updatedChats.splice(existingChatIndex, 1);
          console.log("✅ Chat updated and moved to top:", updateData.chatId);
          return [updatedChat, ...updatedChats];
        } else {
          // New chat - fetch full chat list to get user info
          console.log("🆕 New chat detected, refreshing list");
          fetchChats();
          return prev;
        }
      });
    };

    socket.on("chat-update", handleChatUpdate);

    return () => {
      socket.off("chat-update", handleChatUpdate);
    };
  }, [socket, isConnected]);

  // const fetchChats = async () => {
  //   try {
  //     setLoading(true);
  //     const base =
  //       process.env.CHAT_SERVICE_URL || "http://localhost:3000/api";

  //     const resp = await fetch(`${base}/chats`, {
  //       headers: {
  //         // Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await resp.json();
  //     setChats(data.chats ?? []);
  //   } catch (err) {
  //     console.error("fetchChats error", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 border-b border-gray-800"
      onPress={() => router.push(`/chat/${item.chatId}`)}
    >
      <View className="w-12 h-12 rounded-full bg-gray-600 mr-4" />

      <View className="flex-1">
        <Text className="font-semibold text-white">
          {item.user.name}
        </Text>
        <Text
          className="text-sm text-gray-400"
          numberOfLines={1}
        >
          {item.lastMessage || "Start a conversation"}
        </Text>
      </View>

      <View className="items-end ml-2">
        <Text className="text-xs text-gray-400">
          {formatTime(item.updatedAt)}
        </Text>

        {item.unreadCount > 0 && (
          <View className="bg-orange rounded-full px-2 mt-1">
            <Text className="text-xs text-black">
              {item.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-orange">
      {/* Header */}
      <Text className="p-2 pt-4 text-3xl font-bold text-black">
        Hi, {user?.name || "User"}
      </Text>

      {/* Active Now */}
      <Text className="px-4 text-xl font-bold text-black mt-20">
        active now
      </Text>

      <OnlineUsers
        fetchUsers={fetchOnlineUsers}
        onPressUser={(id) =>
          router.push({ pathname: "/chat/[id]", params: { id } })
        }
      />

      {/* Chat List */}
      <View className="flex-1 bg-primary rounded-t-[2.5rem] pt-8">
        <FlatList
          data={chats}
          keyExtractor={(item) => item.chatId}
          renderItem={renderChatItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            !loading ? (
              <Text className="text-gray-400 text-center mt-10">
                No chats yet
              </Text>
            ) : null
          }
        />
      </View>
    </View>
  );
};

export default DMScreen;
