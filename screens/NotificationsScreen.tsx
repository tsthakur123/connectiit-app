import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { NotificationService, Notification } from '@/services/notification.service';

export default function NotificationsScreen() {
  const { token } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await NotificationService.fetchNotifications(token, true);
      if (res.success && res.data) {
        setNotifications(res.data.notifications ?? []);
      }
      setLoading(false);
    })();
  }, [token]);

  const markRead = async (id: string) => {
    const res = await NotificationService.markRead(id, token);
    if (res.success) {
      setNotifications((n) => n.map((it) => (it.id === id ? { ...it, is_read: true } : it)));
    } else {
      Alert.alert('Error', res.error || 'Failed to mark read');
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <View className="px-4 py-3 border-b border-[#2A2438]">
      <Text className="text-white font-semibold">{item.message}</Text>
      <Text className="text-gray-400 text-xs">{new Date(item.created_at).toLocaleString()}</Text>
      {!item.is_read && (
        <TouchableOpacity onPress={() => markRead(item.id)} className="mt-2 bg-[#FE744D] px-3 py-1 rounded">
          <Text className="text-white">Mark read</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#1B1730]"><ActivityIndicator /></View>
    );
  }

  return (
    <View className="flex-1 bg-[#1B1730]">
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View className="items-center justify-center mt-8">
            <Text className="text-gray-300">No notifications</Text>
          </View>
        )}
      />
    </View>
  );
}
