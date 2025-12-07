import React, { useCallback, forwardRef, useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import axios from "axios";

interface CommentsSheetProps {
  snapPoints: (string | number)[];
  data: any[];
  postID?: string;
  userID?: string;
  onCommentAdded?: () => void;
}

const CommentsSheet = forwardRef<any, CommentsSheetProps>(({ snapPoints, data, postID, userID, onCommentAdded }, ref) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSheetChange = useCallback((index: number) => {
    // console.log("handleSheetChange", index);
  }, []);

  const handlePostComment = async () => {
    if (!commentText.trim()) {
      return;
    }

    if (!postID || !userID) {
      console.error("Missing postID or userID");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        post_id: postID,
        user_id: userID,
        content: commentText,
      };

      const response = await axios.post(
        "http://localhost:3009/api/post/comments",
        payload
      );

      console.log("Comment posted successfully:", response.data);
      setCommentText("");
      
      // Callback to refresh comments
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      // Handle both string and object formats
      const commentContent = typeof item === 'string' ? item : item.content;
      const userName = item.user_id ? item.user_id.substring(0, 8) : 'Anonymous';
      
      return (
        <View style={styles.itemContainer}>
          <Text style={styles.commentUserName}>{userName}</Text>
          <Text style={styles.commentText}>{commentContent}</Text>
        </View>
      );
    },
    []
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Be the first to comment</Text>
      </View>
    ),
    []
  );

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      index={-1}
      enableDynamicSizing={false}
      enablePanDownToClose
      onChange={handleSheetChange}
      backgroundStyle={styles.bottomSheet}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Comments</Text>
      </View>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor="#999"
          value={commentText}
          onChangeText={setCommentText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handlePostComment}
          disabled={isSubmitting || !commentText.trim()}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "..." : "Post"}
          </Text>
        </TouchableOpacity>
      </View>

      <BottomSheetFlatList
        data={data}
        keyExtractor={(item, i) => item.ID || item.id || i.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={renderEmptyComponent}
      />
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "#1B1730",
    borderRadius: 30,
  },
  handleIndicator: {
    backgroundColor: "#F1f1f1",
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fafafa",
  },
  contentContainer: {
    backgroundColor: "#1B1730",
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 6,
  },
  commentUserName: {
    color: "#1B1730",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 4,
  },
  commentText: {
    color: "#333",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#fafafa",
    fontSize: 16,
    fontWeight: "500",
  },
  commentInputContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    alignItems: "flex-end",
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#262438",
    color: "#fafafa",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#FE744D",
  },
  submitButton: {
    backgroundColor: "#FE744D",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#1B1730",
    fontWeight: "600",
    fontSize: 14,
  },
});
export default CommentsSheet;
