import React, { forwardRef, useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { api } from "@/lib/api";
import { Trash2 } from "lucide-react-native";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  replies?: Comment[];
}

interface CommentsSheetProps {
  snapPoints: (string | number)[];
  data: Comment[];
  postID?: string;
  onCommentAdded?: () => void;
}

const CommentsSheet = forwardRef<any, CommentsSheetProps>(
  ({ snapPoints, data, postID, onCommentAdded }, ref) => {
    const [commentText, setCommentText] = useState("");
    const [replyTo, setReplyTo] = useState<string | undefined>(undefined);
    const [submitting, setSubmitting] = useState(false);
    const [confirmDeleteID, setConfirmDeleteID] = useState<string | null>(null);

    // ─────────────────────────────────────────────
    // Add Comment / Reply
    // ─────────────────────────────────────────────
    const handlePostComment = async () => {
      if (!commentText.trim() || !postID) return;

      setSubmitting(true);
      try {
        await api.post(`/feed/${postID}/comment`, {
          content: commentText,
          parent_id: replyTo,
        });

        setCommentText("");
        setReplyTo(undefined);
        onCommentAdded?.();
      } catch (err) {
        console.error("Add comment error:", err);
      } finally {
        setSubmitting(false);
      }
    };

    // ─────────────────────────────────────────────
    // Delete Comment
    // ─────────────────────────────────────────────
    const handleDeleteComment = async (commentID: string) => {
      try {
        await api.delete(`/feed/comments/${commentID}`);
        setConfirmDeleteID(null);
        onCommentAdded?.();
      } catch (err) {
        console.error("Delete error:", err);
      }
    };

    // ─────────────────────────────────────────────
    // Render Comment (recursive, max depth = 2)
    // ─────────────────────────────────────────────
    const renderComment = useCallback(
      (comment: Comment, isReply = false) => {
        const isConfirming = confirmDeleteID === comment.id;

        return (
          <View
            key={comment.id}
            style={[styles.commentContainer, isReply && styles.replyContainer]}
          >
            {/* HEADER ROW */}
            <View style={styles.commentHeader}>
              <Text style={styles.commentUser}>
                {comment.user_id.slice(0, 8)}
              </Text>

              {!isConfirming ? (
                // 🗑️ DELETE ICON
                <Pressable
                  onPress={() => setConfirmDeleteID(comment.id)}
                  style={styles.deleteIconBtn}
                  hitSlop={10}
                >
                  <Trash2 size={16} color="#D80000" />
                </Pressable>
              ) : (
                // ✅ CONFIRM / ❌ CANCEL
                <View style={styles.confirmRow}>
                  <Pressable
                    onPress={() => handleDeleteComment(comment.id)}
                    style={styles.confirmBtn}
                  >
                    <Text style={styles.confirmText}>Confirm</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setConfirmDeleteID(null)}
                    style={styles.cancelBtn}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* COMMENT TEXT */}
            <Text style={styles.commentText}>{comment.content}</Text>

            {/* REPLY ACTION */}
            {!isReply && !isConfirming && (
              <Pressable
                onPress={() => setReplyTo(comment.id)}
                style={styles.replyButton}
              >
                <Text style={styles.replyText}>Reply</Text>
              </Pressable>
            )}

            {/* REPLIES */}
            {comment.replies?.map((reply) => renderComment(reply, true))}
          </View>
        );
      },
      [confirmDeleteID]
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Comments</Text>
        </View>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder={replyTo ? "Replying to comment…" : "Add a comment…"}
            placeholderTextColor="#999"
            style={styles.input}
            multiline
          />

          <Pressable
            onPress={handlePostComment}
            disabled={submitting || !commentText.trim() || !postID}
            style={[
              styles.postButton,
              (submitting || !commentText.trim() || !postID) &&
                styles.disabledButton,
            ]}
          >
            <Text style={styles.postButtonText}>
              {submitting ? "..." : "Post"}
            </Text>
          </Pressable>
        </View>

        {/* Comments */}
        <BottomSheetFlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderComment(item)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Be the first to comment</Text>
          }
        />
      </BottomSheet>
    );
  }
);

export default CommentsSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#1B1730",
    borderRadius: 24,
  },
  handleIndicator: {
    backgroundColor: "#aaa",
  },
  header: {
    alignItems: "center",
    paddingVertical: 10,
  },
  headerText: {
    color: "#fafafa",
    fontSize: 18,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#262438",
    color: "#fafafa",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FE744D",
  },
  postButton: {
    backgroundColor: "#FE744D",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  postButtonText: {
    color: "#1B1730",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 30,
  },
  commentContainer: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 15,
    marginVertical: 6,
  },
  replyContainer: {
    marginLeft: 20,
    backgroundColor: "#e6e6e6",
  },
  commentUser: {
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 2,
  },
  commentText: {
    color: "#333",
  },
  replyButton: {
    marginTop: 4,
  },
  replyText: {
    fontSize: 12,
    color: "#FE744D",
  },
  emptyText: {
    color: "#fafafa",
    textAlign: "center",
    marginTop: 20,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  deleteIconBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: "#FFEAEA",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
});
