import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";

type Community = {
  key: string;
  title: string;
};

const communities: Community[] = [
  { key: "all", title: "All" },
  { key: "tech", title: "Tech" },
  { key: "travel", title: "Travel" },
  { key: "startups", title: "Startups" },
  { key: "gaming", title: "Gaming" },
  { key: "music", title: "Music" },
  { key: "fitness", title: "Fitness" },
  { key: "design", title: "Design" },
  { key: "books", title: "Books" },
  { key: "memes", title: "Memes" },
];

interface Props {
  onChange: (key: string) => void;
}

const CommunityTabs: React.FC<Props> = ({ onChange }) => {
  const [active, setActive] = useState("all");

  const handlePress = (key: string) => {
    setActive(key);
    onChange(key);
  };

  return (
    <View className="border-b border-[#262438] bg-primary">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-2 py-2"
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {communities.map((comm) => {
          const isActive = active === comm.key;

          return (
            <TouchableOpacity
              key={comm.key}
              onPress={() => handlePress(comm.key)}
              className={`px-4 mx-1 rounded-full ${
                isActive
                  ? "bg-orange"
                  : "bg-secondary border border-primary"
              }`}
            >
              <Text
                className={`text-lg font-medium rounded-full p-2 ${
                  isActive ? "text-white" : "text-gray-300"
                }`}
              >
                {comm.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CommunityTabs;
