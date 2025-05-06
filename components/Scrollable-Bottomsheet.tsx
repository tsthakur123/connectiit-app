import React, { useCallback, forwardRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

interface CommentsSheetProps {
  snapPoints: (string | number)[];
  data: string[];
}

const CommentsSheet = forwardRef<any, CommentsSheetProps>(({ snapPoints, data }, ref) => {
  const handleSheetChange = useCallback((index: number) => {
    // console.log("handleSheetChange", index);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <View style={styles.itemContainer}>
        <Text style={styles.commentText}>{item}</Text>
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
      <BottomSheetFlatList
        data={data}
        keyExtractor={(i) => i}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
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
  commentText: {
    color: "#333",
  },
});
export default CommentsSheet;
