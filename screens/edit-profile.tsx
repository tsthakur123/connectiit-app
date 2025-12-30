import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [secondaryEmail, setSecondaryEmail] = useState("");
  const [college, setCollege] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [userid, setUserid] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const userinfo: any = jwtDecode(token);
        const res = await axios.get(
          `http://localhost:3006/api/users/me/${userinfo.user_id}`
        );
        const user = res.data;
        setUserid(user.id);
        setName(user.name || "");
        setSecondaryEmail(user.secondary_email || "");
        setCollege(user.college || "");
        setBio(user.bio || "");
        setInterests((user.interests || []).join(","));
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const submit = async () => {
    try {
      const body: any = { id: userid };
      if (name) body.name = name;
      if (secondaryEmail) body.secondary_email = secondaryEmail;
      if (college) body.college = college;
      if (bio) body.bio = bio;
      if (interests)
        body.interests = interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

      if (body.id === "") {
        console.log("User ID is missing");
        return;
      }

      await axios.patch("http://localhost:3006/api/users/update", body);
      Alert.alert("Success", "Profile updated");
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return (
    <ScrollView
      className="flex-1 p-4"
      style={{ backgroundColor: "#1B1730" }} // primary background
    >
      {/* Back Button */}
      <TouchableOpacity
        className="mb-6 px-4 py-2 rounded-full"
        style={{ backgroundColor: "#FE744D", alignSelf: "flex-start" }}
        onPress={() => router.back()}
      >
        <Text className="text-white font-semibold">← Back to Profile</Text>
      </TouchableOpacity>

      {/* Input Fields */}
      {[
        { label: "Name", value: name, setter: setName },
        {
          label: "Secondary Email",
          value: secondaryEmail,
          setter: setSecondaryEmail,
          keyboardType: "email-address",
        },
        { label: "College", value: college, setter: setCollege },
        { label: "Bio", value: bio, setter: setBio, multiline: true, lines: 4 },
        {
          label: "Interests (comma separated)",
          value: interests,
          setter: setInterests,
        },
      ].map((field, idx) => (
        <View className="mb-4" key={idx}>
          <Text className="text-white mb-1 font-semibold">{field.label}</Text>
          <TextInput
            value={field.value}
            onChangeText={field.setter}
            keyboardType={field.keyboardType || "default"}
            multiline={field.multiline || false}
            numberOfLines={field.lines || 1}
            className="p-3 rounded-xl"
            style={{ backgroundColor: "#262438", color: "#fafafa" }} // secondary card bg + text
          />
        </View>
      ))}

      {/* Action Buttons */}
      <TouchableOpacity
        className="mb-3 py-3 rounded-xl items-center"
        style={{ backgroundColor: "#FE744D" }} // orange
        onPress={submit}
      >
        <Text className="text-white font-semibold text-lg">Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="py-3 rounded-xl items-center border"
        style={{ borderColor: "#FE744D" }} // orange border
        onPress={() => router.back()}
      >
        <Text className="text-white font-semibold text-lg">Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;
