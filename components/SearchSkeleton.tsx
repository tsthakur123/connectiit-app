import { View } from "react-native";
import { Shimmer } from "@/components/Shimmer";

export const SearchSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          className="flex-row items-center bg-secondary rounded-2xl p-4 mb-3"
        >
          {/* Avatar */}
          <Shimmer width={48} height={48} borderRadius={24} />

          {/* Text */}
          <View className="flex-1 ml-4">
            <Shimmer height={14} width="60%" />
            <View className="h-2" />
            <Shimmer height={12} width="40%" />
          </View>

          {/* Follow button */}
          <Shimmer width={70} height={28} borderRadius={14} />
        </View>
      ))}
    </>
  );
};
