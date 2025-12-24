// import React, { useCallback, useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
//   StyleSheet,
//   StatusBar,
//   ActivityIndicator,
// } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
// import { ArrowLeft, ChevronLeft, SendHorizonal } from "lucide-react-native";
// import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
// import { getuserInfo } from "@/services/user_info.service";

// /**
//  * DMChatScreen
//  * - Loads DM history from chat-service in pages of 30 messages.
//  * - Stores history in `messages` state (oldest -> newest).
//  * - Uses inverted FlatList and `onEndReached` to fetch older messages (vertical infinite scroll).
//  *
//  * Note: replace `currentUserId` with your authenticated user's id when integrating.
//  */
// export default function DMChatScreen() {
//   const { id } = useLocalSearchParams(); // recipient id from route params

//   const [currentUserId, setCurrentUserId] = useState<string | null>(null);

//   // Resolve current logged-in user id from stored token using getuserInfo()
//   // getuserInfo decodes the JWT and returns the claims; adapt the property
//   // access here to match your token shape (claims.user_id, sub, id, etc.).
//   useEffect(() => {
//     let mounted = true;
//     const resolveUser = async () => {
//       try {
//         const info: any = await getuserInfo();
//         // Common claim names: 'user_id', 'sub', 'id', 'name'
//         const uid = info?.claims?.user_id ?? info?.user_id ?? info?.sub ?? info?.id ?? info?.name;
//         if (mounted) setCurrentUserId(uid ?? "currentUser");
//       } catch (err) {
//         console.error("Error getting user info:", err);
//         if (mounted) setCurrentUserId("currentUser");
//       }
//     };
//     resolveUser();
//     return () => { mounted = false; };
//   }, []);

//   const [messages, setMessages] = useState([]); // stored oldest -> newest
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [nextCursor, setNextCursor] = useState(null); // ISO timestamp for older pages
//   const pageSize = 30;
//   const listRef = useRef(null);

//   useFocusEffect(
//     useCallback(() => {
//       // Set status bar for DM screen
//       StatusBar.setBarStyle("light-content");
//       StatusBar.setBackgroundColor("#FE744D");

//       return () => {
//         // Reset to default when leaving (optional)
//         StatusBar.setBarStyle("light-content");
//         StatusBar.setBackgroundColor("#1B1730");
//       };
//     }, [])
//   );

//   // Fetch initial (latest) messages when screen mounts or recipient changes
//   useEffect(() => {
//     // Only fetch after we have resolved the current user id
//     if (!currentUserId) return;
//     fetchMessages();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id, currentUserId]);

//   // fetchMessages: when cursor is null -> latest messages; when cursor provided -> older messages
//   const fetchMessages = async (cursor = null) => {
//     if (!id) return;
//     try {
//       if (cursor) setLoadingMore(true);
//       else setLoading(true);

//       const base = process.env.CHAT_SERVICE_URL || "http://localhost:3000/api";
//       const body = { user1: currentUserId, user2: String(id), limit: pageSize };
//       if (cursor) body.before = cursor;

//       const resp = await fetch(`${base}/messages/dm`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       if (!resp.ok) throw new Error("Network response not ok");
//       const data = await resp.json();

//       // data: { messages: [...], nextCursor }
//       // messages returned oldest -> newest
//       if (cursor) {
//         // prepend older messages to existing list
//         setMessages(prev => [...data.messages, ...prev]);
//       } else {
//         // initial load: set messages to latest batch
//         setMessages(data.messages);
//         // after initial load, scroll to bottom (most recent)
//         setTimeout(() => listRef.current?.scrollToEnd?.(), 50);
//       }

//       setNextCursor(data.nextCursor ?? null);
//     } catch (err){
//       console.error("fetchMessages error", err);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // Called when user scrolls to top (FlatList is inverted) to load older messages
//   const handleLoadMore = () => {
//     if (loadingMore || !nextCursor) return;
//     fetchMessages(nextCursor);
//   };

//   return (
//     <KeyboardAvoidingView
//       className="flex-1 bg-orange"
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//       keyboardVerticalOffset={90}
//     >
//       {/* Header */}
//       <View className="flex-row items-center px-4 py-6 bg-orange">
//         <TouchableOpacity onPress={() => router.back()}>
//           <ChevronLeft color="white" size={32} />
//         </TouchableOpacity>
//         <Image
//           source={{ uri: `https://i.pravatar.cc/150?img=${id ?? 5}` }}
//           className="w-10 h-10 rounded-full mr-3"
//         />
//         <View>
//           <View>
//             <Text className="text-white font-bold text-base">{id ?? 'User'}</Text>
//             <Text className="text-white text-sm opacity-90">active now</Text>
//           </View>
//         </View>
//       </View>

//       <View className="flex-1 bg-primary rounded-t-[2.5rem]">
//         {loading && (
//           <View className="py-4">
//             <ActivityIndicator color="#FE744D" />
//           </View>
//         )}

//         <FlatList
//           ref={listRef}
//           data={messages}
//           keyExtractor={(item) => item._id ?? item.id}
//           renderItem={({ item }) => (
//             <View
//               className={`px-4 py-2 mb-1 mx-3 rounded-2xl max-w-[70%] ${
//                 item.userId === currentUserId ? "self-end bg-orange" : "self-start bg-white2"
//               }`}
//             >
//               <Text className={`text-lg ${item.userId === currentUserId ? "text-white2" : "text-black"}`}>
//                 {item.content ?? item.text}
//               </Text>
//             </View>
//           )}
//           contentContainerStyle={{ paddingVertical: 10 }}
//           inverted
//           onEndReached={handleLoadMore}
//           onEndReachedThreshold={0.1}
//           ListFooterComponent={loadingMore ? <ActivityIndicator /> : null}
//         />

//         {/* Message Input */}
//         <View className="flex-row items-center px-4 py-2 border-t border-secondary">
//           <TextInput
//             placeholder="Message..."
//             placeholderTextColor="#aaa"
//             className="flex-1 px-3 py-3 bg-secondary text-black dark:text-white rounded-full mr-2"
//           />
//           <TouchableOpacity style={styles.send}>
//             <SendHorizonal color="white" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   send: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     width: 38,
//     height: 38,
//     borderRadius: 17.5,
//     backgroundColor: "#FE744D",
//   },
// });