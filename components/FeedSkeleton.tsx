import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
// import { GradientShimmer } from "./GradientShimmer";
import { Shimmer } from "./Shimmer";

const SkeletonPost = () => (
  <View style={styles.post}>
    {/* Header */}
    <View style={styles.header}>
      <Shimmer width={35} height={35} borderRadius={18} />
      <Shimmer
        width={120}
        height={12}
        style={{ marginLeft: 10 }}
      />
    </View>

    {/* Caption */}
    <Shimmer
      height={14}
      style={{ marginHorizontal: 10, marginTop: 6 }}
    />
    <Shimmer
      height={14}
      width="70%"
      style={{ marginHorizontal: 10, marginTop: 6 }}
    />

    {/* Image */}
    <Shimmer
      height={300}
      borderRadius={20}
      style={{ marginHorizontal: 8, marginTop: 12 }}
    />

    {/* Actions */}
    <View style={styles.actions}>
      <Shimmer width={50} height={20} borderRadius={10} />
      <Shimmer
        width={50}
        height={20}
        borderRadius={10}
        style={{ marginLeft: 12 }}
      />
      <Shimmer
        width={50}
        height={20}
        borderRadius={10}
        style={{ marginLeft: 12 }}
      />
    </View>
  </View>
);


export const FeedSkeleton = () => {
  return (
    <FlatList
      data={[1, 2, 3]}
      keyExtractor={(i) => i.toString()}
      renderItem={() => <SkeletonPost />}
      contentContainerStyle={{ paddingBottom: 120 }}
    />
  );
};

const styles = StyleSheet.create({
  post: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  actions: {
    flexDirection: "row",
    padding: 10,
  },
});
