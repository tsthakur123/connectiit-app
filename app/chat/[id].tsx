// app/chat/[id].tsx
import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ChevronLeft, SendHorizonal } from "lucide-react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { useSocket } from "../../context/SocketContext";
import TypingIndicator from "../../components/TypingIndicator";

// Chat screen: fetches messages (30 per request) from chat-service and supports
// vertical infinite scroll to load older messages. Uses Socket.IO for realtime messaging.

export default function DMChatScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const { socket, isConnected, sendDM } = useSocket();
  const [messages, setMessages] = useState([]); // messages ordered oldest -> newest
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [nextCursor, setNextCursor] = useState(null); // ISO timestamp string for older messages
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Other user typing state
  const pageSize = 30; // fetch 30 messages per request as requested
  const listRef = useRef(null);
  const recipientId = String(id);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingSentRef = useRef(false); // Track if we've sent typing-start

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("#FE744D");

      return () => {
        StatusBar.setBarStyle("light-content");
        StatusBar.setBackgroundColor("#1B1730");
      };
    }, [])
  );

  // Fetch initial page of messages (latest messages)
  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Listen for incoming messages via Socket.IO
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleReceiveDM = (messageData: any) => {
      // Only add message if it's for this chat
      if (messageData.userId === recipientId || messageData.recipientId === recipientId) {
        setMessages(prev => {
          // Check if message already exists (avoid duplicates)
          const exists = prev.some(msg => msg._id === messageData._id);
          if (exists) return prev;
          return [...prev, messageData];
        });
        // Scroll to bottom when receiving new message
        setTimeout(() => listRef.current?.scrollToOffset?.({ offset: 0, animated: true }), 100);
      }
    };

    const handleDMSent = (messageData: any) => {
      // Only add message if it's for this chat
      if (messageData.recipientId === recipientId) {
        setMessages(prev => {
          // Check if message already exists (avoid duplicates)
          const exists = prev.some(msg => msg._id === messageData._id);
          if (exists) return prev;
          
          // Remove temp messages with matching content (sent by current user)
          // and add the real message
          const filtered = prev.filter(msg => 
            !msg.temp || 
            msg.userId !== user?.id || 
            msg.content !== messageData.content
          );
          
          return [...filtered, messageData];
        });
        // Scroll to bottom after sending message
        setTimeout(() => listRef.current?.scrollToOffset?.({ offset: 0, animated: true }), 100);
      }
    };

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      // Only show typing indicator if it's from the current chat recipient
      if (data.userId === recipientId) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on("receive-dm", handleReceiveDM);
    socket.on("dm-sent", handleDMSent);
    socket.on("user-typing", handleUserTyping);

    return () => {
      socket.off("receive-dm", handleReceiveDM);
      socket.off("dm-sent", handleDMSent);
      socket.off("user-typing", handleUserTyping);
    };
  }, [socket, isConnected, recipientId]);

  // Handle typing indicator - emit typing-start/stop events
  useEffect(() => {
    if (!socket || !isConnected || !user?.id || !inputText.trim()) {
      // Stop typing if input is empty
      if (typingSentRef.current) {
        socket?.emit("typing-stop", { userId: user?.id, receiverId: recipientId });
        typingSentRef.current = false;
      }
      return;
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing-start if not already sent
    if (!typingSentRef.current) {
      socket.emit("typing-start", { userId: user.id, receiverId: recipientId });
      typingSentRef.current = true;
    }

    // Set timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (socket && typingSentRef.current) {
        socket.emit("typing-stop", { userId: user.id, receiverId: recipientId });
        typingSentRef.current = false;
      }
    }, 3000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [inputText, socket, isConnected, user?.id, recipientId]);

  // Stop typing when component unmounts or chat changes
  useEffect(() => {
    return () => {
      if (socket && typingSentRef.current && user?.id) {
        socket.emit("typing-stop", { userId: user.id, receiverId: recipientId });
        typingSentRef.current = false;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, user?.id, recipientId]);

  // fetchMessages: when cursor is null -> returns latest `pageSize` messages
  // when cursor provided -> returns older messages with timestamp < cursor
  const fetchMessages = async (cursor = null) => {
    if (!id) return;
    try {
      if (cursor) setLoadingMore(true);
      else setLoading(true);

      const base = process.env.CHAT_SERVICE_URL || "http://localhost:3000/api";
      const body = { user1: user?.id || "currentUser", user2: String(id), limit: pageSize };
      if (cursor) body.before = cursor;

      const resp = await fetch(`${base}/messages/dm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) throw new Error("Network response not ok");
      const data = await resp.json();

      // data: { messages: [...], nextCursor }
      // messages are returned in oldest->newest order
      if (cursor) {
        // older messages: prepend to existing array
        setMessages(prev => [...data.messages, ...prev]);
      } else {
        // initial load: set messages
        setMessages(data.messages);
        // scroll to bottom after initial load (latest messages)
        setTimeout(() => listRef.current?.scrollToOffset?.({ offset: 0, animated: false }), 50);
      }

      setNextCursor(data.nextCursor ?? null);
    } catch (err) {
      console.error("fetchMessages error", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // onEndReached called when the user scrolls to the top (FlatList is inverted,
  // so reaching the end indicates user wants older messages). We fetch older messages
  // only if nextCursor exists.
  const handleLoadMore = () => {
    if (loadingMore || !nextCursor) return;
    fetchMessages(nextCursor);
  };

  // sendMessage: sends a new message via Socket.IO with REST API fallback
  const sendMessage = async () => {
    if (!inputText.trim() || !user?.id || !id) return;
    if (sending) return; // Prevent double sends

    const messageContent = inputText.trim();
    setInputText(""); // Clear input immediately for better UX
    
    // Stop typing indicator when sending message
    if (socket && typingSentRef.current && user?.id) {
      socket.emit("typing-stop", { userId: user.id, receiverId: recipientId });
      typingSentRef.current = false;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    setSending(true);

    // Optimistically add message (will be replaced by real message from socket)
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      userId: user.id,
      recipientId: recipientId,
      content: messageContent,
      timestamp: new Date().toISOString(),
      temp: true,
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      // Try Socket.IO first (realtime)
      if (isConnected && socket) {
        try {
          await sendDM(recipientId, messageContent);
          // Message will be added via socket event (dm-sent)
          // Temp message will be removed in handleDMSent handler
          return;
        } catch (socketError) {
          console.warn("Socket send failed, falling back to REST API:", socketError);
          // Fall through to REST API fallback
        }
      }

      // REST API fallback
      const base = process.env.CHAT_SERVICE_URL || "http://localhost:3000/api";
      const body = {
        userId: user.id,
        recipientId: recipientId,
        content: messageContent,
      };

      const resp = await fetch(`${base}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) throw new Error("Network response not ok");
      const data = await resp.json();

      // Replace temp message with real message
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.temp || msg._id !== tempMessage._id);
        return [...filtered, data.message];
      });

      // Scroll to bottom after sending message
      setTimeout(() => listRef.current?.scrollToOffset?.({ offset: 0, animated: true }), 50);
    } catch (err) {
      console.error("sendMessage error", err);
      // Restore input text on error
      setInputText(messageContent);
      // Remove temp message
      setMessages(prev => prev.filter(msg => !msg.temp || msg._id !== tempMessage._id));
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-orange"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View className="flex-row items-center px-4 py-6 bg-orange">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="white" size={32} />
        </TouchableOpacity>
        <Image
          source={{ uri: `https://i.pravatar.cc/150?img=${id}` }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View>
          <Text className="text-white font-bold text-base">{id}</Text>
          <Text className="text-white text-sm opacity-90">active now</Text>
        </View>
      </View>

      <View className="flex-1 bg-primary rounded-t-[2.5rem]">
        {loading && (
          <View className="py-4">
            <ActivityIndicator color="#FE744D" />
          </View>
        )}

        <FlatList
          ref={listRef}
          data={messages.slice().reverse()}
          keyExtractor={(item) => item._id ?? item.id}
          renderItem={({ item }) => (
            <View
              className={`px-4 py-2 mb-1 mx-3 rounded-2xl max-w-[70%] ${
                item.userId === user?.id ? "self-end bg-orange" : "self-start bg-white2"
              }`}
            >
              <Text className={`text-lg ${item.userId === user?.id ? "text-white2" : "text-black"}`}>
                {item.content ?? item.text}
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
          inverted
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListHeaderComponent={
            <>
              {isTyping && <TypingIndicator />}
            </>
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator /> : null
          }
        />

        <View className="flex-row items-center px-4 py-2 border-t border-secondary">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message..."
            placeholderTextColor="#aaa"
            className="flex-1 px-3 py-3 bg-secondary text-black dark:text-white rounded-full mr-2"
          />
          <TouchableOpacity 
            style={[styles.send, sending && styles.sendDisabled]} 
            onPress={sendMessage}
            disabled={sending || !inputText.trim()}
          >
            {sending ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <SendHorizonal color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  send: {
    justifyContent: "center",
    alignItems: "center",
    width: 38,
    height: 38,
    borderRadius: 17.5,
    backgroundColor: "#FE744D",
  },
  sendDisabled: {
    opacity: 0.5,
  },
});