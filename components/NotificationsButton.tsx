import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { NotificationService, Notification } from '@/services/notification.service';

const NotificationsButton: React.FC = () => {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let unsub: any;
    let mounted = true;

    const init = async () => {
      if (!user) return;

      const res = await NotificationService.fetchNotifications(token, false);
      if (mounted && res.success && res.data && Array.isArray(res.data.notifications)) {
        setCount(
          res.data.notifications.filter((n: Notification) => !n.is_read).length
        );
      }

      unsub = NotificationService.subscribe(user.id, token, () => {
        setCount(c => c + 1);
      });
    };

    init();

    return () => {
      mounted = false;
      if (typeof unsub === 'function') unsub();
    };
  }, [user, token]);

  return (
    <TouchableOpacity onPress={() => router.push('/notifications')} style={{ marginRight: 8 }}>
      <View style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white', fontSize: 18 }}>🔔</Text>
        {count >= 0 && (
          <View style={{
            position: 'absolute',
            top: -6,
            right: -6,
            backgroundColor: '#FE744D',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 12
          }}>
            <Text style={{ color: 'white', fontSize: 10 }}>{count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NotificationsButton;