import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";

type OnlineUser = {
  id: string;
  name: string;
  avatar?: string;
};

interface FetchResult {
  users: OnlineUser[];
  nextCursor?: string | null;
}

interface Props {
  users?: OnlineUser[];
  onPressUser?: (id: string) => void;
  fetchUsers?: (cursor?: string | null, limit?: number) => Promise<FetchResult>;
  pageSize?: number;
}

const OnlineUsers: React.FC<Props> = ({
  users: usersProp,
  onPressUser,
  fetchUsers,
  pageSize = 30,
}) => {
  const [users, setUsers] = useState<OnlineUser[]>(usersProp ?? []);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const fetchingRef = useRef(false);

  const shouldFetch = !!fetchUsers && !usersProp;

  useEffect(() => {
    if (usersProp) setUsers(usersProp);
  }, [usersProp]);

  useEffect(() => {
    if (!shouldFetch) return;

    const loadInitial = async () => {
      setLoading(true);
      try {
        const res = await fetchUsers?.(null, pageSize);
        if (res) {
          setUsers(res.users ?? []);
          setCursor(res.nextCursor ?? null);
          setHasMore(!!res.nextCursor);
        }
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, [fetchUsers]);

  const fetchMore = async () => {
    if (!shouldFetch || !hasMore || fetchingRef.current) return;
    fetchingRef.current = true;
    setLoadingMore(true);

    try {
      const res = await fetchUsers?.(cursor, pageSize);
      if (res) {
        setUsers((prev) => [...prev, ...(res.users ?? [])]);
        setCursor(res.nextCursor ?? null);
        setHasMore(!!res.nextCursor);
      }
    } finally {
      fetchingRef.current = false;
      setLoadingMore(false);
    }
  };

  return (
    <View style={{ height: 100 }} className="py-2">
      <FlatList
        horizontal
        data={users}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 8,
          alignItems: "center",
        }}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.6}
        ListFooterComponent={
          loadingMore ? (
            <View className="px-4">
              <ActivityIndicator />
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onPressUser?.(item.id)}
            className="items-center mx-2"
          >
            <View className="relative w-14 h-14 rounded-full mb-1">
              <Image
                source={{
                  uri:
                    item.avatar ??
                    `https://api.dicebear.com/7.x/avataaars/png?seed=User${index + 1}`,
                }}
                className="w-full h-full rounded-full"
              />
              <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-orange rounded-full" />
            </View>
            <Text className="text-xs text-white2" numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {loading && (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

export default OnlineUsers;
