import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react-native";

interface Post {
  id: string;
  title: string;
  content: string;
  image?: string; // Optional image URL
  author: string;
  upvotes: number;
  comments: number;
  time: string;
  community: string;
}

const CommunityPostCard = ({ post }: { post: Post }) => {
  return (
      <View className="p-4 mb-4 rounded-2xl shadow-md bg-secondary">
        <View className="flex-row items-center justify-between">
          <View style={styles.postHeader}>
            <View style={styles.avatar} />
            <Text style={styles.username} className="text-[#fafafa]">
              {post.author}
            </Text>
          </View>
          <Text className="text-[#fafafa]">{post.time}</Text>
        </View>
        <Text className="text-white text-base font-semibold mb-1">
          {post.title}
        </Text>

        <Text className="text-gray-300 text-sm mb-2">{post.content}</Text>

        {post.image && (
          <Image
            source={{ uri: post.image }}
            className="w-full h-48 rounded-xl mb-2"
            resizeMode="cover"
          />
        )}

        <View className="flex-row justify-between items-center mt-2">
          <View className="flex-row items-center space-x-3 gap-10">
            <TouchableOpacity className="flex-row items-center space-x-1">
              <ThumbsUp size={18} color="#FE744D" />
              <Text className="text-white text-xs">{post.upvotes}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center space-x-1">
              <ThumbsDown size={18} color="#FE744D" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center space-x-1">
              <MessageCircle size={18} color="#FE744D" />
              <Text className="text-white text-xs">{post.comments}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  username: {
    fontWeight: "600",
  },
});
export default CommunityPostCard;
